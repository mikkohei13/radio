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
    
    async connectAudio(audioElement) {
        if (!this.isInitialized) return;
        
        try {
            // Resume AudioContext if suspended (required for iOS Safari)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
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
    
    async start() {
        if (!this.isInitialized || this.animationId) return;
        
        // Resume audio context if suspended (required for iOS Safari)
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.error('Error resuming audio context:', error);
            }
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
        // iOS Safari requires playsinline for audio playback
        this.audio.setAttribute('playsinline', '');
        this.audio.setAttribute('webkit-playsinline', '');
        // Ensure volume is set (iOS Safari sometimes requires this)
        this.audio.volume = 1.0;
        this.allSongs = getAllSongs();
        this.radioPauseDuration = 1500; // 1.5 seconds pause between songs
        this.audioVisualizer = null; // Will be initialized after DOM is ready
        
        // Consolidated state object
        this.state = {
            currentStation: null,
            currentSong: null,
            currentSongIndex: 0,
            isPlaying: false,
            isTransitioning: false,
            randomizedPlaylist: [],
            isPlayingAnnouncement: false,
            isMobile: window.innerWidth <= 768,
            autoplayBlocked: false
        };
        
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
        if (this.state.isMobile) {
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
        this.autoplayMessage = document.getElementById('autoplay-message');
        
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
            if (!this.state.isTransitioning) {
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
            this.updatePlayPauseButton(this.state.isPlaying);
        });

        this.audio.addEventListener('play', async () => {
            this.state.isPlaying = true;
            this.updatePlayPauseButton(true);
            await this.startVisualizer();
            // Hide autoplay message once audio starts playing
            this.hideAutoplayMessage();
        });

        this.audio.addEventListener('pause', () => {
            this.state.isPlaying = false;
            this.updatePlayPauseButton(false);
            this.stopVisualizer();
        });

        // Handle window resize for mobile detection
        window.addEventListener('resize', () => {
            // Re-check mobile status on resize
            this.state.isMobile = window.innerWidth <= 768;
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

        this.state.currentStation = stationId;
        
        // Show now playing section and hide no station message
        this.nowPlayingSection.style.display = 'block';
        this.noStationMessage.style.display = 'none';
        
        // Create randomized playlist for this station
        this.createRandomizedPlaylist();
        
        // Set current song to first in randomized playlist
        this.state.currentSong = this.state.randomizedPlaylist[this.state.currentSongIndex];
        
        // Scroll to player on mobile devices
        this.scrollToPlayerOnMobile();
        
        // Start playing
        this.playCurrentSong();
    }

    createRandomizedPlaylist() {
        if (this.state.currentStation === 'shuffle') {
            // For shuffle, use all songs in random order
            this.state.randomizedPlaylist = [...this.allSongs].sort(() => Math.random() - 0.5);
            
            // Insert Radio Shuffle announcement as second song
            const announcement = {
                filename: 'Radio Shuffle.mp3',
                title: 'Radio Shuffle Station ID',
                artist: 'Station Announcement',
                startTime: 0,
                isAnnouncement: true
            };
            
            // Insert announcement at position 1 (second song)
            this.state.randomizedPlaylist.splice(1, 0, announcement);
        } else {
            // For regular stations, randomize the station's songs
            const station = STATIONS[this.state.currentStation];
            this.state.randomizedPlaylist = [...station.songs].sort(() => Math.random() - 0.5);
            
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
            this.state.randomizedPlaylist.splice(1, 0, announcement);
        }
        
        // Log the randomized playlist order
        const stationName = this.state.currentStation === 'shuffle' ? 'Radio Shuffle' : STATIONS[this.state.currentStation].name;
        console.log(`🎵 ${stationName} - Randomized Playlist:`);
        this.state.randomizedPlaylist.forEach((song, index) => {
            const songInfo = song.isAnnouncement 
                ? `[ANNOUNCEMENT] ${song.title}` 
                : `${song.title} - ${song.artist}`;
            console.log(`  ${index + 1}. ${songInfo}`);
        });
        
        this.state.currentSongIndex = 0;
    }

    selectRandomSong() {
        if (this.state.currentStation === 'shuffle') {
            // For shuffle, pick from all songs
            const randomIndex = Math.floor(Math.random() * this.allSongs.length);
            this.state.currentSong = this.allSongs[randomIndex];
        } else {
            // For regular stations, pick from station's songs
            const station = STATIONS[this.state.currentStation];
            const randomIndex = Math.floor(Math.random() * station.songs.length);
            this.state.currentSong = station.songs[randomIndex];
            this.state.currentSongIndex = randomIndex;
        }
    }

    async playCurrentSong(useStartTime = true) {
        if (!this.state.currentSong) return;

        // Determine audio path based on whether it's an announcement
        let audioPath;
        if (this.state.currentSong.isAnnouncement) {
            audioPath = `./announcements/${this.state.currentSong.filename}`;
            this.state.isPlayingAnnouncement = true;
        } else {
            audioPath = `./audio/${this.state.currentSong.filename}`;
            this.state.isPlayingAnnouncement = false;
        }
        
        this.audio.src = audioPath;
        
        // Connect audio to visualizer (await to ensure AudioContext is resumed)
        if (this.audioVisualizer) {
            await this.audioVisualizer.connectAudio(this.audio);
        }
        
        // Set up seeking to start time after metadata loads (only when switching stations)
        this.audio.addEventListener('loadedmetadata', () => {
            if (useStartTime && this.state.currentSong.startTime > 0) {
                this.audio.currentTime = this.state.currentSong.startTime;
            }
        }, { once: true });

        this.audio.load();
        this.audio.play().catch(e => {
            // Check if error is due to autoplay blocking
            if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                this.handleAutoplayBlocked();
            } else {
                console.error('Error playing audio:', e);
            }
        });

        this.updateNowPlaying();
    }

    handleSongEnd() {
        if (this.state.isTransitioning) return;
        
        this.state.isTransitioning = true;
        this.state.isPlaying = false;
        this.updatePlayPauseButton(false);
        this.stopVisualizer();
        
        // Wait for the pause duration before playing next song
        setTimeout(() => {
            this.nextSong();
            this.state.isTransitioning = false;
        }, this.radioPauseDuration);
    }

    nextSong() {
        // For all stations, go to next song in randomized playlist
        this.state.currentSongIndex = (this.state.currentSongIndex + 1) % this.state.randomizedPlaylist.length;
        this.state.currentSong = this.state.randomizedPlaylist[this.state.currentSongIndex];
        
        // If we've completed the playlist, create a new randomized one
        if (this.state.currentSongIndex === 0) {
            this.createRandomizedPlaylist();
        }
        
        // When moving to next song, don't use startTime - play from beginning
        this.playCurrentSong(false);
    }

    async togglePlayPause() {
        if (this.state.isTransitioning) return; // Don't allow play/pause during transitions
        
        if (this.state.isPlaying) {
            this.audio.pause();
        } else {
            // Resume AudioContext on user interaction (required for iOS Safari)
            if (this.audioVisualizer && this.audioVisualizer.audioContext) {
                if (this.audioVisualizer.audioContext.state === 'suspended') {
                    try {
                        await this.audioVisualizer.audioContext.resume();
                    } catch (error) {
                        console.error('Error resuming audio context:', error);
                    }
                }
            }
            
            if (this.audio.src) {
                this.audio.play().catch(e => {
                    // Check if error is due to autoplay blocking
                    if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                        this.handleAutoplayBlocked();
                    } else {
                        console.error('Error playing audio:', e);
                    }
                });
            }
        }
    }

    updateNowPlaying() {
        if (!this.state.currentSong) return;

        const station = STATIONS[this.state.currentStation];
        this.nowPlayingTitle.textContent = `Now Listening to ${station.name}`;
        this.nowPlayingTagline.textContent = station.tagline;
        this.songTitleEl.textContent = this.state.currentSong.title;
        this.artistEl.textContent = this.state.currentSong.artist;

        // Update cover art (hide for announcements)
        if (this.state.currentSong.isAnnouncement) {
            this.coverArtEl.style.display = 'none';
        } else {
            const coverArtPath = `./cover_art/${this.state.currentSong.filename.replace('.mp3', '.jpg')}`;
            this.coverArtEl.src = coverArtPath;
            this.coverArtEl.alt = `${this.state.currentSong.title} - ${this.state.currentSong.artist}`;
            
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

    async startVisualizer() {
        if (this.audioVisualizer) {
            await this.audioVisualizer.start();
        }
    }

    stopVisualizer() {
        if (this.audioVisualizer) {
            this.audioVisualizer.stop();
        }
    }

    handleAutoplayBlocked() {
        this.state.autoplayBlocked = true;
        this.showAutoplayMessage();
    }

    showAutoplayMessage() {
        if (this.autoplayMessage) {
            this.autoplayMessage.style.display = 'block';
        }
    }

    hideAutoplayMessage() {
        if (this.autoplayMessage && this.state.autoplayBlocked) {
            this.autoplayMessage.style.display = 'none';
            this.state.autoplayBlocked = false;
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
        this.hideAutoplayMessage();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RadioApp();
    app.initializeVisualizer();
    
    // Check for station parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stationParam = urlParams.get('station');
    if (stationParam && STATIONS[stationParam]) {
        // Small delay to ensure everything is initialized
        setTimeout(() => {
            app.selectStation(stationParam);
        }, 100);
    }
});
