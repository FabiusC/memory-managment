// LocalStorage.js
import { MEMORY_CONFIGURATIONS, PROCESSES } from '../constants';

export const getMemory = () => {
    return JSON.parse(localStorage.getItem('memory')) || [];
};

export const setMemory = (memory) => {
    localStorage.setItem('memory', JSON.stringify(memory));
};

export const getProcessQueue = () => {
    return JSON.parse(localStorage.getItem('processQueue')) || {};
};

export const setProcessQueue = (queue) => {
    localStorage.setItem('processQueue', JSON.stringify(queue));
};

// Añadir un proceso a la memoria y actualizar el estado
export const addProcessToMemory = (process, updatedMemory) => {
    let processQueue = getProcessQueue();

    if (processQueue[process.id]) {
        delete processQueue[process.id];
        setProcessQueue(processQueue);
    }

    if (updatedMemory && Array.isArray(updatedMemory)) {
        setMemory(updatedMemory);
    } else {
        console.error('Error: updatedMemory is not valid', updatedMemory);
    }
};

// Eliminar un proceso de la memoria
export const removeProcessFromMemory = (processId, updatedMemory) => {
    const processQueue = getProcessQueue();
    const processToRemove = processQueue[processId];

    if (processToRemove) {
        processQueue[processToRemove.id] = processToRemove;
        setProcessQueue(processQueue);
    }

    setMemory(updatedMemory);
};

// Función para resetear el localStorage a su estado inicial
export const resetLocalStorage = () => {
    setProcessQueue(PROCESSES); // Resetea la cola de procesos al estado inicial
    setMemory(MEMORY_CONFIGURATIONS['Estática (16x1MB)']); // Resetea la memoria a la configuración inicial
    console.log('LocalStorage reset to initial state.');
};
