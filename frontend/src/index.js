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
        var page = localStorage.getItem('page');
        if (page === null) {
            page = first;
        }
        page = Number(page);
        this.state = {
            page: page,
            size: 1,
            prayer: {
                tags: "",
                arabic: "",
                english: "",
                bengali: "",
                number: 1,
            },
            isfirst: Boolean(page <= first),
            islast: Boolean(page >= last),
            first: first,
            last: last,
        };
        this.fetch(page);
    }

    update(page, prayer) {
        localStorage.setItem('page', page);
        this.setState({
            page: page,
            prayer: prayer,
            isfirst: Boolean(page <= this.state.first),
            islast: Boolean(page >= this.state.last),
        });
    }

    fetch(page) {
        var self = this;
        var serverLocation = window.location.protocol + "//" + window.location.hostname + "/api"
        const api = new RestClient(serverLocation);
        api.GET("/dua?page=" + page + "&size=" + this.state.size)
            .then(function (response) {
                var prayer = response.items[0];
                self.update(page, prayer);
            });
    }

    next() {
        this.fetch(this.state.page + 1);
    }

    previous() {
        this.fetch(this.state.page - 1);
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
                            <td className="navigate">
                                <button className="navigatebutton" disabled={this.state.isfirst}
                                    onClick={() => this.previous()}>
                                    <i className="fas fa-angle-left fa-2x"></i>
                                </button>
                            </td>
                            <td>
                                <div className="prayer">
                                    <div className="tags">
                                        {this.state.prayer.tags}
                                    </div>
                                    <div className="arabic">
                                        {this.state.prayer.arabic}
                                    </div>
                                    <div className="english">
                                        {this.state.prayer.english}
                                    </div>
                                    <div className="bengali">
                                        {this.state.prayer.bengali}
                                    </div>
                                    <div className="number">
                                        {this.state.prayer.number}
                                    </div>
                                </div>
                            </td>
                            <td className="navigate">
                                <button className="navigatebutton" disabled={this.state.islast}
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