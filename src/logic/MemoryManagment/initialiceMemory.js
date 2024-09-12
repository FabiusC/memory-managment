// initializeMemory.js
import { MEMORY_CONFIGURATIONS, PROCESSES } from "../../data/constants";
import { getMemoryFromLocalStorage, setMemoryForLocalStorage } from "../LocalStorage/memory";
import { setAlgorithmTypeForLocalStorage, setIsCompactForLocalStorage, setMemoryTypeForLocalStorage } from "../LocalStorage/memoryControls";
import { getProcessQueueFromLocalStorage, setProcessQueueForLocalStorage } from "../LocalStorage/processList";

// Variables de estado inicializadas dentro de las funciones
let memory = [];
let processQueue = {};
let memoryType = 'Estática (16x1MB)';
let algorithmType = 'Primer ajuste';
let isCompact = false;

// Getters
export const getMemoryType = () => memoryType;
export const getIsCompact = () => isCompact;
export const getAlgorithmType = () => algorithmType;

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
    processQueue = {};
    Object.entries(PROCESSES).forEach(([key, process]) => {
        processQueue[key] = process;
    });
    setProcessQueueForLocalStorage(processQueue);
}

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
