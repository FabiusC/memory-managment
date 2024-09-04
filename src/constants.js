//CONSTANTS USED IN THE APPLICATION

export const PROCESSES = {
    P1: {
        id: 'P1',
        name: 'WhatsApp',
        memory: 200,
        image: "https://svgl.app/library/whatsapp.svg"
    },
    P2: {
        id: 'P2',
        name: 'Telegram',
        memory: 300,
        image: "https://svgl.app/library/telegram.svg"
    },
    P3: {
        id: 'P3',
        name: 'Netflix',
        memory: 400, //Memory usage in KB
        image: "https://svgl.app/library/netflix.svg",
    },
    P4: {
        id: 'P4',
        name: 'Discord',
        memory: 400,
        image: "https://svgl.app/library/discord.svg",
    },
    P5: {
        id: 'P5',
        name: 'Zoom',
        memory: 500,
        image: "https://svgl.app/library/zoom.svg",
    },
    P6: {
        id: 'P6',
        name: 'Spotify',
        memory: 700,
        image: "https://svgl.app/library/spotify.svg",
    },
    P7: {
        id: 'P7',
        name: 'Prime Video',
        memory: 800,
        image: "https://svgl.app/library/prime-video.svg",
    },
    P8: {
        id: 'P8',
        name: 'Visual Studio Code',
        memory: 1000,
        image: "https://svgl.app/library/vscode.svg",
    },
    P9: {
        id: 'P9',
        name: 'Bing',
        memory: 1000,
        image: "https://svgl.app/library/bing.svg", 
    },
    P10: {
        id: 'P10',
        name: 'Twitch',
        memory: 1200,
        image: "https://svgl.app/library/twitch.svg",
    },
    P11: {
        id: 'P11',
        name: 'Youtube Music',
        memory: 1500,
        image: "https://svgl.app/library/youtube_music.svg",
    },
    P12: {
        id: 'P12',
        name: 'Disney+',
        memory: 1500,
        image: "https://svgl.app/library/disneyplus.svg",
    },
    P13: {
        id: 'P13',
        name: 'Chrome',
        memory: 2000,
        image: "https://svgl.app/library/chrome.svg",
    },
    P14: {
        id: 'P14',
        name: 'Photoshop',
        memory: 2500,
        image: "https://svgl.app/library/photoshop.svg",
    },
    P15: {
        id: 'P15',
        name: 'Illustrator',
        memory: 3000,
        image: "https://svgl.app/library/illustrator.svg",
    },
    P16: {
        id: 'P18',
        name: 'Blender',
        memory: 4000,
        image: "https://svgl.app/library/blender.svg",
    },
    P17: {
        id: 'P19',
        name: 'Unity',
        memory: 5000,
        image: "https://svgl.app/library/unity_dark.svg",
    },
}

export const MEMORY_TYPES = [
    'Estática (16x1MB)',
    'Estática (4,2,1,0.5MB)',
    'Estática Personalizada',
    'Variable'
];

export const MEMORY_CONFIGURATIONS = {
    'Estática (16x1MB)': Array(16).fill({ process: null, size: 1024 }), // 16 partitions of 1MB
    'Estática (4,2,1,0.5MB)': [
        { process: null, size: 4096 }, // 1 partition of 4MB
        ...Array(2).fill({ process: null, size: 2048 }), // 2 partitions of 2MB
        ...Array(4).fill({ process: null, size: 1024 }), // 4 partitions of 1MB
        ...Array(8).fill({ process: null, size: 512 })  // 8 partitions of 500KB
    ],
    'Estática Personalizada': [] // Starts empty, partitions can be added dynamically
};
