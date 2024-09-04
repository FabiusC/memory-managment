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
    // Verificar si hay bloques libres entre los ocupados
    if (memory.some((block, index) => block.process && memory[index + 1] && !memory[index + 1].process)) {
        const occupied = memory.filter((block) => block.process);
        const free = memory.filter((block) => !block.process);
        memory = [...occupied, ...free];
        saveToLocalStorage();
        console.log('Memoria compactada.');
    } else {
        console.log('Compactación no necesaria.');
    }
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
    console.log(`Nueva partición de ${size} KB añadida a la memoria.`);
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