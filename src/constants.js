//CONSTANTS USED IN THE APPLICATION

export const PROCESSES = {
    1: {
        id: '1',
        name: 'WhatsApp',
        memory: 200,
        image: "https://svgl.app/library/whatsapp.svg"
    },
    2: {
        id: '2',
        name: 'Telegram',
        memory: 300,
        image: "https://svgl.app/library/telegram.svg"
    },
    3: {
        id: '3',
        name: 'Netflix',
        memory: 400, //Memory usage in KB
        image: "https://svgl.app/library/netflix.svg",
    },
    4: {
        id: '4',
        name: 'Discord',
        memory: 400,
        image: "https://svgl.app/library/discord.svg",
    },
    5: {
        id: '5',
        name: 'Zoom',
        memory: 500,
        image: "https://svgl.app/library/zoom.svg",
    },
    6: {
        id: '6',
        name: 'Spotify',
        memory: 700,
        image: "https://svgl.app/library/spotify.svg",
    },
    7: {
        id: '7',
        name: 'rime Video',
        memory: 800,
        image: "https://svgl.app/library/prime-video.svg",
    },
    8: {
        id: '8',
        name: 'Visual Studio Code',
        memory: 1000,
        image: "https://svgl.app/library/vscode.svg",
    },
    9: {
        id: '9',
        name: 'Bing',
        memory: 1000,
        image: "https://svgl.app/library/bing.svg", 
    },
    10: {
        id: '10',
        name: 'Twitch',
        memory: 1200,
        image: "https://svgl.app/library/twitch.svg",
    },
    11: {
        id: '11',
        name: 'Youtube Music',
        memory: 1500,
        image: "https://svgl.app/library/youtube_music.svg",
    },
    12: {
        id: '12',
        name: 'Disney+',
        memory: 1500,
        image: "https://svgl.app/library/disneyplus.svg",
    },
    13: {
        id: '13',
        name: 'Chrome',
        memory: 2000,
        image: "https://svgl.app/library/chrome.svg",
    },
    14: {
        id: '14',
        name: 'hotoshop',
        memory: 2500,
        image: "https://svgl.app/library/photoshop.svg",
    },
    15: {
        id: '15',
        name: 'Illustrator',
        memory: 3000,
        image: "https://svgl.app/library/illustrator.svg",
    },
    16: {
        id: '18',
        name: 'Blender',
        memory: 4000,
        image: "https://svgl.app/library/blender.svg",
    },
    17: {
        id: '19',
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
