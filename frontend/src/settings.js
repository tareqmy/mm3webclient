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
                <div className="english">
                    <div className="header">Settings</div>
                    
                    <div className="para">
                        <label>Translation: </label>
                        <select onChange={this.langSelected} value={this.props.lang}>
                            <option value="english">English</option>
                            <option value="bengali">বাংলা</option>
                            {(this.props.customLanguages || []).map(l => (
                                <option value={l.code} key={l.code}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="settings-section">
                        <div className="section-title">Add Language (Google Translate)</div>
                        {available.length > 0 ? (
                            <div className="add-lang-row">
                                <select 
                                    value={activeNewLangCode} 
                                    onChange={(e) => this.setState({ selectedNewLanguage: e.target.value })}
                                >
                                    {available.map(l => (
                                        <option value={l.code} key={l.code}>{l.name}</option>
                                    ))}
                                </select>
                                <button className="add-btn" onClick={this.handleAdd}>Add</button>
                            </div>
                        ) : (
                            <div className="info-text">All supported languages added.</div>
                        )}
                    </div>

                    {(this.props.customLanguages || []).length > 0 && (
                        <div className="settings-section">
                            <div className="section-title">Your Custom Languages</div>
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
                    )}
                </div>
                <button onClick={() => this.props.showComponent("content")}>OK</button>
            </div>
        );
    }
}

export default Settings;