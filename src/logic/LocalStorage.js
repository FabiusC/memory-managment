// LocalStorage.js
import { PROCESSES } from '../constants';
import { getProcessByIdFromPROCESSES, setMemoryType } from './MemoryManagment';

// Getter & Setter for Memory
export const getMemoryFromLocalStorage = () => {
    try {
        const memory = JSON.parse(localStorage.getItem('memory'));
        // Verificar si memory es un array, de lo contrario devolver un array vacío
        if (Array.isArray(memory)) {
            return memory;
        } else {
            console.error('Error al obtener la memoria del localStorage: El valor no es un array válido', memory);
            return []; // Retornar array vacío en caso de error
        }
    } catch (error) {
        console.error('Error al parsear la memoria desde localStorage:', error);
        return []; // Retornar array vacío en caso de error
    }
};
export const setMemoryForLocalStorage = (memory) => {
    try {
        localStorage.setItem('memory', JSON.stringify(memory));
        emitMemoryChange();
    } catch (error) {
        console.error('Error al guardar la memoria en localStorage:', error);
    }
};
// Getter & Setter for ProcessQueue
export const getProcessQueueFromLocalStorage = () => {
    try {
        const processQueue = JSON.parse(localStorage.getItem('processQueue'));
        return processQueue || {}; // Retorna un objeto vacío si el valor es null o undefined
    } catch (error) {
        console.error('Error al obtener la cola de procesos del localStorage:', error);
        return {}; // Retorna un objeto vacío en caso de error
    }
};
export const setProcessQueueForLocalStorage = (queue) => {
    try {
        localStorage.setItem('processQueue', JSON.stringify(queue));
        emitProcessQueueChange();
    } catch (error) {
        console.error('Error al guardar la cola de procesos en localStorage:', error);
    }
};
// Getter & Setter for Memory and Algorithm Types and IsCompact
export const getMemoryTypeFromLocalStorage = () => {
    return localStorage.getItem('memoryType') || 'Estática (16x1MB)';
};
export const setMemoryTypeForLocalStorage = (type) => {
    localStorage.setItem('memoryType', type);
    emitMemoryChange();
};
export const getAlgorithmTypeFromLocalStorage = () => {
    return localStorage.getItem('algorithmType') || 'Primer ajuste';
};
export const setAlgorithmTypeForLocalStorage = (type) => {
    localStorage.setItem('algorithmType', type);
    emitMemoryChange();
};
export const getIsCompactFromLocalStorage = () => {
    return localStorage.getItem('isCompact') === 'true';
};
export const setIsCompactForLocalStorage = (compact) => {
    localStorage.setItem('isCompact', compact);
    emitMemoryChange();
};

// Observer for changes in memory and processQueue
const emitMemoryChange = () => {
    const event = new Event('memoryChange');
    window.dispatchEvent(event);
};
const emitProcessQueueChange = () => {
    const event = new Event('processQueueChange');
    window.dispatchEvent(event);
}

// Add a process to memory
export const addProcessToMemory = (process, updatedMemory) => {
    let processQueue = getProcessQueueFromLocalStorage();
    if (processQueue[process.id]) {
        delete processQueue[process.id];
        setProcessQueueForLocalStorage(processQueue);
    }
    if (updatedMemory && Array.isArray(updatedMemory)) {
        setMemoryForLocalStorage(updatedMemory);
        emitMemoryChange(); 
    } else {
        console.error('Error: updatedMemory is not valid', updatedMemory);
    }
};
// Delete a process from memory
export const removeProcessFromMemory = (processId, updatedMemory) => {
    const processQueue = getProcessQueueFromLocalStorage();
    const processToRemove = processQueue[processId];
    if (processToRemove) {
        processQueue[processToRemove.id] = processToRemove;
        setProcessQueueForLocalStorage(processQueue);
    }
    setMemoryForLocalStorage(updatedMemory);
    emitMemoryChange(); 
};

// Add process to ProcessQueue
export const addProcessToProcessQueue = (processId) => {
    let process = getProcessByIdFromPROCESSES(processId);
    let processQueue = getProcessQueueFromLocalStorage();
    // Añadir el proceso de vuelta a la cola con su ID como clave
    processQueue[process.id] = {
        id: process.id,
        name: process.name,
        memory: process.memory,
        image: process.image,
    };
    setProcessQueueForLocalStorage(processQueue); // Actualizar la cola de procesos en el localStorage
};

// Función para resetear el localStorage a su estado inicial
export const resetLocalStorage = () => {
    setProcessQueueForLocalStorage(PROCESSES);
    setMemoryType('Estática (16x1MB)');
};
