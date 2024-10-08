//CONSTANTES UTILIZADAS EN LA APLICACION
export const PROCESSES = {
    0: {
        id: '0',
        name: 'SO',
        memory: 1024,
        text: Math.floor(1024 * 0.30),
        data: Math.floor(1024 * 0.20),
        bss: Math.floor(1024 * 0.10),
        heap: Math.floor(1024 * 0.20),
        stack: Math.floor(1024 * 0.20),
        image: 'https://svgl.app/library/windows.svg',
    },
    4: {
        id: '4',
        name: 'WhatsApp',
        memory: 200,
        text: Math.floor(200 * 0.30),
        data: Math.floor(200 * 0.20),
        bss: Math.floor(200 * 0.10),
        heap: Math.floor(200 * 0.20),
        stack: Math.floor(200 * 0.20),
        image: "https://svgl.app/library/whatsapp.svg"
    },
    5: {
        id: '5',
        name: 'Telegram',
        memory: 300,
        text: Math.floor(300 * 0.30),
        data: Math.floor(300 * 0.20),
        bss: Math.floor(300 * 0.10),
        heap: Math.floor(300 * 0.20),
        stack: Math.floor(300 * 0.20),
        image: "https://svgl.app/library/telegram.svg"
    },
    6: {
        id: '6',
        name: 'Netflix',
        memory: 400,
        text: Math.floor(400 * 0.30),
        data: Math.floor(400 * 0.20),
        bss: Math.floor(400 * 0.10),
        heap: Math.floor(400 * 0.20),
        stack: Math.floor(400 * 0.20),
        image: "https://svgl.app/library/netflix.svg",
    },
    7: {
        id: '7',
        name: 'Discord',
        memory: 450,
        text: Math.floor(450 * 0.30),
        data: Math.floor(450 * 0.20),
        bss: Math.floor(450 * 0.10),
        heap: Math.floor(450 * 0.20),
        stack: Math.floor(450 * 0.20),
        image: "https://svgl.app/library/discord.svg",
    },
    8: {
        id: '8',
        name: 'Zoom',
        memory: 500,
        text: Math.floor(500 * 0.30),
        data: Math.floor(500 * 0.20),
        bss: Math.floor(500 * 0.10),
        heap: Math.floor(500 * 0.20),
        stack: Math.floor(500 * 0.20),
        image: "https://svgl.app/library/zoom.svg",
    },
    9: {
        id: '9',
        name: 'Spotify',
        memory: 600,
        text: Math.floor(600 * 0.30),
        data: Math.floor(600 * 0.20),
        bss: Math.floor(600 * 0.10),
        heap: Math.floor(600 * 0.20),
        stack: Math.floor(600 * 0.20),
        image: "https://svgl.app/library/spotify.svg",
    },
    10: {
        id: '10',
        name: 'Prime Video',
        memory: 700,
        text: Math.floor(700 * 0.30),
        data: Math.floor(700 * 0.20),
        bss: Math.floor(700 * 0.10),
        heap: Math.floor(700 * 0.20),
        stack: Math.floor(700 * 0.20),
        image: "https://svgl.app/library/prime-video.svg",
    },
    11: {
        id: '11',
        name: 'Visual Studio Code',
        memory: 850,
        text: Math.floor(1000 * 0.30),
        data: Math.floor(1000 * 0.20),
        bss: Math.floor(1000 * 0.10),
        heap: Math.floor(1000 * 0.20),
        stack: Math.floor(1000 * 0.20),
        image: "https://svgl.app/library/vscode.svg",
    },
    12: {
        id: '12',
        name: 'Bing',
        memory: 1000,
        text: Math.floor(1000 * 0.30),
        data: Math.floor(1000 * 0.20),
        bss: Math.floor(1000 * 0.10),
        heap: Math.floor(1000 * 0.20),
        stack: Math.floor(1000 * 0.20),
        image: "https://svgl.app/library/bing.svg",
    },
    13: {
        id: '13',
        name: 'Twitch',
        memory: 1100,
        text: Math.floor(1100 * 0.30),
        data: Math.floor(1100 * 0.20),
        bss: Math.floor(1100 * 0.10),
        heap: Math.floor(1100 * 0.20),
        stack: Math.floor(1100 * 0.20),
        image: "https://svgl.app/library/twitch.svg",
    },
    14: {
        id: '14',
        name: 'Youtube Music',
        memory: 1300,
        text: Math.floor(1300 * 0.30),
        data: Math.floor(1300 * 0.20),
        bss: Math.floor(1300 * 0.10),
        heap: Math.floor(1300 * 0.20),
        stack: Math.floor(1300 * 0.20),
        image: "https://svgl.app/library/youtube_music.svg",
    },
    15: {
        id: '15',
        name: 'Disney+',
        memory: 1350,
        text: Math.floor(1350 * 0.30),
        data: Math.floor(1350 * 0.20),
        bss: Math.floor(1350 * 0.10),
        heap: Math.floor(1350 * 0.20),
        stack: Math.floor(1350 * 0.20),
        image: "https://svgl.app/library/disneyplus.svg",
    },
    16: {
        id: '16',
        name: 'Chrome',
        memory: 1500,
        text: Math.floor(1500 * 0.30),
        data: Math.floor(1500 * 0.20),
        bss: Math.floor(1500 * 0.10),
        heap: Math.floor(1500 * 0.20),
        stack: Math.floor(1500 * 0.20),
        image: "https://svgl.app/library/chrome.svg",
    },
    17: {
        id: '17',
        name: 'Photoshop',
        memory: 2000,
        text: Math.floor(2000 * 0.30),
        data: Math.floor(2000 * 0.20),
        bss: Math.floor(2000 * 0.10),
        heap: Math.floor(2000 * 0.20),
        stack: Math.floor(2000 * 0.20),
        image: "https://svgl.app/library/photoshop.svg",
    },
    18: {
        id: '18',
        name: 'Illustrator',
        memory: 2300,
        text: Math.floor(2300 * 0.30),
        data: Math.floor(2300 * 0.20),
        bss: Math.floor(2300 * 0.10),
        heap: Math.floor(2300 * 0.20),
        stack: Math.floor(2300 * 0.20),
        image: "https://svgl.app/library/illustrator.svg",
    },
    19: {
        id: '19',
        name: 'Blender',
        memory: 3000,
        text: Math.floor(3000 * 0.30),
        data: Math.floor(3000 * 0.20),
        bss: Math.floor(3000 * 0.10),
        heap: Math.floor(3000 * 0.20),
        stack: Math.floor(3000 * 0.20),
        image: "https://svgl.app/library/blender.svg",
    },
    20: {
        id: '20',
        name: 'Unity',
        memory: 5000,
        text: Math.floor(5000 * 0.30),
        data: Math.floor(5000 * 0.20),
        bss: Math.floor(5000 * 0.10),
        heap: Math.floor(5000 * 0.20),
        stack: Math.floor(5000 * 0.20),
        image: "https://svgl.app/library/unity_dark.svg",
    },
}

