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
import {get} from "superagent";
import {API_BASE} from "./config";
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

    constructor(props) {
        super(props);

        var first = 1;
        var last = 196;
        var size = 1;
        var defaultLang = "english";
        var defaultDay = "saturday";

        const route = this.parsePath();
        let initComponent = this.initComponent();
        if (route) {
            initComponent = route.showComponent;
        }

        this.state = {
            isMobile: this.isMobile(),
            size: size,
            first: first,
            last: last,
            lang: this.getLang(defaultLang),
            bookmarks: this.getBookmarks(),
            showComponent: initComponent,
            prayer: this.initPrayer(first, defaultDay, route ? route.prayerId : null),
            title: {
                type: "intro",
                arabic: "",
                english: "",
                bengali: "",
                id: 2,
            }
        };
        this.fetch(this.state.prayer.id);
    }

    initPrayer(first, defaultDay, routePrayerId = null) {
        if (routePrayerId !== null) {
            var stored = localStorage.getItem('prayer');
            if (stored !== null) {
                var parsed = JSON.parse(stored);
                if (Number(parsed.id) === Number(routePrayerId)) {
                    return parsed;
                }
            }
            return {
                tags: this.getTags(defaultDay),
                arabic: "",
                english: "",
                bengali: "",
                number: routePrayerId,
                id: routePrayerId,
            };
        }

        var prayer = localStorage.getItem('prayer');
        if (prayer === null) {
            prayer = {
                tags: this.getTags(defaultDay),
                arabic: "",
                english: "",
                bengali: "",
                number: first,
                id: first,
            }
        } else {
            prayer = JSON.parse(prayer);
        }
        return prayer;
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
        var self = this;
        var serverLocation = API_BASE + "/dua/" + page;

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                self.update(json_result);
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
    }

    update(prayer) {
        localStorage.setItem('prayer', JSON.stringify(prayer));
        this.setState({
            prayer: prayer,
        });
        if (this.state.showComponent === "content") {
            this.updateUrlPath("content", prayer.id);
            document.title = `Dua ${prayer.id} (${prayer.tags}) - Munajat E Maqbool`;
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
            lang: lang,
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
        if (component !== "content") {
            this.updateUrlPath(component);
            const capitalized = component.charAt(0).toUpperCase() + component.slice(1);
            document.title = `${capitalized} - Munajat E Maqbool`;
        } else {
            this.updateUrlPath("content", this.state.prayer.id);
            const prayer = this.state.prayer;
            const dayTag = prayer.tags || "";
            document.title = `Dua ${prayer.id} (${dayTag}) - Munajat E Maqbool`;
        }
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
                const prayer = this.state.prayer;
                document.title = `Dua ${prayer.id} (${prayer.tags}) - Munajat E Maqbool`;
            }
        } else {
            const capitalized = showComponent.charAt(0).toUpperCase() + showComponent.slice(1);
            document.title = `${capitalized} - Munajat E Maqbool`;
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
        window.addEventListener('resize', this.handleWindowSizeChange);
        window.addEventListener('popstate', this.handlePopState);
        this.fetchTitle();

        if (this.state.showComponent !== "content") {
            const capitalized = this.state.showComponent.charAt(0).toUpperCase() + this.state.showComponent.slice(1);
            document.title = `${capitalized} - Munajat E Maqbool`;
        }
    }

    fetchTitle() {
        var self = this;
        var serverLocation = API_BASE + "/misc/1";

        get(serverLocation)
            .then(function (response) {
                var json_result = JSON.parse(response.text);
                self.setState({
                    title: json_result,
                });
            })
            .catch(function (err) {
                swal("Oops!", "Something went wrong!", "error");
            });
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
            <div className={"container " + this.getMobileClass()}>
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
                              onLangChange={this.langSelected}/>
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
