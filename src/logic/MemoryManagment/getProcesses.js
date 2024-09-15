import { PROCESSES } from "../../data/constants";
import { getMemoryFromLocalStorage } from "../LocalStorage/memory";

// Obtener un proceso por su ID

// Obtener un proceso por su ID desde PROCESSES
export function getProcessByIdFromPROCESSES(processId) {
    const process = Object.values(PROCESSES).find(process => process.id === processId);

    if (process) {
        return process;
    } else {
        console.error(`Proceso con ID ${processId} no encontrado.`);
        return null;
    }
}
// Método para obtener inidice según su índice en la memoria
export function getProcessByIndex(index) {
    const memory = getMemoryFromLocalStorage();
    // Verificar que el índice esté dentro de los límites del array
    if (index >= 0 && index < memory.length) {
        return memory[index]; // Retorna el proceso correspondiente al índice
    } else {
        console.error(`Indice fuera de rango: ${index}`);
        return null; // Retorna null si el índice está fuera de rango
    }
}