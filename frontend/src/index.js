// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// end::vars[]

// tag::app[]
class MunjateMaqbool extends React.Component {

    constructor(props) {
        super(props);

        var value = localStorage.getItem('value');
        if (value === null) {
            value = 1;
        } 
        this.state = {
            value: Number(value),
            first: Boolean(value <= 1),
            last: Boolean(value >= 10),
        };
    }

    update(value) {
        localStorage.setItem('value', value);
        this.setState({
            value: value,
            first: Boolean(value <= 1),
            last: Boolean(value >= 10),
        });
    }

    next() {
        this.update(this.state.value + 1);
    }

    previous() {
        this.update(this.state.value - 1);
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
                                <button className="navigate" disabled={this.state.first}
                                    onClick={() => this.previous()}>
                                    <i className="fas fa-angle-left fa-2x"></i>
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