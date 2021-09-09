import React from 'react';
import ReactTooltip from 'react-tooltip';
import './content.css';

function Bookit(props) {
    return (
        <div data-tip="Book it" className="bookit">
            {
                !props.booked &&
                <button onClick={props.toggleBookmark}>
                    <i className="far fa-star"></i>
                </button>
            }
            {
                props.booked &&
                <button onClick={props.toggleBookmark}>
                    <i className="fas fa-star"></i>
                </button>
            }
        </div>
    );
}

class Content extends React.Component {

    constructor(props) {
        super(props);
        this.daySelected = this.daySelected.bind(this);
        this.prayerSelected = this.prayerSelected.bind(this);
    }

    getDaysOptions() {
        const options = Object.keys(this.props.days).map(key => {
            const day = this.props.days[key];
            return <option value={key} key={key}>{day.value}</option>;
        });
        return options;
    }

    getPrayerNumberOptions() {
        const day = this.props.days[this.props.prayer.tags];

        var map = [];
        for (var i = 0; i < day.size; i++) {
            map[day.begin + i] = i + 1;
        }

        const options = Object.keys(map).map(key => {
            var value = map[key];
            return <option value={key} key={key}>{value}</option>;
        });
        return options;
    }

    daySelected(event) {
        this.props.onDayChange(event.target.value);
    }

    prayerSelected(event) {
        this.props.onFetch(event.target.value);
    }

    render() {
        return (
            <div>
                <ReactTooltip />
                <div className="navigation">
                    <div className="right">
                        <button data-tip="Previous" onClick={this.props.previous}><i className="fas fa-arrow-left"></i></button>
                        <label> | </label>
                        <button data-tip="Next" onClick={this.props.next}><i className="fas fa-arrow-right"></i></button>
                        <label> | </label>
                        <select data-tip="Day" onChange={this.daySelected} value={this.props.prayer.tags}>
                            {this.getDaysOptions()}
                        </select>
                        <label> | </label>
                        <select data-tip="Number" onChange={this.prayerSelected} value={this.props.prayer.id}>
                            {this.getPrayerNumberOptions()}
                        </select>
                        <label> | </label>
                        <button data-tip="Previous Bookmark" onClick={this.props.previousBookmark}><i className="fas fa-angle-double-left"></i></button>
                        <label> | </label>
                        <Bookit booked={this.props.bookmarks[this.props.prayer.id]} toggleBookmark={this.props.toggleBookmark} />
                        <label> | </label>
                        <button data-tip="Next Bookmark" onClick={this.props.nextBookmark}><i className="fas fa-angle-double-right"></i></button>
                    </div>
                </div>
                <div className="content">
                    <div className="prayerholder">
                        <div className="arabic">
                            {this.props.prayer.arabic}
                        </div>
                        <hr></hr>
                        {
                            this.props.lang === "english" &&
                            <div className="english">
                                {this.props.prayer.english}
                            </div>
                        }
                        {
                            this.props.lang === "bengali" &&
                            <div className="bengali">
                                {this.props.prayer.bengali}
                            </div>
                        }
                    </div>
                </div>
                <div className="meta">
                    <label> ( {this.props.prayer.id} ) </label>
                </div>
            </div>
        );
    }
}

export default Content;