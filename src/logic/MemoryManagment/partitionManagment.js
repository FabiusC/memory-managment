import { getMemoryFromLocalStorage, setMemoryForLocalStorage } from "../LocalStorage/memory";

// Agregar una particion de memoria personalizada
export function addPartition(size) {
    if (size <= 0) {
        console.error('El tamaño de la partición debe ser mayor a 0.');
        alert('El tamaño de la partición debe ser mayor a 0.');
        return;
    }
    // Obtener la memoria actual
    let memory = getMemoryFromLocalStorage();
    // Calcular el total actual de memoria utilizada
    const totalMemoryUsed = memory.reduce((total, block) => total + block.size, 0);
    // Calcular el nuevo total si se agrega la nueva partición
    const newTotalMemory = totalMemoryUsed + size;
    // Validar que el nuevo total no exceda los 16MB (16,384 KB)
    if (newTotalMemory > 16384) {
        console.error('No se puede agregar la partición. La memoria total excede los 16MB.');
        alert('No se puede agregar la partición. La memoria total excede los 16MB.');
        return;
    }
    // Crear una nueva partición con el tamaño especificado
    const newPartition = {
        size: size,
        process: null,
    };
    // Añadir la nueva partición a la memoria
    memory.push(newPartition);
    // Actualizar la memoria en el localStorage
    setMemoryForLocalStorage(memory);
}
// Quitar una particion de la memoria
export function removePartition(index) {
    // Obtener la memoria actual
    let memory = getMemoryFromLocalStorage();
    // Validar el índice y eliminar la partición si es válido
    if (index >= 0 && index < memory.length) {
        // Remover la partición del array de memoria
        memory.splice(index, 1);
        // Actualizar la memoria en el localStorage
        setMemoryForLocalStorage(memory);
    } else {
        console.error('Índice inválido para eliminar la partición.');
    }
}