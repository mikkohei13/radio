const STATIONS = {
  metalNation: {
    name: "Metal Nation",
    tagline: "Louder than your neighbors can handle. Heavy metal & hard rock.",
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
        filename: "180 Seconds to Vibe.mp3", 
        title: "180 Seconds to Vibe", 
        artist: "Machina Pulse", 
        startTime: 10 
      },
    ]
  },
  shadowrun: {
    name: "Shadowrun",
    tagline: "Broadcasting on frequencies they can't find. If you're listening, you are already free.",
    songs: [
      { 
        filename: "Shadowrun.mp3", 
        title: "Shadowrun (pt. 1)", 
        artist: "Shadowrun", 
        startTime: 62 
      },
      { 
        filename: "Signal.mp3", 
        title: "Signal (Shadowrun pt. 2)", 
        artist: "Shadowrun", 
        startTime: 50 
      },
      { 
        filename: "Ghost of Me.mp3", 
        title: "Ghost of Me (Shadowrun pt. 3)", 
        artist: "Shadowrun", 
        startTime: 90 
      },
      { 
        filename: "Incomprehensible.mp3", 
        title: "Incomprehensible (Shadowrun pt. 4)", 
        artist: "Shadowrun", 
        startTime: 80 
      },
    ]
  },
  sointulaFM: {
    name: "Sointula FM",
    tagline: "Musiikkia, joka ei vanhene koskaan. Folk, country & iskelmä.",
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
    tagline: "Where the unexpected steals the show! Songs without a dedicated station.",
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
        artist: "Neon Pines", 
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
  stormrost: {
    name: "Stormröst",
    tagline: "Före åskan fanns sången. Mythic Folk Metal.",
    songs: [
      { 
        filename: "Runer i Ravnens Skygge.mp3", 
        title: "Runer i Ravnens Skygge", 
        artist: "Jorddøn (Danmark)", 
        startTime: 60 
      },
      { 
        filename: "Å.mp3", 
        title: "Å", 
        artist: "Skoddemann (Norge)", 
        startTime: 60
      },
      { 
        filename: "Hirven varjo.mp3", 
        title: "Hirven varjo", 
        artist: "Kajo & Kuu (Suomi)", 
        startTime: 60
      },
      { 
        filename: "Skutans Hjarta.mp3", 
        title: "Skutans Hjarta", 
        artist: "Gråskymt (Sverige)", 
        startTime: 60 
      },
      { 
        filename: "Reiði undir Jökli.mp3", 
        title: "Reiði undir Jökli", 
        artist: "Rauðkembur (Ísland)", 
        startTime: 60 
      },
      { 
        filename: "Sgàil nam Beanntan.mp3", 
        title: "Sgàil nam Beanntan", 
        artist: "Aonaran nan Stiùbhart (Alba)", 
        startTime: 60 
      },
      { 
        filename: "Í Havsins Myrkri.mp3", 
        title: "Í Havsins Myrkri", 
        artist: "Brandur Havsson (Føroyar)", 
        startTime: 60 
      }
    ]
  },
  shuffle: {
    name: "Radio Shuffle",
    tagline: "Add some randomness to your life! Every song shuffled.",
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
