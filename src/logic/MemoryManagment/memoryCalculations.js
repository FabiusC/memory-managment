import { getMemoryFromLocalStorage } from "../LocalStorage/memory";

// Método para calcular el tamaño libre de un bloque
export function calculateFreeSize(block) {
    // Si el bloque tiene un proceso, calcula el tamaño libre restando el tamaño del proceso
    if (block.memory) {
        return block.size - block.memory; // Restar el tamaño del proceso al tamaño total del bloque
    }
    // Si no hay proceso, retornar el tamaño total del bloque
    return block.size;
}
// Método para calcular la cantidad total de memoria libre en todos los bloques
export function calculateTotalFreeMemory() {
    const memory = getMemoryFromLocalStorage(); // Obtener la memoria actualizada desde el localStorage
    // Calcular la memoria total utilizada sumando el memory de cada bloque que tenga un proceso
    const totalMemoryUsed = memory.reduce((total, block) => {
        return total + (block.memory || 0); // Sumar solo el tamaño del proceso si existe
    }, 0); // Iniciar la suma desde cero

    // Calcular la memoria libre restando la memoria utilizada del total de 16384
    const totalFreeMemory = 15360 - totalMemoryUsed;
    return totalFreeMemory; // Retornar el total de memoria libre
}
// Método para calcular el tamaño total de las particiones 
export function calculateTotalPartitionSize() {
    const memory = getMemoryFromLocalStorage(); // Obtener la memoria actualizada desde el localStorage

    // Verificar si el array de memoria está vacío
    if (memory.length === 0) {
        return 15360; // Retornar 0 si no hay particiones
    } else {
        // Sumar el tamaño de cada partición (bloque) en la memoria
        const totalPartitionSize = memory.reduce((total, block) => {
            return total + block.size; // Sumar el tamaño del bloque
        }, 0); // Iniciar la suma desde cero
        return 16384 - totalPartitionSize; // Retornar el total del tamaño de las particiones
    }
}
// Método para calcular la cantidad total de memoria desperdiciada en todos los bloques
export function calculateTotalWastedMemory() {
    const memory = getMemoryFromLocalStorage(); // Obtener la memoria actualizada desde el localStorage
    // Reducir la memoria sumando el tamaño libre de cada bloque que tenga un proceso
    const totalWastedMemory = memory.reduce((total, block) => {
        // Verificar si el bloque tiene un proceso (block.memory existe)
        if (block.memory) {
            // Sumar el tamaño libre de cada bloque que tiene un proceso
            return total + (block.size - block.memory);
        }
        return total; // No sumar si no hay proceso
    }, 0); // Iniciar la suma desde cero
    return totalWastedMemory; // Retornar el total de memoria libre
}
// Método para obtener el indice Hexadecimal de cada bloque
export function getMemoryIndex(blockIndex) {
    const memory = getMemoryFromLocalStorage();
    
    // Verifica si el índice es válido
    if (blockIndex < 0 || blockIndex >= memory.length) {
        console.log(`Invalid block index: ${blockIndex}`);
        return {
            startAddress: '0x0000',
            endAddress: '0x0000'
        };
    }

    let startAddress = 0;

    // Iterar sobre los bloques hasta el índice deseado para calcular su posición
    for (let i = 0; i <= blockIndex; i++) {
        const block = memory[i];
        
        // Convertir el tamaño del bloque de KB a bytes
        const blockSizeInBytes = block.size * 1024;
        
        // Calcular la dirección final del bloque actual
        const endAddress = startAddress + blockSizeInBytes - 1;

        // Si es el bloque que estamos buscando, devolvemos sus direcciones
        if (i === blockIndex) {
            const startHex = `0x${startAddress.toString(16).toUpperCase()}`;
            const endHex = `0x${endAddress.toString(16).toUpperCase()}`;
            return {
                startAddress: startHex,
                endAddress: endHex
            };
        }

        // Actualizar la dirección de inicio para el siguiente bloque
        startAddress = endAddress + 1;
    }

    // Retornar direcciones vacías si no se encuentra el bloque, aunque este caso no debería ocurrir
    return {
        startAddress: '0x0000',
        endAddress: '0x0000'
    };
}
