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
            value: 1,
            first: true,
            last: false,
            pagesize: 10,
        };
    }

    next() {
        var next = this.state.value + 1;
        this.setState({
            value: next,
            first: next === 1,
            last: next === this.state.pagesize,
        });
    }

    previous() {
        var previous = this.state.value - 1;
        this.setState({
            value: previous,
            first: previous === 1,
            last: previous === this.state.pagesize,
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
                                <i class="fas fa-angle-left fa-2x"></i>
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
                                <i class="fas fa-angle-right fa-2x"></i>
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