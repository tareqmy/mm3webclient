'use strict';

// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// end::vars[]

// tag::app[]
class MunjateMaqbool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            first: true,
            last: false,
        };
    }

    next() {
        var next = this.state.value + 1;
        this.setState({
            value: next,
            first: next === 0,
            last: next === 10,
        });
    }

    previous() {
        var previous = this.state.value - 1;
        this.setState({
            value: previous,
            first: previous === 0,
            last: previous === 10,
        });
    }

    render() {
        return (
            <div className="mem">
                <div className="title">
                    <h1>Munajat E Maqbool!</h1>
                </div>

                <table className="content">
                    <tr>
                        <td>
                            <button className="navigate" disabled={this.state.first}
                                onClick={() => this.previous()}>
                                previous
                            </button>
                        </td>
                        <td>
                            <div className="prayer">
                                {this.state.value}
                            </div>
                        </td>
                        <td>
                            <button className="navigate" disabled={this.state.last}
                                onClick={() => this.next()}>
                                next
                            </button>
                        </td>
                    </tr>
                </table>

            </div>
        );
    }
}
// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool />, document.getElementById('react'));
// end::render[]