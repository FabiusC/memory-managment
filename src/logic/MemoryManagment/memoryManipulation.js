import { getMemoryFromLocalStorage, setMemoryForLocalStorage } from "../LocalStorage/memory";
import { getAlgorithmTypeFromLocalStorage, getMemoryTypeFromLocalStorage } from "../LocalStorage/memoryControls";
import { getProcessByIndex } from "./getProcesses";
import { joinMemoryBlocks, removePartition } from "./partitionManagment";

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
export function removeProcess(index) {
    // Obtener el proceso según el índice proporcionado
    const processToRemove = getProcessByIndex(index);
    if (!processToRemove) {
        alert('Proceso no encontrado en la memoria.');
        return;
    }

    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();

    // Recorrer la memoria y eliminar el proceso en el índice especificado
    for (let i = 0; i < memory.length; i++) {

        if (i === index) {
            // Eliminar el proceso de la partición correspondiente
            memory[i] = {
                process: null,
                id: null,
                name: 'deleted',
                memory: null,
                image: null,
                size: memory[i].size,
            };
            break; // Romper el ciclo una vez que se ha encontrado y eliminado el proceso
        }
    }

    // Guardar la memoria actualizada sin el proceso
    setMemoryForLocalStorage(memory);

    // Llamar al método para unir bloques contiguos que estén libres si la memoria es dinámica
    if (getMemoryTypeFromLocalStorage() === 'Dinamica') {
        joinMemoryBlocks();
    }
}

// Eliminar todos los procesos de la memoria
export function deleteAllProcesses() {
    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();

    // Recorrer la memoria y eliminar todos los procesos
    for (let i = 0; i < memory.length; i++) {
        if (memory[i].process !== null && memory[i].id !== '0') { // Evitar eliminar el proceso SO
            memory[i] = {
                process: null,
                id: null,
                name: null,
                memory: null,
                image: null,
                size: memory[i].size,
            };
        }
    }
    
    // Guardar la memoria actualizada
    setMemoryForLocalStorage(memory);

    // Unir bloques contiguos si la memoria es Dinámica
    if (getMemoryTypeFromLocalStorage() === 'Dinamica') {
        joinMemoryBlocks();
    }
}

// Añadir proceso a la memoria
export const addProcessToMemory = (process, blockIndex) => {
    let currentMemory = getMemoryFromLocalStorage();
    // Asignar el proceso a la partición encontrada
    currentMemory[blockIndex] = {
      ...currentMemory[blockIndex],
      process: process.id,
      id: process.id,
      name: process.name,
      memory: process.memory,
      image: process.image,
    };
    // Guardar la memoria actualizada
    setMemoryForLocalStorage(currentMemory);
  };


