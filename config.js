const STATIONS = {
  metalNation: {
    name: "Metal Nation",
    songs: [
      { 
        filename: "Forge of Species Data.mp3", 
        title: "Forge of Species Data", 
        artist: "Guardians of Knowledge", 
        startTime: 157 
      },
      { 
        filename: "Echoes of the Wild.mp3", 
        title: "Echoes of the Wild", 
        artist: "Together Bound", 
        startTime: 87
      },
      { 
        filename: "Shadowrun.mp3", 
        title: "Shadowrun", 
        artist: "Shadowrun", 
        startTime: 215 
      },
      { 
        filename: "180 Seconds to Vibe.mp3", 
        title: "180 Seconds to Vibe", 
        artist: "Machina Pulse", 
        startTime: 10 
      },
    ]
  },
  shadowrun: {
    name: "Shadowrun",
    songs: [
      { 
        filename: "Shadowrun.mp3", 
        title: "Shadowrun", 
        artist: "Shadowrun", 
        startTime: 62 
      },
      { 
        filename: "Signal.mp3", 
        title: "Signal", 
        artist: "Shadowrun", 
        startTime: 50 
      },
      { 
        filename: "Ghost of Me.mp3", 
        title: "Ghost of Me", 
        artist: "Shadowrun", 
        startTime: 90 
      },
      { 
        filename: "Incomprehensible.mp3", 
        title: "Incomprehensible", 
        artist: "Shadowrun", 
        startTime: 80 
      },
    ]
  },
  sointulaFM: {
    name: "Sointula FM",
    songs: [
      { 
        filename: "Cranes at Sunset.mp3", 
        title: "Cranes at Sunset", 
        artist: "Jonah Gray", 
        startTime: 12 
      },
      { 
        filename: "Valkoinen Z.mp3", 
        title: "Valkoinen Z", 
        artist: "Veikko Vauhti", 
        startTime: 101 
      },
      { 
        filename: "Silence Turns to Song.mp3", 
        title: "Silence Turns to Song", 
        artist: "Cody Hayes", 
        startTime: 41 
      },
      { 
        filename: "Tram of Del Mar.mp3", 
        title: "Tram of Del Mar", 
        artist: "Alessandro di Luna", 
        startTime: 53 
      },
      { 
        filename: "Luteiden kaiho.mp3", 
        title: "Luteiden kaiho", 
        artist: "Tapio Tienpää ja Pellon Pojat", 
        startTime: 120 
      },
    ]
  },
  stereoCircus: {
    name: "Stereo Circus Radio",
    songs: [
      { 
        filename: "Missä on mun luteet nyt.mp3", 
        title: "Missä on mun luteet nyt?", 
        artist: "Vinyylivika", 
        startTime: 44 
      },
      { 
        filename: "Hearts on Fire.mp3", 
        title: "Hearts on Fire", 
        artist: "Crystal Beat", 
        startTime: 136
      },
      { 
        filename: "Toaster Manual.mp3", 
        title: "Toaster Manual", 
        artist: "Mister Blazer’s Emotional Support Band", 
        startTime: 147
      },
      { 
        filename: "Midnight Drive.mp3", 
        title: "Midnight Drive", 
        artist: "Aurora Drive", 
        startTime: 50 
      },
      { 
        filename: "Päättymätön hehku.mp3", 
        title: "Päättymätön hehku", 
        artist: "Taajuus", 
        startTime: 118 
      }
    ]
  },
  shuffle: {
    name: "Radio Shuffle",
    songs: [] // Special handling - picks from all songs randomly
  }
};

// Get all songs for shuffle functionality
function getAllSongs() {
  const allSongs = [];
  Object.values(STATIONS).forEach(station => {
    if (station.songs.length > 0) {
      allSongs.push(...station.songs);
    }
  });
  return allSongs;
}
