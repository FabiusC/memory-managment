import { getMemoryFromLocalStorage } from "../LocalStorage/memory";
import { getAlgorithmType } from "./initialiceMemory";

// Algoritmos para agregar procesos a memoria

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