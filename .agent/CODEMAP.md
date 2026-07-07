# CODEMAP.md — Codebase Map for mm3webclient

> Quick reference for navigating the codebase. Read AGENTS.md for behavioral constraints.

---

## Entry Points

| File | Purpose |
|------|---------|
| `frontend/public/index.html` | HTML shell — mounts React at `<div id="react">` |
| `frontend/src/index.js` | React root — `MunjateMaqbool` class component, renders everything |

---

## Component Tree

```
MunjateMaqbool                     frontend/src/index.js
│  State: prayer, lang, bookmarks, showComponent, isMobile
│  API: GET /dua/{id}
│
├── Title                          frontend/src/title.js
│   API: GET /misc/1 (book title)
│   Props: lang, isMobile
│
├── Menu                           frontend/src/menu.js
│   Props: prayer, component, showComponent
│   Controls: intro | khutbah | content | bookmarks | settings | help
│
├── [Content]                      frontend/src/content.js
│   Condition: showComponent === "content"
│   Props: lang, prayer, days, onDayChange, onFetch,
│           next, previous, nextBookmark, previousBookmark,
│           bookmarks, toggleBookmark
│   Sub: Bookit (inline functional component)
│
├── [Intro]                        frontend/src/intro.js
│   Condition: showComponent === "intro"
│   API: GET /misc/1,2,3
│   Props: showComponent, lang
│
├── [Khutbah]                      frontend/src/khutbah.js
│   Condition: showComponent === "khutbah"
│   API: GET /misc/4,5,6
│   Props: showComponent, lang
│
├── [Bookmarks]                    frontend/src/bookmarks.js
│   Condition: showComponent === "bookmarks"
│   Props: showComponent, lang, unBookmark, bookmarks, onFetch
│   Sub: Bookmark (inline functional component)
│
├── [Settings]                     frontend/src/settings.js
│   Condition: showComponent === "settings"
│   Props: showComponent, lang, onLangChange
│
└── [Help]                         frontend/src/help.js
    Condition: showComponent === "help"
    Props: showComponent
```

---

## Source Files

### `frontend/src/index.js`
Root component. Owns all application state.

| Method | Description |
|--------|-------------|
| `constructor` | Initialize state from localStorage; call `fetch(prayer.id)` |
| `initPrayer(first, defaultDay)` | Load saved prayer or create default |
| `initComponent()` | Load saved view or default to `"intro"` |
| `getTags(defaultDay)` | Load saved day tag or use default |
| `getLang(defaultLang)` | Load saved language preference |
| `getBookmarks()` | Load saved bookmarks from localStorage |
| `fetch(page)` | HTTP GET `/dua/{page}` → call `update()` |
| `update(prayer)` | Save prayer to localStorage + setState |
| `next()` | Advance to next dua (wraps at 196→1) |
| `previous()` | Go to previous dua (wraps at 1→196) |
| `nextDay()` | Jump to first dua of next day |
| `previousDay()` | Jump to first dua of previous day |
| `getbegin(day)` | Returns first dua ID for a given day from `days.js` |
| `nextBookmark()` | Navigate to next bookmarked dua |
| `previousBookmark()` | Navigate to previous bookmarked dua |
| `daySelected(page)` | Jump to first dua of selected day |
| `langSelected(lang)` | Switch language (english/bengali) |
| `toggleBookmark()` | Add/remove current dua from bookmarks |
| `unBookmark(bookit)` | Remove specific dua from bookmarks |
| `showComponent(component)` | Switch active view |
| `handleKeyPress(event)` | Keyboard shortcuts (j/k/l/h/b/n/v + arrows) |
| `isMobile()` | Returns `window.innerWidth <= 800` |
| `render()` | Renders title + menu + active component |

---

### `frontend/src/content.js`
Main dua display. Shows Arabic text and selected translation.

| Element | Description |
|---------|-------------|
| `.navigation` | Day selector dropdown, dua number selector, prev/next/bookmark buttons |
| `.content > .prayerholder` | Arabic text, hr, then english OR bengali div |
| `.meta` | Shows current dua ID |
| `Bookit` | Inline functional: star icon button, filled if bookmarked |

---

### `frontend/src/title.js`
Header bar. Shows book title in selected language + Arabic (hidden on mobile).

---

### `frontend/src/menu.js`
Navigation bar with icon buttons. FontAwesome icons via CDN.

| Button | Icon | View |
|--------|------|------|
| Home | fa-home | content |
| Introduction | fa-info | intro |
| Khutbah | fa-comment | khutbah |
| Bookmarks | fa-star | bookmarks |
| Settings | fa-cog | settings |
| About | fa-question | help |

