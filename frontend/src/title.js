import React from 'react';
import './title.css';
import swal from 'sweetalert';
import { get } from "superagent";

class Title extends React.Component {

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
        };
        this.fetchTitle();
    }

    fetchTitle() {
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
                            this.english() &&
                            <td className="titleenglish">
                                {this.state.title.english}
                            </td>
                        }
                        {
                            this.bengali() &&
                            <td className="titlebengali">
                                {this.state.title.bengali}
                            </td>
                        }
                        {
                            !this.props.isMobile &&
                            <td className="titlearabic">
                                {this.state.title.arabic}
                            </td>
                        }
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default Title;
