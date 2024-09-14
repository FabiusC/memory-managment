import { getMemoryFromLocalStorage, setMemoryForLocalStorage } from "../LocalStorage/memory";
import { getMemoryTypeFromLocalStorage } from "../LocalStorage/memoryControls";
import { getProcessByIndex } from "./getProcesses";
import { joinMemoryBlocks, removePartition } from "./partitionManagment";

// Función de compactación
export function compactMemory() {
    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();
    // Verificar si la memoria es dinámica
    const isDynamicMemory = getMemoryTypeFromLocalStorage() === 'Dinamica';
    if (isDynamicMemory) {
        // Recorrer la memoria en orden inverso
        for (let i = memory.length - 1; i >= 0; i--) {
            let block = memory[i];
            memory = getMemoryFromLocalStorage(); // Obtener la memoria actualizada
            // Verificar si el bloque está libre (sin proceso)
            if (block.process === null) {
                // Asignar la memoria de este bloque al último bloque de la memoria
                if (i !== memory.length - 1) {
                    memory[memory.length - 1].size += block.size; // Añadir el tamaño de la partición vacía a la última partición
                    setMemoryForLocalStorage(memory); // Guardar la memoria actualizada
                    removePartition(i);
                }
            }
        }
    }
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
                name: 'Libre',
                memory: null,
                text: null,
                data: null,
                bss: null,
                heap: null,
                stack: null,
                image: null,
                size: memory[i].size,
            };
            break; // Romper el ciclo una vez que se ha encontrado y eliminado el proceso
        }
    }

    // Guardar la memoria actualizada sin el proceso
    setMemoryForLocalStorage(memory);

    // Llamar al método para unir bloques contiguos que estén libres si la memoria es dinámica
    if (getMemoryTypeFromLocalStorage() === 'Dinamica' || getMemoryTypeFromLocalStorage() === 'Variable Personalizada') {
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
        text: process.text,
        data: process.data,
        bss: process.bss,
        heap: process.heap,
        stack: process.stack,
        image: process.image,
    };
    // Guardar la memoria actualizada
    setMemoryForLocalStorage(currentMemory);
};


