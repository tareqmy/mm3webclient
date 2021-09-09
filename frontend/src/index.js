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
import { get } from "superagent";
// end::vars[]

// tag::app[]
class MunjateMaqbool extends React.Component {

    constructor(props) {
        super(props);

        var first = 1;
        var last = 196;
        var size = 1;
        var defaultLang = "english";
        var defaultDay = "saturday";

        this.state = {
            isMobile: this.isMobile(),
            size: size,
            first: first,
            last: last,
            lang: this.getLang(defaultLang),
            bookmarks: this.getBookmarks(),
            showComponent: this.initComponent(),
            prayer: this.initPrayer(first, defaultDay),
        };
        this.fetch(this.state.prayer.id);
    }

    initPrayer(first, defaultDay) {
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
        var serverLocation = "https://api.munajatemaqbool.com"
            + "/dua/" + page;

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
    }

    next = () => {
        var currentpage = this.state.prayer.id;
        var nextpage = currentpage === this.state.last ? this.state.first : +currentpage + 1;
        this.fetch(nextpage);
    }

    previous = () => {
        var currentpage = this.state.prayer.id;
        var previouspage = currentpage === this.state.first ? this.state.last : +currentpage - 1;
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

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    // make sure to remove the listener
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
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
            <div className={"container " + this.getMobileClass()} >
                <Title lang={this.state.lang} isMobile={this.state.isMobile}/>
                <Menu prayer={this.state.prayer} component={this.state.showComponent} showComponent={this.showComponent} />
                {
                    this.state.showComponent === "intro" &&
                    <Intro showComponent={this.showComponent} lang={this.state.lang} />
                }
                {
                    this.state.showComponent === "khutbah" &&
                    <Khutbah showComponent={this.showComponent} lang={this.state.lang} />
                }
                {
                    this.state.showComponent === "content" &&
                    <Content lang={this.state.lang} prayer={this.state.prayer} days={days}
                        onDayChange={this.daySelected} onFetch={this.fetch}
                        next={this.next} previous={this.previous}
                        nextBookmark={this.nextBookmark} previousBookmark={this.previousBookmark}
                        bookmarks={this.state.bookmarks} toggleBookmark={this.toggleBookmark} />
                }
                {
                    this.state.showComponent === "bookmarks" &&
                    <Bookmarks showComponent={this.showComponent} lang={this.state.lang}
                        unBookmark={this.unBookmark} bookmarks={this.state.bookmarks} onFetch={this.fetch} />
                }
                {
                    this.state.showComponent === "settings" &&
                    <Settings showComponent={this.showComponent} lang={this.state.lang}
                        onLangChange={this.langSelected} />
                }
                {
                    this.state.showComponent === "help" &&
                    <Help showComponent={this.showComponent} />
                }
            </div>
        );
    }
}
// end::app[]

// tag::render[]
ReactDOM.render(<MunjateMaqbool />, document.getElementById('react'));
// end::render[]
