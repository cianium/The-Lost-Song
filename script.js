/* =========================================================
   THE LOST SONG — ANATHEMA
   Music Experience Controller
   ========================================================= */

"use strict";


/* ---------------------------------------------------------
   01. Track Data
   --------------------------------------------------------- */

const tracks = [
    {
        id: "part-1",
        number: "01",
        title: "The Lost Song — Part I",
        artist: "Anathema",
        src: "./audio/part-1.mp3"
    },

    {
        id: "part-2",
        number: "02",
        title: "The Lost Song — Part II",
        artist: "Anathema",
        src: "./audio/part-2.mp3"
    },

    {
        id: "part-3",
        number: "03",
        title: "The Lost Song — Part III",
        artist: "Anathema",
        src: "./audio/part-3.mp3"
    }
];


/* ---------------------------------------------------------
   02. Application State
   --------------------------------------------------------- */

const state = {
    currentTrackIndex: 0,
    isPlaying: false,
    isDraggingProgress: false,
    lastSavedTime: 0
};


/* ---------------------------------------------------------
   03. DOM References
   --------------------------------------------------------- */

const audio = document.getElementById("audio-player");

const playButton = document.getElementById("play-button");

const previousButton = document.getElementById("previous-button");

const nextButton = document.getElementById("next-button");

const currentTimeElement = document.getElementById("current-time");

const durationElement = document.getElementById("duration");

const progressTrack = document.getElementById("progress-track");

const progressFill = document.getElementById("progress-fill");

const progressHandle = document.getElementById("progress-handle");

const trackNumberElement = document.getElementById("track-number");

const trackTitleElement = document.getElementById("track-title");

const trackArtistElement = document.getElementById("track-artist");

const trackButtons = document.querySelectorAll(".track-item");


/* ---------------------------------------------------------
   04. Utility Functions
   --------------------------------------------------------- */

/**
 * Convert seconds into MM:SS.
 */
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}


/**
 * Clamp a number between two values.
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


/**
 * Get the current track.
 */
function getCurrentTrack() {
    return tracks[state.currentTrackIndex];
}


/* ---------------------------------------------------------
   05. Track UI
   --------------------------------------------------------- */

function updateTrackInformation() {
    const track = getCurrentTrack();

    trackNumberElement.textContent = track.number;

    trackTitleElement.textContent = track.title;

    trackArtistElement.textContent = track.artist;

    updateActiveTrackButton();
}


function updateActiveTrackButton() {
    trackButtons.forEach((button, index) => {
        const isActive = index === state.currentTrackIndex;

        button.classList.toggle(
            "track-item--active",
            isActive
        );

        button.setAttribute(
            "aria-current",
            isActive ? "true" : "false"
        );
    });
}


/* ---------------------------------------------------------
   06. Audio Loading
   --------------------------------------------------------- */

function loadTrack(index, shouldRestorePosition = false) {
    if (index < 0 || index >= tracks.length) {
        return;
    }

    state.currentTrackIndex = index;

    const track = getCurrentTrack();

    state.isPlaying = false;

    document.body.classList.remove("is-playing");

    document.body.classList.add("is-loading");

    updateTrackInformation();

    resetProgressUI();

    audio.src = track.src;

    audio.load();

    if (shouldRestorePosition) {
        restoreTrackPosition();
    }
}


/* ---------------------------------------------------------
   07. Playback
   --------------------------------------------------------- */

async function playTrack() {
    try {
        await audio.play();

        state.isPlaying = true;

        document.body.classList.add("is-playing");

        updatePlayButton();

        savePlaybackState();

    } catch (error) {
        console.warn(
            "Audio playback could not start:",
            error
        );

        state.isPlaying = false;

        document.body.classList.remove("is-playing");

        updatePlayButton();
    }
}


function pauseTrack() {
    audio.pause();

    state.isPlaying = false;

    document.body.classList.remove("is-playing");

    updatePlayButton();

    savePlaybackState();
}


