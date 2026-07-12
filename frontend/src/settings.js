import React from 'react';
import './settings.css';

const SUPPORTED_LANGUAGES = [
    { code: 'ur', name: 'Urdu (اردو)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'tr', name: 'Turkish (Türkçe)' },
    { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'fa', name: 'Persian (فارسی)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'nl', name: 'Dutch (Nederlands)' },
    { code: 'so', name: 'Somali (Soomaali)' }
];

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.langSelected = this.langSelected.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        
        const available = this.getAvailableLanguages();
        this.state = {
            selectedNewLanguage: available[0] ? available[0].code : ''
        };
    }

    getAvailableLanguages() {
        const customLanguages = this.props.customLanguages || [];
        return SUPPORTED_LANGUAGES.filter(lang => 
            !customLanguages.some(cl => cl.code === lang.code)
        );
    }

    langSelected(event) {
        this.props.onLangChange(event.target.value);
    }

    arabicFontChanged = (event) => {
        this.props.onArabicFontChange(event.target.value);
    }

    arabicSizeChanged = (event) => {
        this.props.onArabicSizeChange(event.target.value);
    }

    handleAdd() {
        const available = this.getAvailableLanguages();
        if (available.length === 0) return;

        const code = this.state.selectedNewLanguage || available[0].code;
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === code);
        if (langObj) {
            this.props.onAddLanguage(langObj.code, langObj.name);
            // Automatically switch to the newly added language
            this.props.onLangChange(langObj.code);
            
            // Update state with next available language
            const remaining = available.filter(l => l.code !== code);
            this.setState({
                selectedNewLanguage: remaining.length > 0 ? remaining[0].code : ''
            });
        }
    }

    render() {
        const available = this.getAvailableLanguages();
        const activeNewLangCode = available.some(l => l.code === this.state.selectedNewLanguage)
            ? this.state.selectedNewLanguage
            : (available[0] ? available[0].code : '');

        return (
            <div className="settings">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <p className="subtitle">Customize translation and language preferences</p>
                </div>

                <div className="settings-content">
                    {/* Section 1: Active Language Select */}
                    <div className="settings-card">
                        <h3><i className="fas fa-language"></i> Display Language</h3>
                        <div className="card-body">
                            <p className="card-desc">Choose the main translation language for reading the supplications:</p>
                            <div className="select-wrapper">
                                <select onChange={this.langSelected} value={this.props.lang}>
                                    <option value="english">English</option>
                                    <option value="bengali">বাংলা (Bengali)</option>
                                    {(this.props.customLanguages || []).map(l => (
                                        <option value={l.code} key={l.code}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 1b: Arabic Font Select */}
                    <div className="settings-card">
                        <h3><i className="fas fa-font"></i> Arabic Font</h3>
                        <div className="card-body">
                            <p className="card-desc">Choose the font style for reading Arabic text:</p>
                            <div className="select-wrapper">
                                <select 
                                    onChange={this.arabicFontChanged} 
                                    value={this.props.arabicFont}
                                >
                                    <option value="noto-naskh">Noto Naskh Arabic</option>
                                    <option value="noto">Noto Sans Arabic (Default)</option>
                                    <option value="scheherazade">Scheherazade</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 1c: Arabic Font Size Select */}
                    <div className="settings-card">
                        <h3><i className="fas fa-text-height"></i> Arabic Font Size</h3>
                        <div className="card-body">
                            <p className="card-desc">Choose the font size for reading Arabic text:</p>
                            <div className="select-wrapper">
                                <select 
                                    onChange={this.arabicSizeChanged} 
                                    value={this.props.arabicSize}
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium (Default)</option>
                                    <option value="large">Large</option>
                                    <option value="xlarge">Extra Large</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Add Custom Languages */}
                    <div className="settings-card add-language-section">
                        <h3><i className="fas fa-plus-circle"></i> Add Translation Language</h3>
                        <div className="card-body">
                            <p className="card-desc">Add other languages to automatically translate the text using Google Translate:</p>
                            {available.length > 0 ? (
                                <div className="add-lang-row">
                                    <div className="select-wrapper">
                                        <select 
                                            value={activeNewLangCode} 
                                            onChange={(e) => this.setState({ selectedNewLanguage: e.target.value })}
                                        >
                                            {available.map(l => (
                                                <option value={l.code} key={l.code}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="add-btn" onClick={this.handleAdd}>
                                        <i className="fas fa-plus"></i> Add
                                    </button>
                                </div>
                            ) : (
                                <div className="info-text">All supported languages have been added.</div>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Custom Languages List */}
                    {(this.props.customLanguages || []).length > 0 && (
                        <div className="settings-card custom-languages-card">
                            <h3><i className="fas fa-list-ul"></i> Added Languages</h3>
                            <div className="card-body">
                                <div className="custom-langs-list">
                                    {this.props.customLanguages.map(l => (
                                        <div className="custom-lang-item" key={l.code}>
                                            <span className="lang-name">{l.name}</span>
                                            <button className="remove-btn" onClick={() => this.props.onRemoveLanguage(l.code)}>
                                                <i className="fas fa-trash-alt"></i> Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="settings-footer">
                    <button className="back-btn" onClick={() => this.props.showComponent("content")}>
                        <i className="fas fa-check"></i> OK
                    </button>
                </div>
            </div>
        );
    }
}

export default Settings;