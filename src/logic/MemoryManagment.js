// MemoryManagement.js
import { MEMORY_CONFIGURATIONS } from "../constants";
import { PROCESSES } from "../constants";
import {
    getMemoryFromLocalStorage,
    setMemoryForLocalStorage,
    setProcessQueueForLocalStorage,
    removeProcessFromMemory,
    getProcessQueueFromLocalStorage,
    setAlgorithmTypeForLocalStorage,
    setIsCompactForLocalStorage,
    setMemoryTypeForLocalStorage,
    getMemoryTypeFromLocalStorage,
    getAlgorithmTypeFromLocalStorage,
} from './LocalStorage';

export let memory = getMemoryFromLocalStorage();
export let processQueue = getProcessQueueFromLocalStorage();
export let memoryType = 'Estática (16x1MB)';
export let algorithmType = 'Primer ajuste';
export let isCompact = false;

// Inicialización de los datos al cargar el módulo
export function initializeMemoryAndQueue() {
    memory = getMemoryFromLocalStorage();
    processQueue = getProcessQueueFromLocalStorage();
    if (!memory.length) {
        memory = MEMORY_CONFIGURATIONS[memoryType];
        setMemoryForLocalStorage(memory);
    }
}
export function initializeProcessQueue() {
    const processQueue = {};
    Object.entries(PROCESSES).forEach(([key, process]) => {
        processQueue[key] = process;
    });
    setProcessQueueForLocalStorage(processQueue);
}

// Getters
export const getMemoryType = () => memoryType;
export const getIsCompact = () => isCompact;
export const getAlgorithmType = () => algorithmType;

// Guardar los cambios en localStorage
export function saveToLocalStorage() {
    setProcessQueueForLocalStorage(processQueue);
    setAlgorithmType(algorithmType);
    setMemoryType(memoryType);
}

// Funciones para cambiar los select y checkbox
export function setMemoryType(type) {
    memoryType = type;
    memory = MEMORY_CONFIGURATIONS[memoryType];
    setMemoryTypeForLocalStorage(memoryType);
    setMemoryForLocalStorage(memory);
}
export function setAlgorithmType(type) {
    algorithmType = type;
    setAlgorithmTypeForLocalStorage(algorithmType);
}
export function setCompactMode(compact) {
    isCompact = compact;
    setIsCompactForLocalStorage(isCompact);
}

// ==================================================== Algoritmos para agregar procesos a memoria/
// Encuentra el índice del bloque de memoria basado en el algoritmo seleccionado
export function findMemoryBlock(process, memory) {
    const algorithm = getAlgorithmType();
    memory = getMemoryFromLocalStorage();
    switch (algorithm) {
        case 'Primer ajuste':
            return firstFit(process, memory);
        case 'Mejor ajuste':
            return bestFit(process, memory);
        case 'Peor ajuste':
            return worstFit(process, memory);
        default:
            return -1;
    }
}
// Lógica de Primer ajuste
export function firstFit(process, memory) {
    for (let i = 0; i < memory.length; i++) {
        if (!memory[i].id && memory[i].size >= process.memory) {
            return i;
        }
    }
    return -1;
}
// Lógica de Mejor ajuste
export function bestFit(process, memory) {
    let bestIndex = -1;
    let smallestFit = Infinity;

    memory.forEach((block, index) => {
        if (!block.id && block.size >= process.memory && block.size < smallestFit) {
            bestIndex = index;
            smallestFit = block.size;
        }
    });

    return bestIndex;
}
// Lógica de Peor ajuste
export function worstFit(process, memory) {
    let worstIndex = -1;
    let largestFit = -Infinity;

    memory.forEach((block, index) => {
        if (!block.id && block.size >= process.memory && block.size > largestFit) {
            worstIndex = index;
            largestFit = block.size;
        }
    });

    return worstIndex;
}

// =========================================================== Funciones para manipular la memoria/
// Función de compactación

