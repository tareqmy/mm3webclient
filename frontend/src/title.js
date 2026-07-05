import React from 'react';
import './title.css';
import TranslatedText from './TranslatedText';

class Title extends React.Component {

    english() {
        return this.props.lang === "english";
    }

    bengali() {
        return this.props.lang === "bengali";
    }

    render() {
        return (
            <table className="title">
                <tbody>
                <tr>
                    {
                        this.props.lang !== "bengali" &&
                        <td className="titleenglish">
                            <TranslatedText text={this.props.title.english} toLang={this.props.lang} />
                        </td>
                    }
                    {
                        this.bengali() &&
                        <td className="titlebengali">
                            {this.props.title.bengali}
                        </td>
                    }
                    {
                        !this.props.isMobile &&
                        <td className="titlearabic">
                            {this.props.title.arabic}
                        </td>
                    }
                </tr>
                </tbody>
            </table>
        );
    }
}

export default Title;
