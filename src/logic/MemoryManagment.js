import { MEMORY_CONFIGURATIONS } from "../constants";
import { getMemory, setMemory, setProcessQueue, removeProcessFromMemory, getProcessQueue } from './LocalStorage';

export let memory = getMemory();
export let processQueue = getProcessQueue();
export let memoryType = 'Estática (16x1MB)';
export let algorithmType = 'Primer ajuste';
export let isCompact = false;

// Inicialización de los datos al cargar el módulo
export function initializeMemoryAndQueue() {
    memory = getMemory();
    processQueue = getProcessQueue();
    if (!memory.length) {
        memory = MEMORY_CONFIGURATIONS[memoryType];
        setMemory(memory);
    }
}

// Getters
export const getMemoryType = () => memoryType;
export const getIsCompact = () => isCompact;
export const getAlgorithmType = () => algorithmType;

// Guardar los cambios en localStorage
export function saveToLocalStorage() {
    setMemory(memory);
    setProcessQueue(processQueue);
}

// Funciones para cambiar los select y checkbox
export function setMemoryType(type) {
    memoryType = type;
    memory = MEMORY_CONFIGURATIONS[memoryType];
    saveToLocalStorage();
}

export function setAlgorithmType(type) {
    algorithmType = type;
}

export function setCompactMode(compact) {
    isCompact = compact;
}

// Encuentra el índice del bloque de memoria basado en el algoritmo seleccionado
export function findMemoryBlock(process, memory) {
    const algorithm = getAlgorithmType();

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
        if (!memory[i].process && memory[i].size >= process.memory) {
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
        if (!block.process && block.size >= process.memory && block.size < smallestFit) {
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
        if (!block.process && block.size >= process.memory && block.size > largestFit) {
            worstIndex = index;
            largestFit = block.size;
        }
    });

    return worstIndex;
}

// Función de compactación
export function compactMemory() {
    const occupied = memory.filter((block) => block.process);
    const free = memory.filter((block) => !block.process);
    memory = [...occupied, ...free];
    saveToLocalStorage();
}

// Eliminar proceso de la memoria
export function removeProcess(processId) {
    const updatedMemory = memory.map((block) => {
        if (block.process === processId) {
            return { process: null, size: block.size };
        }
        return block;
    });

    removeProcessFromMemory(processId, updatedMemory);
    memory = updatedMemory;
    saveToLocalStorage();
}
