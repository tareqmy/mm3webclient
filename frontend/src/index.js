// tag::vars[]
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Title from './title';
import Menu from './menu';
import Content from './content';
import Intro from './intro';
import Khutbah from './khutbah';
import Bookmarks from './bookmarks';
import Settings from './settings';
import Help from './help';
import days from './datum/days';
import swal from 'sweetalert';
import duas from './dua.json';
import miscs from './misc.json';
// end::vars[]

// tag::app[]
class MunjateMaqbool extends React.Component {

    parsePath() {
        const path = window.location.pathname;
        const matchDua = path.match(/\/dua\/(\d+)/);
        if (matchDua) {
            const id = Number(matchDua[1]);
            if (id >= 1 && id <= 196) {
                return { showComponent: "content", prayerId: id };
            }
        }
        const validComponents = ["khutbah", "bookmarks", "settings", "help", "intro"];
        for (const comp of validComponents) {
            if (path.includes(`/${comp}`)) {
                return { showComponent: comp, prayerId: null };
            }
        }
        return null;
    }

    updateUrlPath(component, prayerId = null) {
        let path = "/";
        if (component === "content" && prayerId) {
            path = `/dua/${prayerId}/`;
        } else if (component && component !== "intro") {
            path = `/${component}/`;
        }
        if (window.location.pathname !== path) {
            window.history.pushState(null, "", path);
        }
    }

    updateSEO(title, description, path) {
        document.title = title;

        const setMeta = (name, value, isProperty = false) => {
            const attr = isProperty ? "property" : "name";
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', value);
        };

        const setLink = (rel, href) => {
            let element = document.querySelector(`link[rel="${rel}"]`);
            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }
            element.setAttribute('href', href);
        };

        if (description) {
            setMeta('description', description);
            setMeta('og:description', description, true);
            setMeta('twitter:description', description);
        }

        setMeta('og:title', title, true);
        setMeta('twitter:title', title);

