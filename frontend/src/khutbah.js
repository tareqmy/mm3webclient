import React from 'react';
import './khutbah.css';
import {get} from "superagent";
import {API_BASE} from "./config";
import TranslatedText from './TranslatedText';

class Khutbah extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: {
                type: "khutbah",
                arabic: "",
                english: "",
                bengali: "",
                id: 4,
            },
            start: {
                type: "khutbah",
                arabic: "",
                english: "",
                bengali: "",
                id: 5,
            },
            khutbah: {
                type: "khutbah",
                arabic: "",
                english: "",
                bengali: "",
                id: 6,
            },
        };
        this.fetchKhutbahTitle();
        this.fetchKhutbahStart();
        this.fetchKhutbah();
    }

    fetchKhutbahTitle() {
        var self = this;
        var serverLocation = API_BASE + "/misc/4";

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                var title = json_result;
                self.setState({
                    title: title,
                });
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
    }

    fetchKhutbahStart() {
        var self = this;
        var serverLocation = API_BASE + "/misc/5";

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

    fetchKhutbah() {
        var self = this;
        var serverLocation = API_BASE + "/misc/6";

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                var khutbah = json_result;
                self.setState({
                    khutbah: khutbah,
                });
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
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
