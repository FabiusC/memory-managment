// localStorageUtils.js
import { PROCESSES } from '../../data/constants';
import { setMemoryType } from '../MemoryManagment/initialiceMemory';
import { setProcessQueueForLocalStorage } from './processList';

// Observer for changes in memory and processQueue
export const emitMemoryChange = () => {
    const event = new Event('memoryChange');
    window.dispatchEvent(event);
};

export const emitProcessQueueChange = () => {
    const event = new Event('processQueueChange');
    window.dispatchEvent(event);
};

// Función para resetear el localStorage a su estado inicial
export const resetLocalStorage = () => {
    setProcessQueueForLocalStorage(PROCESSES);
    setMemoryType('Estática (16x1MB)');
};
