import React from 'react';
import './help.css';

class Help extends React.Component {

    render() {
        return (
            <div className="help">
                <div className="help-header">
                    <h2>About & Help</h2>
                    <p className="subtitle">Munajat-e-Maqbool (مناجاة مقبول)</p>
                </div>

                <div className="help-content-grid">
                    {/* Left Column: Book & App Information */}
                    <div className="help-column info-column">
                        <div className="help-card book-card">
                            <h3><i className="fas fa-book-open"></i> The Compilation</h3>
                            <div className="card-body">
                                <p><strong>Compiler:</strong> Hakimul Ummah Maulana Ashraf Ali Thanvi (R)</p>
                                <p><strong>Bengali Translation:</strong> Allama Shamsul Haque Faridpuri (R) & Allama Azizul Haque (R)</p>
                                <p><strong>English Translation:</strong> Maulana Muhammed Mahomedy</p>
                            </div>
                        </div>

                        <div className="help-card app-card">
                            <h3><i className="fas fa-info-circle"></i> About this application</h3>
                            <div className="card-body">
                                <p>
                                    Munajat-e-Maqbool is a compilation of daily Islamic prayers (duas) from the Quran and Hadith.
                                    This digital client was developed to make these prayers accessible, organized, and easy to recite daily.
                                </p>
                                <p className="dev-note">
                                    <em>
                                        "I wanted to create an application on this book for a long time. Having benefited from it
                                        tremendously, I spent months trying to make it useful and organized. If even one person benefits, 
                                        I will consider this effort worthwhile. May Allah accept this small effort from me."
                                    </em>
                                </p>
                                <div className="prayers-box">
                                    <p className="arabic-prayer">رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ</p>
                                    <p className="prayer-translation">"O my Sustainer! I am in need of the good that You bestow upon me."</p>
                                    
                                    <p className="arabic-prayer">رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ</p>
                                    <p className="prayer-translation">"Our Lord! Accept (this service) from us. Indeed! You are the All-Hearer, the All-Knower."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Shortcuts & Controls */}
                    <div className="help-column shortcuts-column">
                        <div className="help-card shortcuts-card">
                            <h3><i className="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                            <div className="card-body">
                                <div className="shortcut-section-title">Navigation</div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Next Prayer</span>
                                    <span className="shortcut-keys"><kbd>k</kbd> / <kbd>→</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Previous Prayer</span>
                                    <span className="shortcut-keys"><kbd>j</kbd> / <kbd>←</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Next Day</span>
                                    <span className="shortcut-keys"><kbd>l</kbd> / <kbd>↑</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Previous Day</span>
                                    <span className="shortcut-keys"><kbd>h</kbd> / <kbd>↓</kbd></span>
                                </div>

                                <div className="shortcut-section-title">Audio Player</div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Play / Pause Audio</span>
                                    <span className="shortcut-keys"><kbd>p</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Stop Audio</span>
                                    <span className="shortcut-keys"><kbd>s</kbd></span>
                                </div>

                                <div className="shortcut-section-title">Bookmarks</div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Toggle Bookmark</span>
                                    <span className="shortcut-keys"><kbd>b</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Go to Bookmarks page</span>
                                    <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>b</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Next Bookmarked Prayer</span>
                                    <span className="shortcut-keys"><kbd>n</kbd></span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Previous Bookmarked Prayer</span>
                                    <span className="shortcut-keys"><kbd>v</kbd></span>
                                </div>

                                <div className="shortcut-section-title">Settings</div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Toggle English / Bengali</span>
                                    <span className="shortcut-keys"><kbd>t</kbd></span>
                                </div>
                            </div>
                        </div>

                        <div className="help-card gestures-card">
                            <h3><i className="fas fa-mobile-alt"></i> Touch & Tap Navigation</h3>
                            <div className="card-body">
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Next Prayer</span>
                                    <span className="shortcut-keys">
                                        Swipe Left / Tap Right Half
                                    </span>
                                </div>
                                <div className="shortcut-item">
                                    <span className="shortcut-desc">Previous Prayer</span>
                                    <span className="shortcut-keys">
                                        Swipe Right / Tap Left Half
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="help-footer">
                    <div className="author-info">
                        Created with love by <a href="https://tareqmy.com/" target="_blank" rel="noopener noreferrer">tareqmy.com</a>
                    </div>
                    <div className="contact-info">
                        For suggestions or support: <a href="mailto:tareq.y+mm3@gmail.com?Subject=Munajat%20E%20Maqbool%20Feedback"><i className="fas fa-envelope"></i> tareq.y+mm3@gmail.com</a>
                    </div>
                    <button className="back-btn" onClick={() => this.props.showComponent("content")}>
                        <i className="fas fa-check"></i> OK
                    </button>
                </div>
            </div>
        );
    }
}

export default Help;
