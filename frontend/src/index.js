'use strict';

// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// end::vars[]

// tag::app[]
function App(props) {
    return (
        <div className="body">
            <div className="header">
                <h1>Munajat E Maqbool!</h1>
            </div>
            <TodoList name="moi!"></TodoList>
        </div>
    );
}
// end::app[]

class TodoList extends React.Component {
    render() {
        return (
            <div className="todo-list">
                <h3>todo liste pour {this.props.name}</h3>
                <ul>
                    <li>memapp</li>
                    <li>memappclient</li>
                    <li>telefonix</li>
                    <li>noticeboard</li>
                </ul>
            </div>
        );
    }
}

// tag::render[]
ReactDOM.render(<App />, document.getElementById('react'));
// end::render[]