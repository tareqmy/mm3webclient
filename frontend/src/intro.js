import React from 'react';
import './intro.css';
import {get} from "superagent";
import {API_BASE} from "./config";
import TranslatedText from './TranslatedText';

class Intro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            start: {
                type: "intro",
                arabic: "",
                english: "",
                bengali: "",
                id: 1,
            },
            intro: {
                type: "intro",
                arabic: "",
                english: "",
                bengali: "",
                id: 3,
            },
        };
        this.fetchIntro();
        this.fetchIntroStart();
    }



    fetchIntroStart() {
        var self = this;
        var serverLocation = API_BASE + "/misc/2";

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                var start = json_result;
                self.setState({
                    start: start,
                });
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
    }


    fetchIntro() {
        var self = this;
        var serverLocation = API_BASE + "/misc/3";

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                var intro = json_result;
                self.setState({
                    intro: intro,
                });
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
    }

    done = () => {
        var init = localStorage.getItem('init');
        if (init === null) {
            init = "khutbah";
        }
        localStorage.setItem('init', init);
        this.props.showComponent(init);
    }

    render() {
        return (
            <div className="intro">
                <div className="intro-panel arabic-panel">
                    <div className="panel-body">
                        <div className="arabic">
                            <div className="header">{this.props.title.arabic}</div>
                            <div className="start">{this.state.start.arabic}</div>
                            {this.state.intro.arabic}
                        </div>
                    </div>
                </div>
                {
                    this.props.lang !== "bengali" &&
                    <div className="intro-panel translation-panel">
                        <div className="panel-body">
                            <div className="english">
                                <div className="header">
                                    <TranslatedText text={this.props.title.english} toLang={this.props.lang} />
                                </div>
                                <div className="start">
                                    <TranslatedText text={this.state.start.english} toLang={this.props.lang} />
                                </div>
                                <TranslatedText text={this.state.intro.english} toLang={this.props.lang} />
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
                    <div className="intro-panel translation-panel">
                        <div className="panel-body">
                            <div className="bengali">
                                <div className="header">{this.props.title.bengali}</div>
                                <div className="start">{this.state.start.bengali}</div>
                                {this.state.intro.bengali}
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

export default Intro;
