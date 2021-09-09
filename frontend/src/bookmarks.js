import React from 'react';
import './bookmarks.css';

//instead of class Bookmark extends React.Component we are using "functional component"
//because we only need the render method and constructor and state management is not necessary
function Bookmark(props) {
    return (
        <div className="bookmark">
            <div className="left" onClick={props.onGoto}>
                <p>{props.value.id}. {props.value.english}</p>
            </div>
            <div className="right">
                <button onClick={props.unBookmark}>
                    <i className="fas fa-star"></i>
                </button>
            </div>
        </div>
    );
}

class Bookmarks extends React.Component {

    goAndFetch = (page) => {
        this.props.showComponent("content");
        this.props.onFetch(page);
    }

    getBookmarks() {
        var keys = Object.keys(this.props.bookmarks);
        if (keys.length === 0) {
            return <label>You have no bookmarks yet!</label>;
        }

        const options = Object.entries(this.props.bookmarks).map(([key, value]) => {
            return <Bookmark key={key} value={value} lang={this.props.lang}
                onGoto={() => this.goAndFetch(key)} unBookmark={() => this.props.unBookmark(key)}/>
        })
        return options;
    }

    render() {
        return (
            <div className="bookmarks">
                <div className="english">
                    <div className="header">Bookmarks</div>
                    <div className="para">
                        {
                            this.getBookmarks()
                        }
                    </div>
                </div>
                <button onClick={() => this.props.showComponent("content")}>OK</button>
            </div>
        );
    }
}

export default Bookmarks;