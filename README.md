
# AI Radio App

This is a simple radio app, which shows a list of radio stations and plays the music from them. Stations have logos, songs and announcements. Songs are stored as mp3 files in the `music` directory and have cover art in the `covert_art` directory. config.js contains the list of stations and the music files for each station. script.js is the main script that controls the radio app.

## Development Guidelines

### Simplicity First
- This is a small project that will never expand into a large or complex mission-critical system, so Favor simple solutions over complex ones
- Don't over-engineer, don't do premature optimization. Solve the actual problem, not hypothetical future problems
- Don't prepare for very long `config.js` files - it will stay manageable

### Code Organization
- All app state is consolidated in a single `this.state` object in the `RadioApp` class
- Keep the architecture simple and understandable for AI programming tools
- Use clear comments to explain "why" not "what" - make the code self-documenting where possible

### Constraints & Assumptions
- You can assume all audio and image files exist - there's another mechanism that ensures this
- Keep version numbers in cache-busting query strings (e.g., `?v=2.1`) - these are required
- Keep `console.log` statements in production code - they're intentional for debugging

### Browser Compatibility and Error Handling
- Mobile support is important
- Graceful degradation: If a feature isn't supported or something goes wrong, selecting a station and playing music should still work
- Log errors with context: Include relevant information (which song, which station) in error logs

## Architecture Overview

- **`index.html`**: Main HTML structure with semantic elements
- **`script.js`**: Contains `AudioVisualizer` class and `RadioApp` class with all app logic
- **`config.js`**: Station definitions and song lists - simple data structure
- **`style.css`**: All styling in one file
- **State object**: All app state lives in `RadioApp.state` - this makes it easy to see what the app knows at any time

## Setup

### First time setup

```bash
# Create virtual environment
python3.10 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Daily Usage

### Start working
```bash
source venv/bin/activate
```

### View the app

```bash
python -m http.server 8080
```

Open http://localhost:8000 in your browser.

### Stop the app

```bash
Ctrl+C
source venv/bin/deactivate
```

### Stop if process is stuck

```bash
lsof -ti :8080 | xargs kill -9
```

# Ideas

## Refactoring:

High priority

Extract magic numbers to a named constants section
Move 1500 (pause duration), 256 (fftSize), 0.8 (data length multiplier) to a CONSTANTS object at the top of the file

Medium priority

Add debouncing/throttling to prevent rapid button clicks
Prevent multiple rapid clicks on play/pause or next during transitions
Use a simple flag or small delay to ignore clicks during isTransitioning
Prevents race conditions and audio glitches

Add error boundaries around critical audio operations
Wrap audio.play(), audio.load(), and visualizer connection in try-catch
Log errors with context (which song, which station)
Prevents one failed song from breaking the entire app

Document the audio element connection pattern
Add a comment explaining why connectAudio checks for existing connections
Clarify the Web Audio API connection chain (source → analyser → destination)
Helps AI tools understand the audio pipeline

## Other:

Station history: Show recently played songs

Commercial, weather (real?), news updates, traffic updates
