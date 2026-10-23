# Sudip Lab

A new browser-based JavaScript workspace built for Sudip Sah. Fourteen distinct projects share a responsive dashboard, favorites, project search, light/dark themes, and direct links such as `#tool/tasks`.

## Projects

1. **Taskflow** — tasks, priorities, due dates, completion filters, search, undo removal, JSON export.
2. **Noted** — searchable notes, autosave, pinning, color accents, text export.
3. **Moment** — custom countdowns, saved events, live progress, expired-event handling.
4. **Chroma** — five-color palettes, independent locks, hex/CSS copying, WCAG contrast calculation.
5. **Keysmith** — cryptographic browser randomness, unbiased random sampling, 8–128 characters, guaranteed inclusion of selected character types, optional ambiguous-character exclusion.
6. **Wordcraft** — locally generated placeholder copy across three themes, configurable paragraph/sentence counts, word counts, copy and download.
7. **Frame** — five original SVG landscapes, wraparound navigation, keyboard controls, autoplay, artwork download.
8. **Brainwave** — twelve shuffled questions, explanations, review, personal best, restart.
9. **Devscope** — public GitHub profiles and up to 100 repositories, sorting, cached offline views, network/rate-limit handling.
10. **Cinefind** — searchable 24-film local collection, genre filters, saved watchlist, optional live Wikipedia film search. Local title cards are illustrative artwork.
11. **Skyline** — city disambiguation, current weather, five-day forecast, Celsius/Fahrenheit, saved cities, timestamped cached forecasts.

## Run

Serve this folder with a static web server (ES modules require HTTP/HTTPS). No package installation or build step is needed. GitHub Pages publishes the repository root.

Core behavior tests: `node --test tests/core.test.mjs`.

## Privacy and persistence

Tasks, notes, favorites, watchlists, city selections, cached public API responses, and preferences stay in localStorage in the current browser, under `sudip.v2.*`. Clearing browser storage removes them. There is no account sync or backend database. Passwords are never stored. Exports are initiated by the user. Browser clipboard access may need permission.

## Services and assets

- Weather and location data: [Open-Meteo](https://open-meteo.com/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Public developer data: [GitHub REST API](https://docs.github.com/en/rest). Public rate limits apply.
- Optional film search and film artwork: [Wikipedia MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page). Availability and cross-origin access depend on the service. The local film collection works without it.
- Fonts: Google Fonts (DM Sans, Manrope), with system-font fallbacks.
- Landscape illustrations and film title cards: new SVG/CSS artwork in this project.

This version replaces the earlier demo collection with a new implementation. Earlier versions remain in normal Git history. No third-party API keys are embedded. Network features report errors rather than presenting fabricated live data.

## Ponytail-inspired maintenance

Project-specific `AGENTS.md` adapts [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)'s existing-code-first workflow for this buildless app. Its MIT notice is retained in `licenses/ponytail-MIT.txt`. It adds no runtime dependency or global agent installation.

The homepage now reuses locally saved tool history for a recently opened shortcut row. Cinefind defaults to online search, explicitly requests poster images, exposes direct source links, provides poster source/rights links, and falls back honestly when an image is absent. Its focused data-normalization tests cover missing images, invalid links, and non-film results. Run the full suite with `node --test tests/*.test.mjs`.
## New: Build & play

Only three distinct apps were added to the original eleven:

12. **Memory Match** — solo and two-player matching, configurable difficulty, hints, scores, and turns.
13. **Melody Studio** — typed piano with keyboard controls, synthesized audio, JSON melodies, pause, and reset.
14. **Signal Chat** — Angular messenger with local demo accounts, cross-tab live messages, remembered contacts, and notifications.

The existing Brainwave quiz remains the only quiz. Earlier memory, piano and messenger variations were consolidated rather than listed as duplicate apps. Existing tools and sudip.v2.* user data remain intact. No lecture PDFs, slides, audio recordings or podcast files are included.

## Complete code package

[Download the entire repository](https://github.com/sudip09-sys/Projects/archive/refs/heads/main.zip). New apps include compiled runnable builds and editable source under projects/. For memory and piano, run npm install and npm run build in their folders. For Signal Chat, run those commands in projects/signal-chat/source/.

To package the code locally with Python 3, run: python scripts/package.py. The archive excludes Git metadata, dependencies and generated downloads.

Signal Chat is an educational browser-local demo, not production authentication. Use demo passwords. The guide contact is simulated. Live REST/WebSocket endpoints can be configured, but external backend/VPN connectivity has not been verified.

Checks: node --test tests/*.test.mjs and node --test projects/signal-chat/tests/conversation.test.mjs.

