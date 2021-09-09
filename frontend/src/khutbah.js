import React from 'react';
import './khutbah.css';
import swal from 'sweetalert';
import { get } from "superagent";

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
        var serverLocation = "https://api.munajatemaqbool.com/misc/4";

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
        var serverLocation = "https://api.munajatemaqbool.com/misc/5";

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
        var serverLocation = "https://api.munajatemaqbool.com/misc/6";

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
                <div className="arabic">
                    <div className="header">{this.state.title.arabic}</div>
                    <div className="start">{this.state.start.arabic}</div>
                    {this.state.khutbah.arabic}
                </div>
                <hr></hr>
                {
                    this.props.lang === "english" &&
                    <div className="english">
                        <div className="header">{this.state.title.english}</div>
                        <div className="start">{this.state.start.english}</div>
                        {this.state.khutbah.english}
                    </div>
                }
                {
                    this.props.lang === "bengali" &&
                    <div className="bengali">
                        <div className="header">{this.state.title.bengali}</div>
                        <div className="start">{this.state.start.bengali}</div>
                        {this.state.khutbah.bengali}
                    </div>
                }
                <br />
                <button onClick={this.done}>OK</button>
            </div>
        );
    }
}

export default Khutbah;
