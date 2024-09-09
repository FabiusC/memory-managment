// processList.js
import { emitProcessQueueChange } from './localStorageUtils';
import { getProcessByIdFromPROCESSES } from '../MemoryManagment';

// Getter & Setter for ProcessQueue
export const getProcessQueueFromLocalStorage = () => {
    try {
        const processQueue = JSON.parse(localStorage.getItem('processQueue'));
        return processQueue || {};
    } catch (error) {
        console.error('Error al obtener la cola de procesos del localStorage:', error);
        return {};
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

// Add process to ProcessQueue
export const addProcessToProcessQueue = (processId) => {
    let process = getProcessByIdFromPROCESSES(processId);
    let processQueue = getProcessQueueFromLocalStorage();
    processQueue[process.id] = {
        id: process.id,
        name: process.name,
        memory: process.memory,
        image: process.image,
    };
    setProcessQueueForLocalStorage(processQueue);
};
