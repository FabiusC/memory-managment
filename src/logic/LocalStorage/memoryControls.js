// memoryControls.js
import { emitMemoryChange } from './localStorageUtils';

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
