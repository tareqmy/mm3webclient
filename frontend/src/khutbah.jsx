import React from 'react';
import './khutbah.css';
import miscs from './misc.json';
import TranslatedText from './TranslatedText';

class Khutbah extends React.Component {

    constructor(props) {
        super(props);
        const title = miscs.find(m => Number(m.id) === 4) || {
            type: "khutbah",
            arabic: "",
            english: "",
            bengali: "",
            id: 4,
        };
        const start = miscs.find(m => Number(m.id) === 5) || {
            type: "khutbah",
            arabic: "",
            english: "",
            bengali: "",
            id: 5,
        };
        const khutbah = miscs.find(m => Number(m.id) === 6) || {
            type: "khutbah",
            arabic: "",
            english: "",
            bengali: "",
            id: 6,
        };
        this.state = {
            title: title,
            start: start,
            khutbah: khutbah,
        };
    }

    done = () => {
        var init = localStorage.getItem('init');
        if (init === null || init === "khutbah") {
            init = "content";
        }
        localStorage.setItem('init', init);
        this.props.showComponent(init);
    }

    render() {
        return (
            <div className="khutbah">
                <div className="khutbah-panel arabic-panel">
                    <div className="panel-body">
                        <div className="arabic">
                            <div className="header">{this.state.title.arabic}</div>
                            <div className="start">{this.state.start.arabic}</div>
                            {this.state.khutbah.arabic}
                        </div>
                    </div>
                </div>
                {
                    this.props.lang !== "bengali" &&
                    <div className="khutbah-panel translation-panel">
                        <div className="panel-body">
                            <div className="english">
                                <div className="header">
                                    <TranslatedText text={this.state.title.english} toLang={this.props.lang} />
                                </div>
                                <div className="start">
                                    <TranslatedText text={this.state.start.english} toLang={this.props.lang} />
                                </div>
                                <TranslatedText text={this.state.khutbah.english} toLang={this.props.lang} />
                                {this.props.lang !== "english" && (
                                    <div className="translation-notice">
                                        This translation was automatically generated from English using Google Translate.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                {
                    this.props.lang === "bengali" &&
                    <div className="khutbah-panel translation-panel">
                        <div className="panel-body">
                            <div className="bengali">
                                <div className="header">{this.state.title.bengali}</div>
                                <div className="start">{this.state.start.bengali}</div>
                                {this.state.khutbah.bengali}
                            </div>
                        </div>
                    </div>
                }
                <button onClick={this.done}>
                    <i className="fas fa-check"></i> OK
                </button>
            </div>
        );
    }
}

export default Khutbah;
