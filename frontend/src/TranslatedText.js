import React from 'react';
import { get } from 'superagent';

class TranslatedText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            translation: '',
            loading: false
        };
    }

    componentDidMount() {
        this.translate();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.text !== this.props.text || prevProps.toLang !== this.props.toLang) {
            this.translate();
        }
    }

    translate() {
        const { text, toLang } = this.props;
        if (!text) {
            this.setState({ translation: '', loading: false });
            return;
        }

        if (toLang === 'english' || toLang === 'bengali') {
            this.setState({ translation: '', loading: false });
            return;
        }

        const cacheKey = `trans_${toLang}_${this.hashCode(text)}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            this.setState({ translation: cached, loading: false });
            return;
        }

        this.setState({ loading: true, translation: '' });
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
        get(url)
            .then(response => {
                try {
                    const json = JSON.parse(response.text);
                    if (json && json[0]) {
                        const translatedText = json[0].map(item => item[0]).join('');
                        localStorage.setItem(cacheKey, translatedText);
                        this.setState({ translation: translatedText, loading: false });
                    } else {
                        this.setState({ loading: false });
                    }
                } catch (e) {
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }

    render() {
        const { text, toLang } = this.props;
        if (toLang === 'english') {
            return <span>{text}</span>;
        }
        if (this.state.loading) {
            return <span className="translating-placeholder">Translating...</span>;
        }
        return <span>{this.state.translation || text}</span>;
    }
}

export default TranslatedText;
