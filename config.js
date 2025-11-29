const STATIONS = {
  wavelength: {
    name: "The Wavelength",
    tagline: "Music that moves with you.",
    songs: [
      { 
        filename: "City Lights.mp3", 
        title: "City Lights", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Vi Maaler Ljòss.mp3", 
        title: "Vi Maaler Ljòss", 
        artist: "Jòna Graasen", 
        startTime: 60 
      },
      { 
        filename: "Silence Turns to Song.mp3", 
        title: "Silence Turns to Song", 
        artist: "Cody Hayes", 
        startTime: 41 
      },
      { 
        filename: "Cranes at Sunset.mp3", 
        title: "Cranes at Sunset", 
        artist: "Jonah Gray", 
        startTime: 12 
      },
      { 
        filename: "Between the Edge and the Light.mp3", 
        title: "Between the Edge and the Light", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Choose You.mp3", 
        title: "Choose You", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "City Lights, 30 Floors Up.mp3", 
        title: "City Lights, 30 Floors Up", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Don't Let Go.mp3", 
        title: "Don't Let Go", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Everything in You.mp3", 
        title: "Everything in You", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Falling Without Sound.mp3", 
        title: "Falling Without Sound", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Halfway to the Sun.mp3", 
        title: "Halfway to the Sun", 
        artist: "Yes And feat. Country & Town", 
        startTime: 60 
      },
      { 
        filename: "Paint It Bright.mp3", 
        title: "Paint It Bright", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Quiet Like Us.mp3", 
        title: "Quiet Like Us", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Second Place.mp3", 
        title: "Second Place", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Strings in My Hands.mp3", 
        title: "Strings in My Hands", 
        artist: "Jonah Gray", 
        startTime: 60 
      },
      { 
        filename: "The Clearing.mp3", 
        title: "The Clearing", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "The Wall at the Edge.mp3", 
        title: "The Wall at the Edge", 
        artist: "Yes And", 
        startTime: 60 
      },
      { 
        filename: "Yes And.mp3", 
        title: "Yes And", 
        artist: "Yes And", 
        startTime: 60 
      }
    ]
  },
  shadowrun: {
    name: "Shadowrun",
    tagline: "Broadcasting on frequencies they can't find. If you're listening, you are already free.",
    songs: [
      { 
        filename: "Shadowrun.mp3", 
        title: "Shadowrun (pt. 1)", 
        artist: "Ghost in Neon", 
        startTime: 62 
      },
      { 
        filename: "Signal.mp3", 
        title: "Signal (Shadowrun pt. 2)", 
        artist: "Ghost in Neon", 
        startTime: 50 
      },
      { 
        filename: "Ghost of Me.mp3", 
        title: "Ghost of Me (Shadowrun pt. 3)", 
        artist: "Ghost in Neon", 
        startTime: 90 
      },
      { 
        filename: "Incomprehensible.mp3", 
        title: "Incomprehensible (Shadowrun pt. 4)", 
        artist: "Ghost in Neon", 
        startTime: 80 
      },
      { 
        filename: "Ghost Protocol.mp3", 
        title: "Ghost Protocol (Shadowrun bonus track)", 
        artist: "Ghost in Neon", 
        startTime: 60 
      },
    ]
  },
  stormrost: {
    name: "Stormröst",
    tagline: "Före åskan fanns sången. Mythic & epic folk metal in different languages.",
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
      },
      { 
        filename: "Marrek-an Tromm.mp3", 
        title: "Marrek-an Tromm", 
        artist: "Mòrranssanghen (Doggerland)", 
        startTime: 60 
      }
    ]
  },
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
      { 
        filename: "Iron and Steam.mp3", 
        title: "Iron and Steam", 
        artist: "Steam Powered", 
        startTime: 60 
      },
      { 
        filename: "On maa.mp3", 
        title: "On maa", 
        artist: "Rapakivi", 
        startTime: 60 
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
      { 
        filename: "Halfway to the Sun.mp3", 
        title: "Halfway to the Sun", 
        artist: "Yes And feat. Country & Town", 
        startTime: 60 
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
      },
      { 
        filename: "Right Here, Right Now.mp3", 
        title: "Right Here, Right Now", 
        artist: "Beetmaker feat. Yes And", 
        startTime: 60 
      }
    ]
  },
  doggerland: {
    name: "Doggerland Radio",
    tagline: "Òssen sang, òssen vaagh. Songs from the fictional Doggerland.",
    songs: [
      { 
        filename: "Marrek-an Tromm.mp3", 
        title: "Marrek-an Tromm", 
        artist: "Mòrranssanghen (Doggerland)", 
        startTime: 60 
      },
      { 
        filename: "Stjadh-Ljòss.mp3", 
        title: "Stjadh-Ljòss", 
        artist: "STJAARRLYS", 
        startTime: 60 
      },
      { 
        filename: "Vi Maaler Ljòss.mp3", 
        title: "Vi Maaler Ljòss", 
        artist: "Jòna Graasen", 
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