export const MEMORY_TYPES = [
    'Estática (16x1MB)',
    'Estática Variable',
    'Variable Personalizada',
    'Dinamica'
];

export const MEMORY_CONFIGURATIONS = {
    'Estática (16x1MB)': [
        {
            process: '0',
            id: '0',
            name: 'SO',
            memory: 1024,
            text: Math.floor(1024 * 0.30),
            data: Math.floor(1024 * 0.20),
            bss: Math.floor(1024 * 0.10),
            heap: Math.floor(1024 * 0.20),
            stack: Math.floor(1024 * 0.20),
            image: 'https://svgl.app/library/windows.svg',
            size: 1024
        }, // Primera partición reservada para el proceso SO
        ...Array(15).fill({ process: null, size: 1024 }) // Resto de las particiones
    ],
    'Estática Variable': [
        {
            process: '0',
            id: '0',
            name: 'SO',
            memory: 1024,
            text: Math.floor(1024 * 0.30),
            data: Math.floor(1024 * 0.20),
            bss: Math.floor(1024 * 0.10),
            heap: Math.floor(1024 * 0.20),
            stack: Math.floor(1024 * 0.20),
            image: 'https://svgl.app/library/windows.svg',
            size: 1024
        }, // Primera partición reservada para el proceso SO
        { process: null, size: 4096 },                   // 1 Partición de 4MB => 4 MB
        { process: null, size: 3072 },                   // 1 Partición de 3MB => 3 MB
        { process: null, size: 2048 },                   // 1 Partición de 2MB => 2 MB
        ...Array(3).fill({ process: null, size: 1024 }), // 3 Particiones de 1MB => 3 MB
        ...Array(4).fill({ process: null, size: 512 }),  // 4 Particiones de 0.5MB => 2 MB
        ...Array(4).fill({ process: null, size: 256 }),  // 4 Particiones de 0.25MB => 1 MB
    ],
    'Variable Personalizada': [
        {
            process: '0',
            id: '0',
            name: 'SO',
            memory: 1024,
            text: Math.floor(1024 * 0.30),
            data: Math.floor(1024 * 0.20),
            bss: Math.floor(1024 * 0.10),
            heap: Math.floor(1024 * 0.20),
            stack: Math.floor(1024 * 0.20),
            image: 'https://svgl.app/library/windows.svg',
            size: 1024
        }, // Primera partición reservada para el proceso SO
        {
            process: null,
            size: 15360,
        }// Los usuarios pueden agregar más particiones dinámicamente
    ],
    'Dinamica': [
        {
            process: '0',
            id: '0',
            name: 'SO',
            memory: 1024,
            text: Math.floor(1024 * 0.30),
            data: Math.floor(1024 * 0.20),
            bss: Math.floor(1024 * 0.10),
            heap: Math.floor(1024 * 0.20),
            stack: Math.floor(1024 * 0.20),
            image: 'https://svgl.app/library/windows.svg',
            size: 1024
        }, // Primera partición reservada para el proceso SO
        {
            process: null,
            size: 15360,
        } // Las particiones adicionales se gestionan dinámicamente
    ]
};
