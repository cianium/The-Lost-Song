# The Lost Song — Atmospheric Music Player

**Status: static front-end/music experience, not a commercial streaming platform.**

[Live demo](https://cianium.github.io/The-Lost-Song/) · [Source](https://github.com/cianium/The-Lost-Song)

A minimalist, animated listening interface inspired by *The Lost Song*, with three track entries, playlist controls, responsive visual presentation and browser-side state.

## Stack and structure

```text
index.html      Player page and markup
style.css       UI styles and animations
script.js       Player controller and track metadata
audio/          Local track files
```

Built using HTML, CSS and vanilla JavaScript. No user-account system, backend or subscription billing is included.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. Browser media policies can prevent automatic playback until the user interacts with the page.

## Quality checklist

- Check player behavior on mobile, desktop and keyboard-only input
- Handle missing tracks and failed media loads gracefully
- Measure large audio assets and avoid unnecessary network transfer
- Add accessible track labels, reduced-motion behavior and browser tests
- Review privacy and consent before adding any analytics

## Copyright notice

The local audio directory includes recordings associated with **Anathema**. This repository is a UI experiment and **does not claim ownership of the recordings**. Confirm the right to host and redistribute these files; use licensed/owned audio or remove them if permissions are absent. The code has no separately declared reuse license.
