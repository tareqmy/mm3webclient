import React from 'react';
import ReactTooltip from 'react-tooltip';
import './content.css';
import TranslatedText from './TranslatedText';

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
        
        // Touch tracking variables for swipe gestures
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchEndX = null;
        this.touchEndY = null;
    }

    handleTouchStart = (e) => {
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
    };

    handleTouchMove = (e) => {
        const touch = e.touches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
    };

    handleTouchEnd = () => {
        if (this.touchStartX === null || this.touchStartY === null) {
            return;
        }

        const diffX = this.touchEndX - this.touchStartX;
        const diffY = this.touchEndY - this.touchStartY;

        // Threshold parameters
        const minSwipeDistance = 50; // px
        const maxVerticalDeviation = 100; // px, don't trigger if swiped too vertically

        if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffY) < maxVerticalDeviation) {
            if (diffX > 0) {
                // Swiped right (left-to-right) -> previous dua
                this.props.previous();
            } else {
                // Swiped left (right-to-left) -> next dua
                this.props.next();
            }
        }

        this.touchStartX = null;
        this.touchStartY = null;
        this.touchEndX = null;
        this.touchEndY = null;
    };

    handleTouchCancel = () => {
        this.touchStartX = null;
        this.touchStartY = null;
        this.touchEndX = null;
        this.touchEndY = null;
    };

    handleContentClick = (e) => {
        if (!this.props.isMobile) {
            return;
        }

        // Ignore clicks on interactive elements or audio player
        if (e.target.closest('button, select, a, input, textarea') || e.target.closest('.audio-player')) {
            return;
        }

        // Calculate click position relative to the content element
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;

        if (x > rect.width / 2) {
            this.props.next();
        } else {
            this.props.previous();
        }
    };


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
        const speakingState = this.props.speakingState || 'stopped';
        const audioRate = this.props.audioRate || 1.0;
        const audioTarget = this.props.audioTarget || 'translation';
        const playSpeech = this.props.playSpeech || (() => {});
        const pauseSpeech = this.props.pauseSpeech || (() => {});
        const stopSpeech = this.props.stopSpeech || (() => {});
        const changeAudioRate = this.props.changeAudioRate || (() => {});
        const changeAudioTarget = this.props.changeAudioTarget || (() => {});
        
        const isSpeechSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

        return (
            <div>
                <ReactTooltip/>
                <div className="navigation">
                    <div className="right">
                        <button data-tip="Previous" onClick={this.props.previous}><i className="fas fa-arrow-left"></i>
                        </button>
                        <label> | </label>
                        <button data-tip="Next" onClick={this.props.next}><i className="fas fa-arrow-right"></i>
                        </button>
                        <label> | </label>
                        <select data-tip="Day" onChange={this.daySelected} value={this.props.prayer.tags}>
                            {this.getDaysOptions()}
                        </select>
                        <label> | </label>
                        <select data-tip="Number" onChange={this.prayerSelected} value={this.props.prayer.id}>
                            {this.getPrayerNumberOptions()}
                        </select>
                        <label> | </label>
                        <button data-tip="Previous Bookmark" onClick={this.props.previousBookmark}><i
                            className="fas fa-angle-double-left"></i></button>
                        <label> | </label>
                        <Bookit booked={this.props.bookmarks[this.props.prayer.id]}
                                toggleBookmark={this.props.toggleBookmark}/>
                        <label> | </label>
                        <button data-tip="Next Bookmark" onClick={this.props.nextBookmark}><i
                            className="fas fa-angle-double-right"></i></button>
                    </div>
                </div>
                <div 
                    className="content"
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                    onTouchCancel={this.handleTouchCancel}
                    onClick={this.handleContentClick}
                >
                    <div className="prayerholder">
                        {isSpeechSupported && (
                            <div className="audio-player">
                                <div className="audio-controls">
                                    <button 
                                        className="audio-btn" 
                                        onClick={speakingState === 'playing' ? pauseSpeech : playSpeech}
                                        data-tip={speakingState === 'playing' ? "Pause" : "Play Audio"}
                                    >
                                        {speakingState === 'playing' ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                                    </button>
                                    <button 
                                        className="audio-btn" 
                                        onClick={stopSpeech}
                                        disabled={speakingState === 'stopped'}
                                        data-tip="Stop Audio"
                                        style={{ opacity: speakingState === 'stopped' ? 0.5 : 1 }}
                                    >
                                        <i className="fas fa-stop"></i>
                                    </button>
                                    
                                    {this.props.lang !== 'bengali' && (
                                        <div className="audio-source-toggle" data-tip="Select audio content">
                                            <button 
                                                className={`audio-source-btn ${audioTarget === 'arabic' ? 'active' : ''}`}
                                                onClick={() => changeAudioTarget('arabic')}
                                            >
                                                Arabic
                                            </button>
                                            <button 
                                                className={`audio-source-btn ${audioTarget === 'translation' ? 'active' : ''}`}
                                                onClick={() => changeAudioTarget('translation')}
                                            >
                                                Translation
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="audio-meta">
                                    <div className={`sound-wave ${speakingState}`} data-tip={speakingState === 'playing' ? "Playing audio..." : speakingState === 'paused' ? "Paused" : "Stopped"}>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                    
                                    <select 
                                        className="audio-speed-select" 
                                        value={audioRate} 
                                        onChange={(e) => changeAudioRate(parseFloat(e.target.value))}
                                        data-tip="Playback Speed"
                                    >
                                        <option value="0.75">0.75x</option>
                                        <option value="1">1.0x</option>
                                        <option value="1.25">1.25x</option>
                                        <option value="1.5">1.5x</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="arabic-card">
                            <div className="arabic">
                                {this.props.prayer.arabic}
                            </div>
                        </div>
                        {
                            this.props.lang !== "bengali" &&
                            <div className="translation-card">
                                <div className="english">
                                    <TranslatedText text={this.props.prayer.english} toLang={this.props.lang} />
                                    {this.props.lang !== "english" && (
                                        <div className="translation-notice">
                                            This translation was automatically generated from English using Google Translate.
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        {
                            this.props.lang === "bengali" &&
                            <div className="translation-card">
                                <div className="bengali">
                                    {this.props.prayer.bengali}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="meta">
                    <label> ( {this.props.prayer.id} ) </label>
                </div>
                {
                    this.props.isMobile &&
                    <div className="mobile-nav-overlays">
                        <div className="mobile-nav-row standard-row">
                            <button className="mobile-nav-btn prev" onClick={this.props.previous} data-tip="Previous">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="mobile-nav-btn next" onClick={this.props.next} data-tip="Next">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div className="mobile-nav-row bookmark-row">
                            <button className="mobile-nav-btn bookmark-btn prev" onClick={this.props.previousBookmark} data-tip="Previous Bookmark">
                                <i className="fas fa-angle-double-left"></i>
                            </button>
                            <button className="mobile-nav-btn bookmark-btn next" onClick={this.props.nextBookmark} data-tip="Next Bookmark">
                                <i className="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Content;
