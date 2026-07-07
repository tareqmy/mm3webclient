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
                            <h1><TranslatedText text={this.props.title.english} toLang={this.props.lang} /></h1>
                        </td>
                    }
                    {
                        this.bengali() &&
                        <td className="titlebengali">
                            <h1>{this.props.title.bengali}</h1>
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
