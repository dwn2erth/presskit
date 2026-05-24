import { PressKitData } from "./types";

export const DEFAULT_PRESS_KIT_DATA: PressKitData = {
  duoConfig: {
    subtitle: "Live Visuals with Touchdesigner and Resolume Arena",
    mainVisualUrl: "/assets/images/visuals_hero_1779482442466.png",
    headerVersion: "⭑･ﾟﾟ･*:༅｡.｡༅:*ﾟ:*:✼✿",
    headerTag: "artist portfolio",
    section2InnerTitle: "Live performance and installations",
    tabGigsTitle: "[02_LIVE_PERFORMANCES_AND_INSTALLATIONS]",
    section1Title: "Artist Bios",
    tabArtistsTitle: "[01_ARTIST_BIOS]"
  },
  artist1: {
    name: "JOTTA.RS",
    role: "Multimedia Artist",
    bio: "jotta.rs is a new media artist from Buenos Aires, Argentina, whose practice spans both digital and physical realms. Combining techniques such as analog video processing, 3D scanning, generative coding, visual programming, and video installation, their work explores the possibilities of abstraction through experimental processes. Their practice creates atmospheres where harmony and chaos coexist.",
    software: [
      "TouchDesigner",
      "Blender",
      "Hydra",
      "Resolume Arena"
    ],
    hardware: [],
    email: "jotta.rs111@gmail.com",
    instagram: "@jotta.rs",
    avatarUrl: "/assets/images/foto de perfil j.jpg",
    twitter: "https://x.com/jotta_rs",
    softwareTitle: "work environment"
  },
  artist2: {
    name: "DWN2ERTH",
    role: "Multidisciplinary designer",
    bio: "dwn2erth is a Romanian multidisciplinary designer, with a background in graphic and interaction design. Playing around with different techniques and mediums is the core of her design process, so through out her works you will notice a shift in styles and a lot of experimentation. Coming together, her work can be described as a bold, electric, digital-chaos.",
    software: [
      "Touchdesigner",
      "Blender",
      "Adobe suite",
      "Procrate",
      "Resolume Arena"
    ],
    hardware: [],
    email: "notsodwn@gmail.com",
    instagram: "@notsodwn",
    avatarUrl: "/assets/images/imagen perfil down.jpg",
    twitter: "https://x.com/dwn2erth",
    softwareTitle: "work environment"
  },
  rider: {
    ownEquipment: [
      "One computer",
      "A MidiMix controller"
    ],
    stageRequirements: [
      "HDMI cable for video output"
    ],
    additionalNotes: "A sturdy table to hold the equipment (at least 1 meter wide)."
  },
  gigs: [
    {
      "id": "1",
      "eventName": "Mutek AR 2025",
      "city": "Buenos Aires, Argentina",
      "year": "2025",
      "description": "Audiovisual Performance at Mutek AR by jotta.rs (AR) and Itti (JP)  playing in real time with Ableton live and Touchdesigner.",
      "artistId": "artist1",
      "videoUrl": "https://www.youtube.com/watch?v=bgZcJ5VVLpE&t=1133s",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779529205939-82271598-eb10-4cc8-8ecb-39c6b896281f.png"
    },
    {
      "id": "2",
      "eventName": "Kismet Casa Opening Party at NOX Gallery",
      "city": "Tokyo, Japan",
      "year": "2024",
      "description": "Audiovisual Performance by jotta.rs (AR) and Itti (JP) at NOX Gallery, Shibuya, Tokyo in the Kismet Casa Opening Party, 2023",
      "artistId": "artist1",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779529363987-b693a5f1-3ca0-4c9e-8d24-6b9aee5eb2ef.png",
      "videoUrl": "https://www.youtube.com/watch?v=dFvaYBYqGQU&list=RDdFvaYBYqGQU&start_radio=1"
    },
    {
      "id": "3",
      "eventName": "Human Connection",
      "city": "Groningen, Netherlands",
      "year": "2023",
      "description": "Co-op installation where two players must collaborate to control a blob — each axis controlled by a different player, but only with their partner's help.",
      "artistId": "artist2",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779569909683-33510b67-35ef-47c2-a132-f2bddbae5029.jpg",
      "videoUrl": "https://www.dwn2erth.xyz/projects/human-connection"
    },
    {
      "id": "4",
      "eventName": "ArteBA 2023",
      "city": "Buenos Aires, Argentina",
      "year": "2023",
      "description": "Audiovisual Jam at ArteBA 2023  by jotta.rs, Tweety González, Ernesto Romeo and Solimano.",
      "artistId": "artist1",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779529443551-a91f4b8d-6f37-43ea-8465-eb1c9ae3157d.png",
      "videoUrl": "https://www.youtube.com/watch?v=fuQfgpmL7dE&list=RDfuQfgpmL7dE&start_radio=1&t=1s"
    },
    {
      "id": "5",
      "eventName": "CRT installation @Pauw!",
      "city": "Groningen, Netherlands",
      "year": "2023",
      "description": "Set-up of 20 CRTs at Vera Groningen — running live visuals, a hidden camera feed, and a PS2 for guests to play.",
      "artistId": "artist2",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779570105275-fcff4972-df5a-48b9-b075-f4ad9eb1c293.jpeg",
      "videoUrl": "https://www.dwn2erth.xyz/projects/pauw"
    },
    {
      "id": "1779560353386-me9d",
      "eventName": "Modular - Episode 5",
      "city": "Buenos Aires, Argentina",
      "year": "2023",
      "description": "Audiovisual Performance at Modular ArtLab by jotta.rs (AR) and Unfinished Portraits (AR)  playing in real time with Ableton live and Resolume Arena.",
      "artistId": "artist1",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779560236654-b6c6a519-a5d3-4241-851d-b15955d8c6f5.png",
      "videoUrl": "https://www.youtube.com/watch?v=AtNDNF1AGrU&list=RDAtNDNF1AGrU&start_radio=1"
    },
    {
      "id": "1779570254932-gszd",
      "eventName": "King's Night x Vision Recordings",
      "city": "Groningen, Netherlands",
      "year": "2023",
      "description": "LED ceiling installation for King's Night, controlled through MadMapper and Resolume alongside 3 visual artists.",
      "artistId": "artist2",
      "imageUrl": "https://www.image2url.com/r2/default/files/1779570239353-dd5d62b8-8fc2-4219-a3d7-933b1bc7663a.jpg",
      "videoUrl": "https://www.dwn2erth.xyz/projects/kings-night"
    }
  ]
};