        const fullUrl = window.location.origin + path;
        setMeta('og:url', fullUrl, true);
        setMeta('twitter:url', fullUrl);
        setLink('canonical', fullUrl);
    }

    updatePageSEO(component, prayer) {
        if (component === "content" && prayer) {
            this.updateUrlPath("content", prayer.id);
            const cleanEnglish = prayer.english ? prayer.english.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : "";
            const cleanBengali = prayer.bengali ? prayer.bengali.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : "";
            const translationText = cleanEnglish || cleanBengali;
            const snippet = translationText ? (translationText.length > 150 ? translationText.substring(0, 150) + "..." : translationText) : "";
            const title = `Dua ${prayer.id} (${prayer.tags}) - Munajat E Maqbool`;
            const description = `Dua ${prayer.id} (${prayer.tags}) - Munajat E Maqbool daily Islamic prayer. ${snippet}`;
            this.updateSEO(title, description, `/dua/${prayer.id}/`);
        } else {
            this.updateUrlPath(component);
            const capitalized = component.charAt(0).toUpperCase() + component.slice(1);
            const title = `${capitalized} - Munajat E Maqbool`;
            let description = "";
            let path = `/${component}/`;
            if (component === "intro") {
                description = "Munajat-e-Maqbool (مناجاة مقبول) is a compilation of daily Islamic prayers (duas) from the Quran and Hadith compiled by Maulana Ashraf Ali Thanvi.";
                path = "/";
            } else if (component === "khutbah") {
                description = "Read the Friday Sermon (Khutbah) and introductory supplications of Munajat-e-Maqbool.";
            } else if (component === "bookmarks") {
                description = "Your saved favorite prayers and duas from Munajat-e-Maqbool.";
            } else if (component === "settings") {
                description = "Configure language translation and voice options for reading Munajat-e-Maqbool.";
            } else if (component === "help") {
                description = "Help, credits, and keyboard shortcuts information for Munajat-e-Maqbool.";
            }
            this.updateSEO(title, description, path);
        }
    }

    constructor(props) {
        super(props);

        var first = 1;
        var last = 196;
        var size = 1;
        var defaultLang = "english";
        var defaultDay = "saturday";
        var defaultArabicFont = "noto";
        var defaultArabicSize = "medium";

        const route = this.parsePath();
        let initComponent = this.initComponent();
        if (route) {
            initComponent = route.showComponent;
        }

        const initialLang = this.getLang(defaultLang);
        const initialArabicFont = this.getArabicFont(defaultArabicFont);
        const initialArabicSize = this.getArabicSize(defaultArabicSize);
        const initialPrayer = this.initPrayer(first, defaultDay, route ? route.prayerId : null);
        const initialTitle = miscs.find(m => Number(m.id) === 1) || {
            type: "misc",
            arabic: "",
            english: "",
            bengali: "",
            id: 1,
        };

        this.state = {
            isMobile: this.isMobile(),
            size: size,
            first: first,
            last: last,
            lang: initialLang,
            arabicFont: initialArabicFont,
            arabicSize: initialArabicSize,
            customLanguages: this.getCustomLanguages(),
            bookmarks: this.getBookmarks(),
            showComponent: initComponent,
            prayer: initialPrayer,
            title: initialTitle
        };
    }

    initPrayer(first, defaultDay, routePrayerId = null) {
        let targetId = first;
        if (routePrayerId !== null) {
            targetId = routePrayerId;
        } else {
            var stored = localStorage.getItem('prayer');
            if (stored !== null) {
                try {
                    var parsed = JSON.parse(stored);
                    if (parsed && parsed.id) {
                        targetId = parsed.id;
                    }
                } catch (e) {}
            }
        }

        const dua = duas.find(d => Number(d.id) === Number(targetId));
        if (dua) {
            return dua;
        }

        return {
            tags: this.getTags(defaultDay),
            arabic: "",
            english: "",
            bengali: "",
            number: targetId,
            id: targetId,
        };
    }

    initComponent() {
        var init = localStorage.getItem('init');
        if (init === null) {
            init = "intro";
        }
        return init;
    }

    getTags(defaultDay) {
        var tags = localStorage.getItem('prayer.tags');
        if (tags === null) {
            tags = defaultDay;
        }
        return tags;
    }

    getLang(defaultLang) {
        var lang = localStorage.getItem('lang');
        if (lang === null) {
            lang = defaultLang;
        }
        return lang;
    }

    getArabicFont(defaultArabicFont) {
        var font = localStorage.getItem('arabicFont');
        if (font === null) {
            font = defaultArabicFont;
        }
        return font;
    }

    arabicFontSelected = (font) => {
        localStorage.setItem('arabicFont', font);
        this.setState({
            arabicFont: font
        });
    }

    getArabicSize(defaultArabicSize) {
        var size = localStorage.getItem('arabicSize');
        if (size === null) {
            size = defaultArabicSize;
        }
        return size;
    }

    arabicSizeSelected = (size) => {
        localStorage.setItem('arabicSize', size);
        this.setState({
            arabicSize: size
        });
    }

    getCustomLanguages() {
        var langs = localStorage.getItem('customLanguages');
        if (langs === null) {
            langs = [];
        } else {
            try {
                langs = JSON.parse(langs);
            } catch(e) {
                langs = [];
            }
        }
        return langs;
    }

    addLanguage = (code, name) => {
        const customLanguages = [...this.state.customLanguages];
        if (!customLanguages.some(l => l.code === code)) {
            customLanguages.push({ code, name });
            localStorage.setItem('customLanguages', JSON.stringify(customLanguages));
            this.setState({ customLanguages });
        }
    }

    removeLanguage = (code) => {
        const customLanguages = this.state.customLanguages.filter(l => l.code !== code);
        localStorage.setItem('customLanguages', JSON.stringify(customLanguages));
        
        let nextLang = this.state.lang;
        if (this.state.lang === code) {
            nextLang = "english";
            localStorage.setItem('lang', nextLang);
        }
        
        this.setState({
            customLanguages,
            lang: nextLang
        });
    }

    getCachedTranslation(text, toLang) {
        if (!text || !toLang || toLang === 'english' || toLang === 'bengali') {
            return '';
        }
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        const cacheKey = `trans_${toLang}_${hash}`;
        return localStorage.getItem(cacheKey) || '';
    }

    getBookmarks = () => {
        var bookmarks = localStorage.getItem('bookmarks');
        if (bookmarks === null) {
            bookmarks = {};
        } else {
            bookmarks = JSON.parse(bookmarks);
        }
        return bookmarks;
    }

    fetch = (page) => {
        const dua = duas.find(d => Number(d.id) === Number(page));
        if (dua) {
            this.update(dua);
        } else {
            console.error("Dua not found: " + page);
        }
    }

    update(prayer) {
        localStorage.setItem('prayer', JSON.stringify(prayer));
        this.setState({
            prayer: prayer,
        });
        if (this.state.showComponent === "content") {
            this.updatePageSEO("content", prayer);
        }
    }

    next = () => {
        var currentpage = Number(this.state.prayer.id);
        var nextpage = currentpage === this.state.last ? this.state.first : currentpage + 1;
        this.fetch(nextpage);
    }

    previous = () => {
        var currentpage = Number(this.state.prayer.id);
        var previouspage = currentpage === this.state.first ? this.state.last : currentpage - 1;
        this.fetch(previouspage);
    }

    getbegin(day) {
        return days[day].begin;
    }

    previousDay = () => {
        var previousday = days[this.state.prayer.tags].previous;
        var previousdaybegins = this.getbegin(previousday);
        this.fetch(previousdaybegins);
    }

    nextDay = () => {
        var nextday = days[this.state.prayer.tags].next;
        var nextdaybegins = this.getbegin(nextday);
        this.fetch(nextdaybegins);
    }

    previousBookmark = () => {
        var keys = Object.keys(this.state.bookmarks);
        var currentId = this.state.prayer.id + "";
        if (keys.length > 0) {
            var page = keys.length - 1;
            if (this.state.bookmarks[currentId]) {
                const index = keys.indexOf(currentId);
                if (index <= 0) {
                    page = keys.length - 1;
                } else {
                    page = index - 1;
                }
            } else {
                for (var i = keys.length - 1; i >= 0; i--) {
                    if (Number(keys[i]) < Number(currentId)) {
                        page = i;
                        break;
                    }
                }
            }
            this.fetch(keys[page]);
        } else {
            //do nothing
            swal("Oops!", "You do not have any bookmarks!");
        }
    }

    nextBookmark = () => {
        var keys = Object.keys(this.state.bookmarks);
        var currentId = this.state.prayer.id + "";
        if (keys.length > 0) {
            var page = 0;
            if (this.state.bookmarks[currentId]) {
                const index = keys.indexOf(currentId);
                if (index >= keys.length - 1) {
                    page = 0;
                } else {
                    page = index + 1;
                }
            } else {
                for (var i = 0; i < keys.length; i++) {
                    if (Number(keys[i]) > Number(currentId)) {
                        page = i;
                        break;
                    }
                }
            }
            this.fetch(keys[page]);
        } else {
            //do nothing
            swal("Oops!", "You do not have any bookmarks!");
        }
    }

    daySelected = (page) => {
        var nextdaybegins = this.getbegin(page);
        this.fetch(nextdaybegins);
    }

    langSelected = (lang) => {
        localStorage.setItem('lang', lang);
        this.setState({
            lang: lang
        });
    }

    toggleBookmark = () => {
        var bookit = this.state.prayer.id;
        var bookmarks = this.state.bookmarks;
        if (bookmarks[bookit]) {
            delete bookmarks[bookit];
        } else {
            bookmarks[bookit] = this.state.prayer;
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        this.setState({
            bookmarks: bookmarks,
        });
    }

    unBookmark = (bookit) => {
        var bookmarks = this.state.bookmarks;
        if (bookmarks[bookit]) {
            delete bookmarks[bookit];

            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            this.setState({
                bookmarks: bookmarks,
            });
        }
    }

    showComponent = (component) => {
        this.setState({
            showComponent: component
        });
        this.updatePageSEO(component, this.state.prayer);
    }

    handleKeyPress = (event) => {
        if (this.state.showComponent === "content") {
            if (event.key === 'ArrowRight'
                || event.key === 'k') {
                this.next();
            } else if (event.key === 'ArrowLeft'
                || event.key === 'j') {
                this.previous();
            } else if (event.key === 'ArrowUp'
                || event.key === 'l') {
                this.nextDay();
            } else if (event.key === 'ArrowDown'
                || event.key === 'h') {
                this.previousDay();
            } else if (event.key === 'n') {
                this.nextBookmark();
            } else if (event.key === 'b') {
                if (event.ctrlKey) {
                    this.showComponent("bookmarks");
                } else {
                    this.toggleBookmark();
                }
            } else if (event.key === 'v') {
                this.previousBookmark();
            } else if (event.key === 't') {
                const nextLang = this.state.lang === 'english' ? 'bengali' : 'english';
                this.langSelected(nextLang);
            }
        }
    }

    handlePopState = () => {
        const route = this.parsePath();
        const showComponent = route ? route.showComponent : "intro";
        const prayerId = route ? route.prayerId : null;

        this.setState({
            showComponent: showComponent
        });

        if (showComponent === "content") {
            if (prayerId && Number(this.state.prayer.id) !== prayerId) {
                this.fetch(prayerId);
            } else {
                this.updatePageSEO("content", this.state.prayer);
            }
        } else {
            this.updatePageSEO(showComponent, null);
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
        window.addEventListener('resize', this.handleWindowSizeChange);
        window.addEventListener('popstate', this.handlePopState);
        this.updatePageSEO(this.state.showComponent, this.state.prayer);
    }

    fetchTitle() {
        const title = miscs.find(m => Number(m.id) === 1);
        if (title) {
            this.setState({
                title: title,
            });
        }
    }

    // make sure to remove the listeners
    // when the component is not mounted anymore
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
        window.removeEventListener('resize', this.handleWindowSizeChange);
        window.removeEventListener('popstate', this.handlePopState);
    }

    handleWindowSizeChange = () => {
        this.setState({
            isMobile: this.isMobile()
        });
    }

    isMobile = () => {
        return window.innerWidth <= 800;
    }

    getMobileClass = () => {
        return this.isMobile() ? "mobile" : "";
    }



    render() {
        return (
            <div className={`container ${this.getMobileClass()} arabic-font-${this.state.arabicFont} arabic-size-${this.state.arabicSize}`}>
                <Title lang={this.state.lang} isMobile={this.state.isMobile} title={this.state.title}/>
                <Menu prayer={this.state.prayer} component={this.state.showComponent}
                      showComponent={this.showComponent}/>
                {
                    this.state.showComponent === "intro" &&
                    <Intro showComponent={this.showComponent} lang={this.state.lang} title={this.state.title}/>
                }
                {
                    this.state.showComponent === "khutbah" &&
                    <Khutbah showComponent={this.showComponent} lang={this.state.lang}/>
                }
                {
                    this.state.showComponent === "content" &&
                    <Content lang={this.state.lang} prayer={this.state.prayer} days={days}
                             onDayChange={this.daySelected} onFetch={this.fetch}
                             next={this.next} previous={this.previous}
                             nextBookmark={this.nextBookmark} previousBookmark={this.previousBookmark}
                             bookmarks={this.state.bookmarks} toggleBookmark={this.toggleBookmark}
                             isMobile={this.state.isMobile}/>
                }
                {
                    this.state.showComponent === "bookmarks" &&
                    <Bookmarks showComponent={this.showComponent} lang={this.state.lang}
                               unBookmark={this.unBookmark} bookmarks={this.state.bookmarks} onFetch={this.fetch}/>
                }
                {
                    this.state.showComponent === "settings" &&
                    <Settings showComponent={this.showComponent} lang={this.state.lang}
                               onLangChange={this.langSelected}
                               customLanguages={this.state.customLanguages}
                               onAddLanguage={this.addLanguage}
                               onRemoveLanguage={this.removeLanguage}
                               arabicFont={this.state.arabicFont}
                               onArabicFontChange={this.arabicFontSelected}
                               arabicSize={this.state.arabicSize}
                               onArabicSizeChange={this.arabicSizeSelected}/>
                }
                {
                    this.state.showComponent === "help" &&
                    <Help showComponent={this.showComponent}/>
                }
            </div>
        );
    }
}

// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool/>, document.getElementById('react'));
// end::render[]
