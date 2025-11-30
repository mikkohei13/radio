
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

Cursor:
Here are my suggestions to make the app feel more like a real radio experience:
Radio-Like Features to Add:
1. Transitions & Timing
Pause between songs: 1-2 second gap when transitioning (as you mentioned)
Fade effects: Gentle fade-out at end of song, fade-in for new song
Crossfade option: Overlap the end of one song with the start of the next
Random timing variation: Slight variation in pause duration (1.2-2.1 seconds) to feel more natural
2. Radio Station Behavior
Station identification: Brief station name announcement between songs
Station jingles: Short audio clips that play occasionally between songs
Time-based programming: Different songs at different times of day
Weather/time announcements: Simulated radio station features
3. Audio Enhancements
Audio normalization: Ensure consistent volume levels across songs
EQ presets: Different audio profiles per station (bass-heavy for some, clear for others)
Audio compression: Make it sound more "radio-like" with slight compression
Static/ambient noise: Very subtle background radio static
4. Visual Radio Elements
Station logo display: Show station logo in the now-playing area
Frequency display: Show fake radio frequencies (e.g., "FM 98.7")
Signal strength indicator: Visual bars showing "signal quality"
Station branding: Different color schemes per station
5. Interactive Radio Features
Request system: Simulated "call-in" requests (randomly suggest songs)
Radio host commentary: Text-based "DJ" comments between songs
Station history: Show recently played songs
Live listener count: Fake "listeners online" counter
6. Realistic Radio Timing
Commercial breaks: Occasional breaks with station identification
News updates: Simulated news segments (text-based)
Traffic reports: Fake traffic updates
Song dedications: Random "dedicated to" messages
7. Station Personality
Station-specific transitions: Different pause lengths and effects per station
Genre-appropriate behavior: Classical stations have longer pauses, rock stations are more energetic
Station slogans: Display station taglines occasionally