function togglePlayback() {
    if (audio.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
}


/* ---------------------------------------------------------
   08. Play Button UI
   --------------------------------------------------------- */

function updatePlayButton() {
    const playIcon = playButton.querySelector(
        ".play-button__icon--play"
    );

    const pauseIcon = playButton.querySelector(
        ".play-button__icon--pause"
    );

    if (state.isPlaying) {
        playIcon.style.display = "none";

        pauseIcon.style.display = "block";

        playButton.setAttribute(
            "aria-label",
            "Pause"
        );

        playButton.setAttribute(
            "aria-pressed",
            "true"
        );
    } else {
        playIcon.style.display = "block";

        pauseIcon.style.display = "none";

        playButton.setAttribute(
            "aria-label",
            "Play"
        );

        playButton.setAttribute(
            "aria-pressed",
            "false"
        );
    }
}


/* ---------------------------------------------------------
   09. Progress UI
   --------------------------------------------------------- */

function updateProgressUI() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
    }

    const progress =
        (audio.currentTime / audio.duration) * 100;

    const safeProgress = clamp(
        progress,
        0,
        100
    );

    progressFill.style.width =
        `${safeProgress}%`;

    progressHandle.style.left =
        `${safeProgress}%`;

    currentTimeElement.textContent =
        formatTime(audio.currentTime);

    durationElement.textContent =
        formatTime(audio.duration);

    progressTrack.setAttribute(
        "aria-valuenow",
        safeProgress.toFixed(1)
    );
}


function resetProgressUI() {
    progressFill.style.width = "0%";

    progressHandle.style.left = "0%";

    currentTimeElement.textContent = "00:00";

    durationElement.textContent = "00:00";

    progressTrack.setAttribute(
        "aria-valuenow",
        "0"
    );
}


/* ---------------------------------------------------------
   10. Seeking
   --------------------------------------------------------- */

function getSeekTimeFromPointer(event) {
    const rect =
        progressTrack.getBoundingClientRect();

    const position =
        event.clientX - rect.left;

    const ratio =
        clamp(
            position / rect.width,
            0,
            1
        );

    return ratio * audio.duration;
}


function seekFromPointer(event) {
    if (
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
    ) {
        return;
    }

    const newTime =
        getSeekTimeFromPointer(event);

    audio.currentTime = newTime;

    updateProgressUI();

    savePlaybackState();
}


function startProgressDrag(event) {
    if (
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
    ) {
        return;
    }

    state.isDraggingProgress = true;

    progressTrack.setPointerCapture(
        event.pointerId
    );

    seekFromPointer(event);
}


function moveProgressDrag(event) {
    if (!state.isDraggingProgress) {
        return;
    }

    seekFromPointer(event);
}


function endProgressDrag(event) {
    if (!state.isDraggingProgress) {
        return;
    }

    state.isDraggingProgress = false;

    try {
        progressTrack.releasePointerCapture(
            event.pointerId
        );
    } catch {
        /* Pointer may already have been released. */
    }

    savePlaybackState();
}


/* ---------------------------------------------------------
   11. Keyboard Seeking
   --------------------------------------------------------- */

function handleProgressKeyboard(event) {
    if (
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
    ) {
        return;
    }

    let newTime = audio.currentTime;

    switch (event.key) {
        case "ArrowRight":
            newTime += 5;
            break;

        case "ArrowLeft":
            newTime -= 5;
            break;

        case "Home":
            newTime = 0;
            break;

        case "End":
            newTime = audio.duration;
            break;

        default:
            return;
    }

    event.preventDefault();

    audio.currentTime =
        clamp(
            newTime,
            0,
            audio.duration
        );

    updateProgressUI();

    savePlaybackState();
}


/* ---------------------------------------------------------
   12. Previous / Next
   --------------------------------------------------------- */

function playNextTrack() {
    const nextIndex =
        (state.currentTrackIndex + 1) %
        tracks.length;

    loadTrack(nextIndex);

    playTrack();
}


function playPreviousTrack() {
    /*
     * If the song has already progressed more than
     * three seconds, pressing previous restarts it.
     *
     * Otherwise, go to the previous track.
     */
    if (audio.currentTime > 3) {
        audio.currentTime = 0;

        updateProgressUI();

        savePlaybackState();

        return;
    }

    const previousIndex =
        (
            state.currentTrackIndex -
            1 +
            tracks.length
        ) % tracks.length;

    loadTrack(previousIndex);

    playTrack();
}


/* ---------------------------------------------------------
   13. Track Selection
   --------------------------------------------------------- */

function selectTrack(index) {
    if (
        index < 0 ||
        index >= tracks.length
    ) {
        return;
    }

    const wasPlaying =
        !audio.paused;

    loadTrack(index);

    if (wasPlaying) {
        playTrack();
    }
}


/* ---------------------------------------------------------
   14. Audio Events
   --------------------------------------------------------- */

