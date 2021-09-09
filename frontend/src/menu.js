import React from 'react';
import ReactTooltip from 'react-tooltip';
import './menu.css';

class Menu extends React.Component {

    render() {
        return (
            <div className="menu">
                <ReactTooltip />
                <div className="left">
                    {/* home */}
                    <button data-tip="Home" onClick={() => this.props.showComponent("content")}
                        className={this.props.component === "content" ? 'active' : 'inactive'}>
                        <i className="fas fa-home"></i>
                    </button>
                    <label> | </label>
                    {/* intro */}
                    <button data-tip="Introduction" onClick={() => this.props.showComponent("intro")}
                        className={this.props.component === "intro" ? 'active' : 'inactive'}>
                        <i className="fas fa-info"></i>
                    </button>
                    <label> | </label>
                    {/* khutbah */}
                    <button data-tip="Khutbah" onClick={() => this.props.showComponent("khutbah")}
                        className={this.props.component === "khutbah" ? 'active' : 'inactive'}>
                        <i className="fas fa-comment"></i>
                    </button>
                    <label> | </label>
                    {/* bookmark */}
                    <button data-tip="Bookmarks" onClick={() => this.props.showComponent("bookmarks")}
                        className={this.props.component === "bookmarks" ? 'active' : 'inactive'}>
                        <i className="fas fa-star"></i>
                    </button>
                    <label> | </label>
                    {/* settings */}
                    <button data-tip="Settings" onClick={() => this.props.showComponent("settings")}
                        className={this.props.component === "settings" ? 'active' : 'inactive'}>
                        <i className="fas fa-cog"></i>
                    </button>
                    <label> | </label>
                    {/* help */}
                    <button data-tip="About" onClick={() => this.props.showComponent("help")}
                        className={this.props.component === "help" ? 'active' : 'inactive'}>
                        <i className="fas fa-question"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Menu;