export function compactMemory() {
    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();

    // Verificar si la memoria es dinámica
    const isDynamicMemory = getMemoryTypeFromLocalStorage() === 'Dinamica';

    // Filtrar los bloques que están ocupados (tienen un proceso) y los bloques libres
    let occupiedBlocks = memory.filter(block => block.process !== null); // Bloques con procesos
    let freeBlocks = memory.filter(block => block.process === null); // Bloques libres

    if (isDynamicMemory) {
        console.log(`La memoria es Dinamica`);
        // Si la memoria es dinámica, eliminar las particiones vacías
        freeBlocks.forEach((block) => {
            const blockIndex = memory.indexOf(block);
            removePartition(blockIndex); // Eliminar la partición libre
        });
        memory = [...occupiedBlocks]; // Actualizar la memoria sin los bloques libres
    } else {
        // Si la memoria no es dinámica, mover los procesos para ocupar el espacio libre sin eliminar particiones
        let compactedMemory = [];
        // Obtener el tipo de algoritmo de asignación desde el localStorage
        const algorithmType = getAlgorithmTypeFromLocalStorage();
        occupiedBlocks.forEach((processBlock, index) => {
            let freeIndex = -1;
            switch (algorithmType) {
                case 'Primer ajuste': { // First Fit
                    freeIndex = memory.findIndex(block => block.process === null && block.size >= processBlock.memory);
                    break;
                } 
                case 'Mejor ajuste': { 
                    let bestFitIndex = -1; // Best Fit
                    let smallestSizeDiff = Infinity;
                    memory.forEach((block, idx) => {
                        if (block.process === null && block.size >= processBlock.memory) {
                            const sizeDiff = block.size - processBlock.memory;
                            if (sizeDiff < smallestSizeDiff) {
                                smallestSizeDiff = sizeDiff;
                                bestFitIndex = idx;
                            }
                        }
                    });
                    freeIndex = bestFitIndex;
                    break; 
                }
                case 'Peor ajuste': { // Worst Fit
                    let worstFitIndex = -1;
                    let largestSizeDiff = -1;
                    memory.forEach((block, idx) => {
                        if (block.process === null && block.size >= processBlock.memory) {
                            const sizeDiff = block.size - processBlock.memory;
                            if (sizeDiff > largestSizeDiff) {
                                largestSizeDiff = sizeDiff;
                                worstFitIndex = idx;
                            }
                        }
                    });
                    freeIndex = worstFitIndex;
                    break;
                }
                default: {
                    console.error('Tipo de algoritmo no reconocido:', algorithmType);
                    break;
                }
            }
            if (freeIndex !== -1 && freeIndex < index) {
                // Si se encuentra un bloque libre adecuado y está antes del proceso actual, mover el proceso a esa posición
                memory[freeIndex] = { ...processBlock, size: memory[freeIndex].size };
                memory[index] = { process: null, size: processBlock.size }; // Dejar libre la posición original
            } else {
                // Mantener el proceso en su posición si no se encuentra una mejor opción
                compactedMemory.push(processBlock);
            }
        });
        // Añadir los bloques libres restantes al final
        memory = [...compactedMemory, ...freeBlocks];
    }

    // Guardar la memoria actualizada en el localStorage
    setMemoryForLocalStorage(memory);
    console.log('Memoria compactada y procesos reubicados.');
}
// Eliminar proceso de la memoria
export function removeProcess(processId) {
    memory = getMemoryFromLocalStorage();
    const updatedMemory = memory.map((block) => {
        if (block.id === processId) {
            return {
                process: null,
                id: null,
                name: null,
                memory: null,
                image: null,
                size: block.size,
            };
        }
        return block;
    });
    removeProcessFromMemory(processId, updatedMemory);
    memory = updatedMemory;
}

// ========================================================= Getters para los procesos desde el ID/
// Obtener un proceso por su ID
export function getProcessByIdFromMemory(processId) {
    const processMemory = getMemoryFromLocalStorage(); // Obtener la cola de procesos desde el localStorage
    const process = processMemory[processId]; // Buscar el proceso por su ID en la cola

    if (process) {
        return process; // Retornar el proceso si se encuentra
    } else {
        console.error(`Proceso con ID ${processId} no encontrado.`);
        return null; // Retornar null si el proceso no se encuentra
    }
}
// Obtener un proceso por su ID desde PROCESSES
export function getProcessByIdFromPROCESSES(processId) {
    const process = Object.values(PROCESSES).find(process => process.id === processId);

    if (process) {
        return process;
    } else {
        console.error(`Proceso con ID ${processId} no encontrado.`);
        return null;
    }
}

// ==================================================================== Metodos de las Particiones/
// Agregar una particion de memoria personalizada
export function addPartition(size) {
    if (size <= 0) {
        console.error('El tamaño de la partición debe ser mayor a 0.');
        alert('El tamaño de la partición debe ser mayor a 0.');
        return;
    }
    // Obtener la memoria actual
    let memory = getMemoryFromLocalStorage();
    // Calcular el total actual de memoria utilizada
    const totalMemoryUsed = memory.reduce((total, block) => total + block.size, 0);
    // Calcular el nuevo total si se agrega la nueva partición
    const newTotalMemory = totalMemoryUsed + size;
    // Validar que el nuevo total no exceda los 16MB (16,384 KB)
    if (newTotalMemory > 16384) {
        console.error('No se puede agregar la partición. La memoria total excede los 16MB.');
        alert('No se puede agregar la partición. La memoria total excede los 16MB.');
        return;
    }
    // Crear una nueva partición con el tamaño especificado
    const newPartition = {
        size: size,
        process: null,
    };
    // Añadir la nueva partición a la memoria
    memory.push(newPartition);
    // Actualizar la memoria en el localStorage
    setMemoryForLocalStorage(memory);
}
// Quitar una particion de la memoria
export function removePartition(index) {
    // Obtener la memoria actual
    let memory = getMemoryFromLocalStorage();
    // Validar el índice y eliminar la partición si es válido
    if (index >= 0 && index < memory.length) {
        // Remover la partición del array de memoria
        memory.splice(index, 1);
        // Actualizar la memoria en el localStorage
        setMemoryForLocalStorage(memory);
    } else {
        console.error('Índice inválido para eliminar la partición.');
    }
}

// ======================================================================== Calculos de la memoria/
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
    const totalFreeMemory = 16384 - totalMemoryUsed;
    return totalFreeMemory; // Retornar el total de memoria libre
}
// Método para calcular el tamaño total de las particiones 
export function calculateTotalPartitionSize() {
    const memory = getMemoryFromLocalStorage(); // Obtener la memoria actualizada desde el localStorage

    // Verificar si el array de memoria está vacío
    if (memory.length === 0) {
        return 16384; // Retornar 0 si no hay particiones
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
        const endAddress = startAddress + block.size - 1;

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