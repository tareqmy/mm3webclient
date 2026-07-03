# AGENTS.md — Instructions for AI Agents

> Read this file before making any changes to the mm3webclient project.

---

## Project Identity

This is **mm3webclient** — the React frontend for the *Munajat-e-Maqbool* Islamic dua web app.

- **Live URL**: served via AWS CloudFront + S3
- **API**: `https://api.munajatemaqbool.com` (serverless: CloudFront → API Gateway → Lambda → DynamoDB)
- **Framework**: React 16, Create React App (CRA)
- **Node version**: 22.x (LTS — upgraded from 14.x)
- **Language**: JavaScript (no TypeScript)

---

## Core Constraints — Read Before Changing Anything

1. **Node 22 is targeted.** `package.json`, `Dockerfile`, and `buildspec.yml` all target Node 22. Any upgrade must be synchronized across all three files and tested with `react-scripts@5.0.1`.

2. **`react-scripts@5.0.1` is targeted.** Do not modify or upgrade the build tooling version without explicit instruction. The S3/CloudFront build artifact routing depends on this configuration.

3. **No backend code lives here.** The backend (API Gateway, Lambda, DynamoDB) is a separate AWS project. If you need to modify API behavior, that is out of scope for this repo.

4. **The API base URL is hardcoded.** `https://api.munajatemaqbool.com` is embedded in multiple source files:
   - `frontend/src/index.js` (line 96) — dua endpoint
   - `frontend/src/intro.js` (lines 40, 57, 75) — misc endpoints 1–3
   - `frontend/src/khutbah.js` (lines 40, 57, 74) — misc endpoints 4–6
   - `frontend/src/title.js` (line 24) — misc endpoint 1

   If the API domain changes, update all four files. Consider extracting it to a config constant.

5. **Dua ID range is 1–196.** `first=1` and `last=196` are hardcoded in `index.js`. The day-to-ID mapping is in `frontend/src/datum/days.js`. These must stay in sync.

6. **State lives in localStorage.** There is no Redux, MobX, or other state library. State flows through the root `MunjateMaqbool` component and is persisted to localStorage. Keep it that way unless instructed otherwise.

7. **Fonts are self-hosted.** All fonts live in `frontend/src/fonts/` and are declared in `frontend/src/fonts.css`. Do not replace them with CDN-loaded fonts without verifying RTL/multilingual support (Arabic, Bengali).

---

## Architecture Mental Model

```
MunjateMaqbool (index.js)  ← root, owns all state
├── Title (title.js)        ← header; fetches /misc/1 on mount
├── Menu (menu.js)          ← navigation; controls showComponent
├── Content (content.js)   ← main dua view; navigation controls
├── Intro (intro.js)        ← shown on first visit; fetches /misc/1,2,3
├── Khutbah (khutbah.js)   ← shown after intro; fetches /misc/4,5,6
├── Bookmarks (bookmarks.js)← list of saved prayers; all from localStorage
├── Settings (settings.js) ← language switch (english/bengali)
└── Help (help.js)          ← about page; no API calls
```

**View routing** is controlled by `showComponent` state (string, not a URL router):
- `"intro"` → `<Intro>` (first-time or revisit)
- `"khutbah"` → `<Khutbah>`
- `"content"` → `<Content>` (main app)
- `"bookmarks"` → `<Bookmarks>`
- `"settings"` → `<Settings>`
- `"help"` → `<Help>`

Only one view is rendered at a time. There is no `react-router`.

---

## API Contract

All API calls use `superagent` (`get()` from `"superagent"`).

**GET /dua/{id}** — response:
```json
{
  "id": 42,
  "number": 42,
  "tags": "sunday",
  "arabic": "...",
  "english": "...",
  "bengali": "..."
}
```

**GET /misc/{id}** — same shape, `tags` is the category type (`"intro"` or `"khutbah"`).

All errors are shown via `sweetalert` modal: `swal("Oops!", "Something went wrong!", "error")`.

---

## LocalStorage Keys

| Key           | Type   | Description                                    |
|---------------|--------|------------------------------------------------|
| `prayer`      | JSON   | Current dua object                             |
| `prayer.tags` | string | Current day tag (`saturday`, `sunday`, etc.)   |
| `lang`        | string | Translation language (`english` or `bengali`)  |
| `bookmarks`   | JSON   | `{ [id]: prayerObject }` map                   |
| `init`        | string | Last active component name                     |

---

## Day Data (`datum/days.js`)

Each day entry:
```js
{
  previous: "friday",   // previous day key
  begin: 1,             // first dua ID for this day
  size: 48,             // number of duas for this day
  value: "saturday",    // display name / key
  next: "sunday"        // next day key
}
```

Days cycle: saturday → sunday → monday → tuesday → wednesday → thursday → friday → saturday

---

## Common Tasks

### Add a new page/view

1. Create `frontend/src/newpage.js` and `newpage.css`
2. Import the component in `index.js`
3. Add a state case in `render()` with `this.state.showComponent === "newpage"`
4. Add a button in `menu.js` calling `this.props.showComponent("newpage")`

### Change language options

Edit `frontend/src/settings.js` — add a new `<option>` and ensure the corresponding CSS class (`div.{lang}`) exists in all content components.

### Change API base URL

Search for `https://api.munajatemaqbool.com` across `src/` and replace in all occurrences. Consider centralizing this into a `src/config.js` file:
```js
export const API_BASE = "https://api.munajatemaqbool.com";
```

### Add or update keyboard shortcuts

Edit `handleKeyPress` in `index.js`. All key handling is centralized there.

### Deploy to production

Push to the CodeBuild-connected repository. The `buildspec.yml` handles:
- `npm install`
- `npm run build`
- Artifact upload to S3 (`frontend/build/`)

### Local Docker dev

```bash
# First time
sh image.sh

# Start
docker-compose up -d

# Rebuild after Dockerfile or package.json changes
sh rebuild.sh

# Shell access
sh shell.sh
```

---

## Known Technical Debt

- **Duplicate API call for `/misc/1`**: Both `Title` and `Intro` independently fetch the book title (`/misc/1`) on mount. This is a redundant request.
- **Hardcoded API URLs**: The base URL `https://api.munajatemaqbool.com` appears in 4 separate files. Should be extracted to a config module.
- **Class components throughout**: All components are class-based React 16. Functional components with hooks would be cleaner — but do not refactor unless instructed.
- **No tests**: `react-scripts test` is configured but no test files exist.

---

## Do Not

- Do not introduce TypeScript without explicit instruction
- Do not add a routing library (react-router, etc.) without instruction
- Do not change the Node 22 / react-scripts 5.x versions without instruction
- Do not add CSS-in-JS (styled-components, Emotion, etc.) — vanilla CSS files are used per component
- Do not move font files out of `frontend/src/fonts/` — they are imported via relative paths in CSS
- Do not modify `buildspec.yml` artifact paths without updating the S3/CodePipeline configuration