audio.addEventListener(
    "loadedmetadata",
    () => {
        document.body.classList.remove(
            "is-loading"
        );

        durationElement.textContent =
            formatTime(audio.duration);

        updateProgressUI();
    }
);


audio.addEventListener(
    "timeupdate",
    () => {
        if (!state.isDraggingProgress) {
            updateProgressUI();
        }
    }
);


audio.addEventListener(
    "play",
    () => {
        state.isPlaying = true;

        document.body.classList.add(
            "is-playing"
        );

        updatePlayButton();
    }
);


audio.addEventListener(
    "pause",
    () => {
        state.isPlaying = false;

        document.body.classList.remove(
            "is-playing"
        );

        updatePlayButton();
    }
);


audio.addEventListener(
    "ended",
    () => {
        state.isPlaying = false;

        savePlaybackState();

        /*
         * Automatically continue with
         * the next song.
         */
        playNextTrack();
    }
);


audio.addEventListener(
    "error",
    () => {
        document.body.classList.remove(
            "is-loading"
        );

        console.error(
            `Unable to load track: ${
                getCurrentTrack().src
            }`
        );

        durationElement.textContent =
            "--:--";
    }
);


/* ---------------------------------------------------------
   15. Local Storage
   --------------------------------------------------------- */

const STORAGE_KEY =
    "the-lost-song-player";


function savePlaybackState() {
    if (
        !Number.isFinite(audio.currentTime)
    ) {
        return;
    }

    const playbackState = {
        trackIndex:
            state.currentTrackIndex,

        currentTime:
            audio.currentTime
    };

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(playbackState)
        );
    } catch {
        /*
         * localStorage may be unavailable
         * in privacy-restricted environments.
         */
    }
}


function getSavedPlaybackState() {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            return null;
        }

        const parsed =
            JSON.parse(saved);

        if (
            typeof parsed.trackIndex !== "number" ||
            typeof parsed.currentTime !== "number"
        ) {
            return null;
        }

        return parsed;

    } catch {
        return null;
    }
}


function restoreTrackPosition() {
    const saved =
        getSavedPlaybackState();

    if (!saved) {
        return;
    }

    if (
        saved.trackIndex !==
        state.currentTrackIndex
    ) {
        return;
    }

    const restore =
        () => {
            if (
                Number.isFinite(
                    audio.duration
                ) &&
                saved.currentTime <
                    audio.duration
            ) {
                audio.currentTime =
                    saved.currentTime;

                updateProgressUI();
            }
        };

    if (
        audio.readyState >= 1
    ) {
        restore();
    } else {
        audio.addEventListener(
            "loadedmetadata",
            restore,
            { once: true }
        );
    }
}


/* ---------------------------------------------------------
   16. Track List Events
   --------------------------------------------------------- */

trackButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                const index =
                    Number(
                        button.dataset.track
                    );

                selectTrack(index);
            }
        );
    }
);


/* ---------------------------------------------------------
   17. Player Events
   --------------------------------------------------------- */

playButton.addEventListener(
    "click",
    togglePlayback
);


previousButton.addEventListener(
    "click",
    playPreviousTrack
);


nextButton.addEventListener(
    "click",
    playNextTrack
);


/* ---------------------------------------------------------
   18. Progress Events
   --------------------------------------------------------- */

progressTrack.addEventListener(
    "pointerdown",
    startProgressDrag
);


progressTrack.addEventListener(
    "pointermove",
    moveProgressDrag
);


progressTrack.addEventListener(
    "pointerup",
    endProgressDrag
);


progressTrack.addEventListener(
    "pointercancel",
    endProgressDrag
);


progressTrack.addEventListener(
    "keydown",
    handleProgressKeyboard
);


/* ---------------------------------------------------------
   19. Save Before Leaving
   --------------------------------------------------------- */

window.addEventListener(
    "beforeunload",
    savePlaybackState
);


/* ---------------------------------------------------------
   20. Initialisation
   --------------------------------------------------------- */

function initializePlayer() {
    const saved =
        getSavedPlaybackState();

    let initialTrack = 0;

    if (
        saved &&
        saved.trackIndex >= 0 &&
        saved.trackIndex < tracks.length
    ) {
        initialTrack =
            saved.trackIndex;
    }

    loadTrack(
        initialTrack,
        Boolean(saved)
    );

    updatePlayButton();

    updateTrackInformation();
}


/* ---------------------------------------------------------
   Start Application
   --------------------------------------------------------- */

initializePlayer();