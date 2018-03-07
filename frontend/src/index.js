'use strict';

// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// end::vars[]

function Navigate(props) {
    return (
        <button className="navigate">
            {props.value}
        </button>
    );
}

function Prayer(props) {
    return (
        <div className="prayer">
            {props.value}
        </div>
    );
}

// tag::app[]
function MunjateMaqbool(props) {
    return (
        <div className="mem">
            <div className="title">
                <h1>Munajat E Maqbool!</h1>
            </div>

            <table className="content">
                <tr>
                    <td><Navigate value="<<" class="previous"></Navigate></td>
                    <td>
                        <Prayer value="O our Sustainer! Open the gates of patience upon us and cause us to die as Muslims."></Prayer>
                    </td>
                    <td><Navigate value=">>"></Navigate></td>
                </tr>
            </table>

        </div>
    );
}
// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool />, document.getElementById('react'));
// end::render[]