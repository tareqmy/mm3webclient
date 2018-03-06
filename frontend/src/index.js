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

// tag::content[]
class Content extends React.Component {
    
    render() {
        return (
            <div className="content">
                <Navigate value="previous"></Navigate>
                <Prayer value="O our Sustainer! Give us the good of this world and the good of the hereafter, and save us from the punishment of the fire."></Prayer>
                <Navigate value="next"></Navigate>
            </div>
        );
    }
}
// end::content[]

// tag::app[]
function MunjateMaqbool(props) {
    return (
        <div className="mem">
            <div className="title">
                <h1>Munajat E Maqbool!</h1>
            </div>
            <div>
                <Content></Content>
            </div>
        </div>
    );
}
// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool />, document.getElementById('react'));
// end::render[]