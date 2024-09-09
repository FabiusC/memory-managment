import { PROCESSES } from "../../constants";
import { getMemoryFromLocalStorage } from "../LocalStorage/memory";

// Obtener un proceso por su ID
export function getProcessByIdFromMemory(processId) {
    const processMemory = getMemoryFromLocalStorage(); // Obtener la cola de procesos desde el localStorage
    const process = processMemory[processId]; // Buscar el proceso por su ID en la cola

    if (process) {
        return process; // Retornar el proceso si se encuentra
    } else {
        console.error(`Proceso con ID ${processId} no encontrado.`);
        return null; // Retornar null si el proceso no se encuentra
    }
}
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