---

### `frontend/src/intro.js`
Intro/preface page. Fetches 3 sections from `/misc/1`, `/misc/2`, `/misc/3`.
- Shows: title header, start text, body
- "OK" button → sets `init` in localStorage and navigates to khutbah

---

### `frontend/src/khutbah.js`
Khutbah page. Fetches 3 sections from `/misc/4`, `/misc/5`, `/misc/6`.
- Shows: title header, start text, body
- "OK" button → sets `init` in localStorage and navigates to content

---

### `frontend/src/bookmarks.js`
Bookmarks list. Reads all bookmarks from props (from localStorage).
- Each `Bookmark` item: click left side → navigate to dua; click star → remove bookmark

---

### `frontend/src/settings.js`
Language selector. Only one setting: translation language dropdown.

---

### `frontend/src/help.js`
Static about page. No API calls. Shows attribution and keyboard shortcut reference.

---

### `frontend/src/datum/days.js`
Static data file mapping day names to ID ranges.

```js
{
  saturday:  { previous: "friday",    begin: 1,   size: 48, next: "sunday"    },
  sunday:    { previous: "saturday",  begin: 49,  size: 34, next: "monday"    },
  monday:    { previous: "sunday",    begin: 83,  size: 31, next: "tuesday"   },
  tuesday:   { previous: "monday",    begin: 114, size: 33, next: "wednesday" },
  wednesday: { previous: "tuesday",   begin: 147, size: 22, next: "thursday"  },
  thursday:  { previous: "wednesday", begin: 169, size: 15, next: "friday"    },
  friday:    { previous: "thursday",  begin: 184, size: 13, next: "saturday"  }
}
```

---

## CSS Files

Each component has a paired `.css` file imported in the component's `.js`:

| CSS File | Scope |
|----------|-------|
| `index.css` | Global body, container (.container, .container.mobile), form elements |
| `fonts.css` | All @font-face declarations — imported by index.css |
| `title.css` | `.title` table, `.titleenglish`, `.titlebengali`, `.titlearabic` |
| `menu.css` | `.menu`, `.left`, button active/inactive states |
| `content.css` | `.navigation`, `.content`, `.prayerholder`, `.arabic`, `.english`, `.bengali`, `.meta`, `.bookit` |
| `intro.css` | `.intro`, `.header`, `.start`, arabic/english/bengali divs |
| `khutbah.css` | `.khutbah`, same structure as intro |
| `bookmarks.css` | `.bookmarks`, `.bookmark`, `.left`, `.right` |
| `settings.css` | `.settings`, `.header`, `.para` |
| `help.css` | `.help`, `.header`, `.para` |

---

## Infrastructure Files

| File | Description |
|------|-------------|
| `Dockerfile` | Node 22 Alpine; installs deps, copies source, runs `entrypoint.sh` |
| `docker-compose.yml` | Maps port 3000, volume-mounts `src/` and `public/` for hot reload |
| `buildspec.yml` | AWS CodeBuild: install → build → artifact `frontend/build/**/*` |
| `entrypoint.sh` | If `APP_ENV=production`: build + serve with `http-server`; else: `npm start` |
| `Makefile` | Handles Docker image builds (`make image`), environment rebuilds (`make rebuild`), and interactive shell access (`make shell`) |
| `.env` | `CLIENT_APP=memappclient` (used by Makefile and docker-compose) |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^16.14.0 | UI framework |
| `react-dom` | ^16.14.0 | DOM rendering |
| `react-scripts` | 5.0.1 | CRA build tooling |
| `superagent` | ^6.1.0 | HTTP client for API calls |
| `sweetalert` | ^2.1.2 | Error/info modal dialogs |
| `react-tooltip` | ^4.2.21 | Hover tooltips on buttons |

FontAwesome 5.0.8 is loaded from CDN in `public/index.html`.

---

## Key API Call Locations

| File | Line | Endpoint |
|------|------|----------|
| `index.js` | ~96 | `GET /dua/{id}` |
| `title.js` | ~24 | `GET /misc/1` |
| `intro.js` | ~40 | `GET /misc/1` |
| `intro.js` | ~57 | `GET /misc/2` |
| `intro.js` | ~75 | `GET /misc/3` |
| `khutbah.js` | ~40 | `GET /misc/4` |
| `khutbah.js` | ~57 | `GET /misc/5` |
| `khutbah.js` | ~74 | `GET /misc/6` |
