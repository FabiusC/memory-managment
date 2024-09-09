import { getMemoryFromLocalStorage, removeProcessFromMemory, setMemoryForLocalStorage } from "../LocalStorage/memory";
import { getAlgorithmTypeFromLocalStorage, getMemoryTypeFromLocalStorage } from "../LocalStorage/memoryControls";
import { removePartition } from "./partitionManagment";

// Función de compactación
export function compactMemory() {
    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();

    // Verificar si la memoria es dinámica
    const isDynamicMemory = getMemoryTypeFromLocalStorage() === 'Dinamica';

    // Filtrar los bloques que están ocupados (tienen un proceso) y los bloques libres
    let occupiedBlocks = memory.filter(block => block.process !== null); // Bloques con procesos
    let freeBlocks = memory.filter(block => block.process === null); // Bloques libres

    if (isDynamicMemory) {
        // Si la memoria es dinámica, eliminar las particiones vacías
        freeBlocks.forEach((block) => {
            const blockIndex = memory.indexOf(block);
            removePartition(blockIndex); // Eliminar la partición libre
        });
        memory = [...occupiedBlocks]; // Actualizar la memoria sin los bloques libres
    } else {
        // Si la memoria no es dinámica, mover los procesos para ocupar el espacio libre sin eliminar particiones
        let compactedMemory = [];
        // Obtener el tipo de algoritmo de asignación desde el localStorage
        const algorithmType = getAlgorithmTypeFromLocalStorage();
        occupiedBlocks.forEach((processBlock, index) => {
            let freeIndex = -1;
            switch (algorithmType) {
                case 'Primer ajuste': { // First Fit
                    freeIndex = memory.findIndex(block => block.process === null && block.size >= processBlock.memory);
                    break;
                } 
                case 'Mejor ajuste': { 
                    let bestFitIndex = -1; // Best Fit
                    let smallestSizeDiff = Infinity;
                    memory.forEach((block, idx) => {
                        if (block.process === null && block.size >= processBlock.memory) {
                            const sizeDiff = block.size - processBlock.memory;
                            if (sizeDiff < smallestSizeDiff) {
                                smallestSizeDiff = sizeDiff;
                                bestFitIndex = idx;
                            }
                        }
                    });
                    freeIndex = bestFitIndex;
                    break; 
                }
                case 'Peor ajuste': { // Worst Fit
                    let worstFitIndex = -1;
                    let largestSizeDiff = -1;
                    memory.forEach((block, idx) => {
                        if (block.process === null && block.size >= processBlock.memory) {
                            const sizeDiff = block.size - processBlock.memory;
                            if (sizeDiff > largestSizeDiff) {
                                largestSizeDiff = sizeDiff;
                                worstFitIndex = idx;
                            }
                        }
                    });
                    freeIndex = worstFitIndex;
                    break;
                }
                default: {
                    console.error('Tipo de algoritmo no reconocido:', algorithmType);
                    break;
                }
            }
            if (freeIndex !== -1 && freeIndex < index) {
                // Si se encuentra un bloque libre adecuado y está antes del proceso actual, mover el proceso a esa posición
                memory[freeIndex] = { ...processBlock, size: memory[freeIndex].size };
                memory[index] = { process: null, size: processBlock.size }; // Dejar libre la posición original
            } else {
                // Mantener el proceso en su posición si no se encuentra una mejor opción
                compactedMemory.push(processBlock);
            }
        });
        // Añadir los bloques libres restantes al final
        memory = [...compactedMemory, ...freeBlocks];
    }

    // Guardar la memoria actualizada en el localStorage
    setMemoryForLocalStorage(memory);
}
// Eliminar proceso de la memoria
export function removeProcess(processId) {
    let memory = getMemoryFromLocalStorage();
    const updatedMemory = memory.map((block) => {
        if (block.id === processId) {
            return {
                process: null,
                id: null,
                name: null,
                memory: null,
                image: null,
                size: block.size,
            };
        }
        return block;
    });
    removeProcessFromMemory(processId, updatedMemory);
    memory = updatedMemory;
}