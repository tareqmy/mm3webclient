import React from 'react';
import './bookmarks.css';

// functional component to represent an individual bookmark item card
function Bookmark(props) {
    const getPreviewText = () => {
        if (props.lang === "bengali" && props.value.bengali) {
            // Strip HTML tags for clean preview
            return props.value.bengali.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        }
        return props.value.english ? props.value.english.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : "";
    };

    return (
        <div className="bookmark-item-card">
            <div className="left" onClick={props.onGoto}>
                <div className="bookmark-id-badge">#{props.value.id}</div>
                <div className="bookmark-details">
                    <span className="bookmark-day-tag">{props.value.tags}</span>
                    <p className="bookmark-preview">{getPreviewText()}</p>
                </div>
            </div>
            <div className="right">
                <button className="unbookmark-btn" onClick={props.unBookmark} title="Remove Bookmark">
                    <i className="fas fa-trash-alt"></i>
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
            return (
                <div className="empty-bookmarks-box">
                    <i className="far fa-star empty-icon"></i>
                    <p className="empty-title">No Bookmarks Saved</p>
                    <p className="empty-desc">Tap the star icon on any prayer while reading to save it here for quick access.</p>
                </div>
            );
        }

        const options = Object.entries(this.props.bookmarks).map(([key, value]) => {
            return <Bookmark key={key} value={value} lang={this.props.lang}
                             onGoto={() => this.goAndFetch(key)} unBookmark={() => this.props.unBookmark(key)}/>
        })
        return <div className="bookmarks-list-container">{options}</div>;
    }

    render() {
        return (
            <div className="bookmarks">
                <div className="bookmarks-header">
                    <h2>Bookmarks</h2>
                    <p className="subtitle">Your saved prayers and daily supplications</p>
                </div>

                <div className="bookmarks-content">
                    {this.getBookmarks()}
                </div>

                <div className="bookmarks-footer">
                    <button className="back-btn" onClick={() => this.props.showComponent("content")}>
                        <i className="fas fa-check"></i> OK
                    </button>
                </div>
            </div>
        );
    }
}

export default Bookmarks;
