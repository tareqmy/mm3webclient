import React from 'react';
import './settings.css';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.langSelected = this.langSelected.bind(this);
    }

    langSelected(event) {
        this.props.onLangChange(event.target.value);
    }

    render() {
        return (
            <div className="settings">
                <div className="english">
                    <div className="header">Settings</div>
                    <div className="para">
                        <label>Translation: </label>
                        <select onChange={this.langSelected} value={this.props.lang}>
                            <option value="english">English</option>
                            <option value="bengali">বাংলা</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => this.props.showComponent("content")}>OK</button>
            </div>
        );
    }
}

export default Settings;