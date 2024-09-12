import { getMemoryFromLocalStorage, setMemoryForLocalStorage } from "../LocalStorage/memory";

// Agregar una particion de memoria personalizada
export function addPartition(size) {
    if (size <= 0) {
        console.error('El tamaño de la partición debe ser mayor a 0.');
        alert('El tamaño de la partición debe ser mayor a 0.');
        return;
    }

    let memory = getMemoryFromLocalStorage();
    const freeBlockIndex = memory.findIndex(block => block.process === null);

    // Validar si hay una partición libre y si tiene suficiente espacio
    if (freeBlockIndex !== -1 && size <= memory[freeBlockIndex].size) {
        const freeBlock = memory[freeBlockIndex];

        // Crear una nueva partición con el tamaño especificado
        const newPartition = {
            size: size,
            process: null,
        };

        // Insertar la nueva partición antes de la partición libre
        memory.splice(freeBlockIndex, 0, newPartition);

        // Reducir el tamaño de la partición libre restante
        freeBlock.size -= size;

        // Si la partición libre se quedó sin espacio, eliminarla
        if (freeBlock.size === 0) {
            memory.splice(freeBlockIndex + 1, 1);
        }
    } else {
        console.error('No hay suficiente espacio en la partición libre para crear una nueva partición.');
        alert('No hay suficiente espacio en la partición libre para crear una nueva partición.');
        return;
    }

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

// Método para unir particiones de memoria contiguas que están libres
export function joinMemoryBlocks() {
    // Obtener la memoria actual desde el localStorage
    let memory = getMemoryFromLocalStorage();

    // Recorrer la memoria y unir bloques contiguos si ambos son libres
    for (let i = 0; i < memory.length - 1; i++) {
        // Si la partición actual y la siguiente están libres, únelas
        if (memory[i].process === null && memory[i + 1].process === null) {
            // Combina el tamaño de ambas particiones
            memory[i].size += memory[i + 1].size;

            // Elimina la partición siguiente ya que se ha unido a la actual
            memory.splice(i + 1, 1);

            // Retrocede un índice para verificar nuevamente con la nueva combinación
            i--;
        }
    }

    // Guardar la memoria actualizada en el localStorage
    setMemoryForLocalStorage(memory);
}
