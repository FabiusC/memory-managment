// memory.js
import { emitMemoryChange } from './localStorageUtils';
import { getProcessQueueFromLocalStorage, setProcessQueueForLocalStorage } from './processList';

// Getter & Setter for Memory
export const getMemoryFromLocalStorage = () => {
    try {
        const memory = JSON.parse(localStorage.getItem('memory'));
        if (Array.isArray(memory)) {
            return memory;
        } else {
            console.error('Error al obtener la memoria del localStorage: El valor no es un array válido', memory);
            return [];
        }
    } catch (error) {
        console.error('Error al parsear la memoria desde localStorage:', error);
        return [];
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
