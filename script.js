class RadioApp {
    constructor() {
        this.audio = new Audio();
        this.currentStation = null;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.allSongs = getAllSongs();
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.stationsContainer = document.getElementById('stations-container');
        this.nowPlayingSection = document.querySelector('.now-playing');
        this.noStationMessage = document.querySelector('.no-station-message');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentStationEl = document.getElementById('current-station');
        this.songTitleEl = document.getElementById('song-title');
        this.artistEl = document.getElementById('artist');
        this.coverArtEl = document.getElementById('cover-art');
        this.visualizer = document.querySelector('.visualizer');
        
        this.generateStationButtons();
    }

    generateStationButtons() {
        // Clear existing buttons
        this.stationsContainer.innerHTML = '';
        
        // Generate buttons from config
        Object.entries(STATIONS).forEach(([stationId, station]) => {
            const button = document.createElement('button');
            button.className = 'station-btn';
            button.dataset.station = stationId;
            button.title = station.name; // Tooltip with station name
            
            // Create image element
            const img = document.createElement('img');
            img.src = `./station_art/${station.name}.png`;
            img.alt = station.name;
            img.className = 'station-logo';
            
            // Handle missing images
            img.onerror = () => {
                // Fallback to text if image fails to load
                button.innerHTML = `<span class="station-name">${station.name}</span>`;
            };
            
            button.appendChild(img);
            this.stationsContainer.appendChild(button);
        });
        
        // Update stationButtons reference
        this.stationButtons = document.querySelectorAll('.station-btn');
    }

    setupEventListeners() {
        // Station selection - use event delegation since buttons are dynamically generated
        this.stationsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.station-btn')) {
                const stationId = e.target.closest('.station-btn').dataset.station;
                this.selectStation(stationId);
            }
        });

        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Next song button
        this.nextBtn.addEventListener('click', () => {
            this.nextSong();
        });

        // Audio events
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });

        this.audio.addEventListener('loadstart', () => {
            this.updatePlayPauseButton(false);
        });

        this.audio.addEventListener('canplay', () => {
            this.updatePlayPauseButton(this.isPlaying);
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseButton(true);
            this.startVisualizer();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton(false);
            this.stopVisualizer();
        });
    }

    selectStation(stationId) {
        // Update active station button
        this.stationButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        const activeButton = document.querySelector(`[data-station="${stationId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        this.currentStation = stationId;
        
        // Show now playing section and hide no station message
        this.nowPlayingSection.style.display = 'block';
        this.noStationMessage.style.display = 'none';
        
        // Select random song from station
        this.selectRandomSong();
        
        // Start playing
        this.playCurrentSong();
    }

    selectRandomSong() {
        if (this.currentStation === 'shuffle') {
            // For shuffle, pick from all songs
            const randomIndex = Math.floor(Math.random() * this.allSongs.length);
            this.currentSong = this.allSongs[randomIndex];
        } else {
            // For regular stations, pick from station's songs
            const station = STATIONS[this.currentStation];
            const randomIndex = Math.floor(Math.random() * station.songs.length);
            this.currentSong = station.songs[randomIndex];
            this.currentSongIndex = randomIndex;
        }
    }

    playCurrentSong(useStartTime = true) {
        if (!this.currentSong) return;

        const audioPath = `./audio/${this.currentSong.filename}`;
        this.audio.src = audioPath;
        
        // Set up seeking to start time after metadata loads (only when switching stations)
        this.audio.addEventListener('loadedmetadata', () => {
            if (useStartTime && this.currentSong.startTime > 0) {
                this.audio.currentTime = this.currentSong.startTime;
            }
        }, { once: true });

        this.audio.load();
        this.audio.play().catch(e => {
            console.error('Error playing audio:', e);
        });

        this.updateNowPlaying();
    }

    nextSong() {
        if (this.currentStation === 'shuffle') {
            // For shuffle, pick another random song
            this.selectRandomSong();
        } else {
            // For regular stations, go to next song in sequence
            const station = STATIONS[this.currentStation];
            this.currentSongIndex = (this.currentSongIndex + 1) % station.songs.length;
            this.currentSong = station.songs[this.currentSongIndex];
        }
        
        // When moving to next song, don't use startTime - play from beginning
        this.playCurrentSong(false);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            if (this.audio.src) {
                this.audio.play().catch(e => {
                    console.error('Error playing audio:', e);
                });
            }
        }
    }

    updateNowPlaying() {
        if (!this.currentSong) return;

        const station = STATIONS[this.currentStation];
        this.currentStationEl.textContent = station.name;
        this.songTitleEl.textContent = this.currentSong.title;
        this.artistEl.textContent = this.currentSong.artist;

        // Update cover art
        const coverArtPath = `./cover_art/${this.currentSong.filename.replace('.mp3', '.jpg')}`;
        this.coverArtEl.src = coverArtPath;
        this.coverArtEl.alt = `${this.currentSong.title} - ${this.currentSong.artist}`;
        
        // Handle missing cover art
        this.coverArtEl.onerror = () => {
            this.coverArtEl.style.display = 'none';
        };
        this.coverArtEl.onload = () => {
            this.coverArtEl.style.display = 'block';
        };
    }

    updatePlayPauseButton(playing) {
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        if (playing) {
            playIcon.textContent = '⏸';
        } else {
            playIcon.textContent = '▶';
        }
    }

    startVisualizer() {
        this.visualizer.classList.remove('paused');
    }

    stopVisualizer() {
        this.visualizer.classList.add('paused');
    }

    updateUI() {
        // Hide now playing section and show no station message initially
        this.nowPlayingSection.style.display = 'none';
        this.noStationMessage.style.display = 'block';
        
        // Initial state
        this.currentStationEl.textContent = 'No station selected';
        this.songTitleEl.textContent = 'No song playing';
        this.artistEl.textContent = 'No artist';
        this.coverArtEl.style.display = 'none';
        this.updatePlayPauseButton(false);
        this.stopVisualizer();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RadioApp();
});
