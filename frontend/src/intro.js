import React from 'react';
import './intro.css';
import swal from 'sweetalert';
import { get } from "superagent";

class Intro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: {
                type: "intro",
                arabic: "",
                english: "",
                bengali: "",
                id: 2,
            },
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
        this.fetchIntroTitle();
        this.fetchIntroStart();
    }
    fetchIntroTitle() {
        var self = this;
        var serverLocation = "https://api.munajatemaqbool.com/misc/1";

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

    fetchIntroStart() {
        var self = this;
        var serverLocation = "https://api.munajatemaqbool.com/misc/2";

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
        var serverLocation = "https://api.munajatemaqbool.com/misc/3";

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
                <div className="arabic">
                    <div className="header">{this.state.title.arabic}</div>
                    <div className="start">{this.state.start.arabic}</div>
                    {this.state.intro.arabic}
                </div>
                <hr></hr>
                {
                    this.props.lang === "english" &&
                    <div className="english">
                        <div className="header">{this.state.title.english}</div>
                        <div className="start">{this.state.start.english}</div>
                        {this.state.intro.english}
                    </div>
                }
                {
                    this.props.lang === "bengali" &&
                    <div className="bengali">
                        <div className="header">{this.state.title.bengali}</div>
                        <div className="start">{this.state.start.bengali}</div>
                        {this.state.intro.bengali}
                    </div>
                }
                <br />
                <button onClick={this.done}>OK</button>
            </div>
        );
    }
}

export default Intro;
