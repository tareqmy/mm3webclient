import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Body(props) {
    return (
        <h1>Hello World!</h1>
    );
}

ReactDOM.render(<Body />, document.getElementById("root"));
