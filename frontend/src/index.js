// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RestClient from 'react-native-rest-client';
// end::vars[]

// tag::app[]
class MunjateMaqbool extends React.Component {

    constructor(props) {
        super(props);
        var first = 1;
        var last = 196;
        var value = localStorage.getItem('value');
        if (value === null) {
            value = first;
        }
        value = Number(value);
        this.state = {
            value: value,
            prayer: "",
            isfirst: Boolean(value <= first),
            islast: Boolean(value >= last),
            first: first,
            last: last,
        };
        this.fetch(value);
    }

    update(value, dua) {
        localStorage.setItem('value', value);
        this.setState({
            value: value,
            prayer: dua,
            isfirst: Boolean(value <= this.state.first),
            islast: Boolean(value >= this.state.last),
        });
    }

    fetch(value) {
        var self = this;
        const api = new RestClient("http://localhost/api");
        api.GET("/dua/" + value)
            .then(function (response) {
                var dua = response.arabic;
                self.update(value, dua);
            });
    }

    next() {
        this.fetch(this.state.value + 1);
    }

    previous() {
        this.fetch(this.state.value - 1);
    }

    render() {
        return (
            <div className="mem">
                <div className="title">
                    <h1>Munajat E Maqbool!</h1>
                </div>

                <table className="content">
                    <tbody>
                        <tr>
                            <td>
                                <button className="navigate" disabled={this.state.isfirst}
                                    onClick={() => this.previous()}>
                                    <i className="fas fa-angle-left fa-2x"></i>
                                </button>
                            </td>
                            <td>
                                <div className="prayer">
                                    {this.state.prayer}
                                </div>
                            </td>
                            <td>
                                <button className="navigate" disabled={this.state.islast}
                                    onClick={() => this.next()}>
                                    <i className="fas fa-angle-right fa-2x"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        );
    }
}
// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool />, document.getElementById('react'));
// end::render[]