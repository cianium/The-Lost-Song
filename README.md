<div align="center">

# The Lost Song

**An atmospheric, minimalist music-player experiment inspired by Anathema.**

**HTML · CSS · Vanilla JavaScript**

[![Pages](https://github.com/cianium/The-Lost-Song/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/cianium/The-Lost-Song/actions)
![Status](https://img.shields.io/badge/Status-Frontend%20Demo-6B7280)
![Release](https://img.shields.io/badge/Release-Not%20published-6B7280)

[Website](https://cianium.github.io/The-Lost-Song/) · [Source code](https://github.com/cianium/The-Lost-Song)

</div>

> **Project status:** This is a static front-end experiment, not an official Anathema website, a licensed music distribution service, or a commercial streaming application. GitHub Pages deployment checks have passed, but browser playback and the live site's current behavior have not been independently validated.

## Overview

The Lost Song is a single-page listening experience with a minimal interface, atmospheric effects and three selectable tracks. It explores audio controls, interactive visual design and browser-side playback state without a frontend framework or backend.

## Features

| Feature | Implementation |
| :-- | :-- |
| **Three-track playlist** | Select among three parts of *The Lost Song* |
| **Playback controls** | Play/pause, previous and next track |
| **Progress indicator** | Time display and seek bar with pointer controls |
| **Keyboard seeking** | Arrow keys plus Home/End for progress navigation |
| **Resume playback** | Last selected track and playback position are stored in browser `localStorage` |
| **Responsive visual presentation** | Dark, animated listening interface and ambient background |
| **Playback fallbacks** | Handles unsuccessful playback requests and media loading errors in client-side code |

This table describes features visible in the source. No automated browser test suite is included in the current repository.

## Tech stack

- **HTML5** — page structure and native `<audio>` element.
- **CSS3** — responsive layout, animations and ambient presentation.
- **JavaScript** — playback control, track switching, seeking and local state.
- **GitHub Pages** — static-site hosting configured for the repository.

There is **no backend, user account system, real-time sync, subscription billing or music-production feature**.

## Project structure

```text
The-Lost-Song/
├── README.md      Project documentation
├── index.html     Semantic markup, controls and metadata
├── style.css      Visual styling and animations
├── script.js      Playlist, audio controller and playback-state logic
└── audio/
    ├── part-1.mp3
    ├── part-2.mp3
    └── part-3.mp3
```

The repository currently contains three MP3 files totaling approximately **41.2 MB** (decimal). Large media files can increase clone size and page-loading costs.

## Run locally

No npm packages or build tools are required. Start a simple local server:

```bash
git clone https://github.com/cianium/The-Lost-Song.git
cd The-Lost-Song
python3 -m http.server 8080
```

Open **http://localhost:8080/** in your browser. Some browsers require a user interaction before audio playback. Track files must be present at the paths listed in `script.js`.

## Storage and privacy

The player saves the selected track index and listening position in the browser under the `the-lost-song-player` `localStorage` key. This is local device/browser state, not a personal profile or cloud backup. Clearing site data resets the saved position.

No user registration or backend analytics implementation was found in the reviewed repository files. External fonts are loaded from Google Fonts.

## Quality checklist

Before treating the demo as a tested release:

1. Verify all three tracks, controls and resume behavior in current browsers.
2. Test keyboard access, focus visibility, reduced motion and screen-reader labels.
3. Test missing audio files, interrupted network requests and unsupported audio formats.
4. Optimize media delivery, browser caching and mobile loading.
5. Add automated static checks and basic playback/browser tests.

## Copyright and redistribution

**The bundled MP3s are attributed in the source to the band Anathema, and the webpage includes excerpts of song lyrics.** This project does not claim ownership of those works. Rights to redistribute the sound recordings, lyrics or any other third-party assets **have not been verified**. A public GitHub repository and GitHub Pages site do **not** themselves grant redistribution permission.

Before promoting, packaging or redistributing this project, confirm the necessary rights or remove/replace material that cannot legally be hosted. Do not include third-party recordings in a GitHub Release archive without permission.

No standalone license for the original project code is included in this repository. Contact the maintainer before reusing or distributing the code.

## Releases

**There are currently no GitHub Releases and no version tags.** The successful GitHub Pages deployment workflow is a website publication event, not a versioned software release.

A future `v1.0.0` should only be created after the rights and attribution review, local/browser verification and a reproducible, documented source snapshot. Do not label the current repository production-ready or publish a bundled audio archive until those checks are complete.

---

<div align="center">

**The Lost Song — a front-end study in atmosphere, motion and interaction.**

</div>
