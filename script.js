class AudioVisualizer {
    constructor(canvasId, audioElementId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.audioElement = document.getElementById(audioElementId);
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.connectedAudioElement = null;
        this.dataArray = null;
        this.animationId = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Create AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create data array for frequency data
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing audio visualizer:', error);
        }
    }
    
    connectAudio(audioElement) {
        if (!this.isInitialized) return;
        
        try {
            // Only create a new source if we don't have one or if it's a different audio element
            if (!this.source || this.connectedAudioElement !== audioElement) {
                // Disconnect existing source if any
                if (this.source) {
                    this.source.disconnect();
                }
                
                // Create new source from audio element
                this.source = this.audioContext.createMediaElementSource(audioElement);
                this.connectedAudioElement = audioElement;
                
                // Connect: source -> analyser -> destination
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.error('Error connecting audio:', error);
        }
    }
    
    start() {
        if (!this.isInitialized || this.animationId) return;
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.draw();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    draw() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.draw());
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use only 80% of the frequency data (remove rightmost 20%)
        const dataLength = Math.floor(this.dataArray.length * 0.8);
        
        // Calculate bar dimensions
        const barWidth = this.canvas.width / dataLength;
        const maxHeight = this.canvas.height;
        
        // Draw frequency bars
        for (let i = 0; i < dataLength; i++) {
            const barHeight = (this.dataArray[i] / 255) * maxHeight;
            const x = i * barWidth;
            const y = this.canvas.height - barHeight;
            
            // Create gradient for each bar
            const gradient = this.ctx.createLinearGradient(0, y, 0, this.canvas.height);
            gradient.addColorStop(0, '#4a90e2');
            gradient.addColorStop(1, '#5ba0f2');
            
            // Draw bar
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
    }
}

class RadioApp {
    constructor() {
        this.audio = new Audio();
        this.currentStation = null;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.allSongs = getAllSongs();
        this.isTransitioning = false;
        this.radioPauseDuration = 1500; // 1.5 seconds pause between songs
        this.randomizedPlaylist = []; // Randomized order of songs for current station
        this.isPlayingAnnouncement = false;
        this.isMobile = window.innerWidth <= 768;
        this.audioVisualizer = null; // Will be initialized after DOM is ready
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateUI();
    }
    
    initializeVisualizer() {
        // Initialize audio visualizer after DOM is ready
        this.audioVisualizer = new AudioVisualizer('visualizer-canvas', 'audio-source');
    }

    scrollToPlayerOnMobile() {
        // Check if device is mobile (screen width <= 768px)
        if (window.innerWidth <= 768) {
            // Small delay to ensure the now-playing section is visible
            setTimeout(() => {
                this.nowPlayingSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    initializeElements() {
        this.stationsContainer = document.getElementById('stations-container');
        this.nowPlayingSection = document.querySelector('.now-playing');
        this.noStationMessage = document.querySelector('.no-station-message');
        this.nowPlayingTitle = document.getElementById('now-playing-title');
        this.nowPlayingTagline = document.getElementById('now-playing-tagline');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.nextBtn = document.getElementById('next-btn');
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
            if (!this.isTransitioning) {
                this.nextSong();
            }
        });

        // Audio events
        this.audio.addEventListener('ended', () => {
            this.handleSongEnd();
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

        // Handle window resize for mobile detection
        window.addEventListener('resize', () => {
            // Re-check mobile status on resize
            this.isMobile = window.innerWidth <= 768;
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
        
        // Create randomized playlist for this station
        this.createRandomizedPlaylist();
        
        // Set current song to first in randomized playlist
        this.currentSong = this.randomizedPlaylist[this.currentSongIndex];
        
        // Scroll to player on mobile devices
        this.scrollToPlayerOnMobile();
        
        // Start playing
        this.playCurrentSong();
    }

    createRandomizedPlaylist() {
        if (this.currentStation === 'shuffle') {
            // For shuffle, use all songs in random order
            this.randomizedPlaylist = [...this.allSongs].sort(() => Math.random() - 0.5);
            
            // Insert Radio Shuffle announcement as second song
            const announcement = {
                filename: 'Radio Shuffle.mp3',
                title: 'Radio Shuffle Station ID',
                artist: 'Station Announcement',
                startTime: 0,
                isAnnouncement: true
            };
            
            // Insert announcement at position 1 (second song)
            this.randomizedPlaylist.splice(1, 0, announcement);
        } else {
            // For regular stations, randomize the station's songs
            const station = STATIONS[this.currentStation];
            this.randomizedPlaylist = [...station.songs].sort(() => Math.random() - 0.5);
            
            // Insert station announcement as second song
            const stationName = station.name;
            const announcement = {
                filename: `${stationName}.mp3`,
                title: `${stationName} Station ID`,
                artist: 'Station Announcement',
                startTime: 0,
                isAnnouncement: true
            };
            
            // Insert announcement at position 1 (second song)
            this.randomizedPlaylist.splice(1, 0, announcement);
        }
        
        this.currentSongIndex = 0;
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

        // Determine audio path based on whether it's an announcement
        let audioPath;
        if (this.currentSong.isAnnouncement) {
            audioPath = `./announcements/${this.currentSong.filename}`;
            this.isPlayingAnnouncement = true;
        } else {
            audioPath = `./audio/${this.currentSong.filename}`;
            this.isPlayingAnnouncement = false;
        }
        
        this.audio.src = audioPath;
        
        // Connect audio to visualizer
        if (this.audioVisualizer) {
            this.audioVisualizer.connectAudio(this.audio);
        }
        
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

    handleSongEnd() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.isPlaying = false;
        this.updatePlayPauseButton(false);
        this.stopVisualizer();
        
        // Wait for the pause duration before playing next song
        setTimeout(() => {
            this.nextSong();
            this.isTransitioning = false;
        }, this.radioPauseDuration);
    }

    nextSong() {
        // For all stations, go to next song in randomized playlist
        this.currentSongIndex = (this.currentSongIndex + 1) % this.randomizedPlaylist.length;
        this.currentSong = this.randomizedPlaylist[this.currentSongIndex];
        
        // If we've completed the playlist, create a new randomized one
        if (this.currentSongIndex === 0) {
            this.createRandomizedPlaylist();
        }
        
        // When moving to next song, don't use startTime - play from beginning
        this.playCurrentSong(false);
    }

    togglePlayPause() {
        if (this.isTransitioning) return; // Don't allow play/pause during transitions
        
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
        this.nowPlayingTitle.textContent = `Now Listening to ${station.name}`;
        this.nowPlayingTagline.textContent = station.tagline;
        this.songTitleEl.textContent = this.currentSong.title;
        this.artistEl.textContent = this.currentSong.artist;

        // Update cover art (hide for announcements)
        if (this.currentSong.isAnnouncement) {
            this.coverArtEl.style.display = 'none';
        } else {
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
        if (this.audioVisualizer) {
            this.audioVisualizer.start();
        }
    }

    stopVisualizer() {
        if (this.audioVisualizer) {
            this.audioVisualizer.stop();
        }
    }

    updateUI() {
        // Hide now playing section and show no station message initially
        this.nowPlayingSection.style.display = 'none';
        this.noStationMessage.style.display = 'block';
        
        // Initial state
        this.nowPlayingTitle.textContent = 'Now Listening to';
        this.nowPlayingTagline.textContent = '';
        this.songTitleEl.textContent = 'No song playing';
        this.artistEl.textContent = 'No artist';
        this.coverArtEl.style.display = 'none';
        this.updatePlayPauseButton(false);
        this.stopVisualizer();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RadioApp();
    app.initializeVisualizer();
});
