import { useState, useEffect } from 'react';
import { PROCESSES } from '../data/constants';
import PropTypes from 'prop-types';

// Imports for localStorage functions
import {
  getProcessQueueFromLocalStorage,
  setProcessQueueForLocalStorage,
} from '../logic/LocalStorage/processList';
import {
  getMemoryFromLocalStorage,
  setMemoryForLocalStorage,
} from '../logic/LocalStorage/memory';
import { getMemoryTypeFromLocalStorage } from '../logic/LocalStorage/memoryControls';
import { resetLocalStorage } from '../logic/LocalStorage/localStorageUtils';

// Imports for MemoryMangment functions
import { findMemoryBlock } from '../logic/MemoryManagment/memoryAlgorithms';

function ProcessList() {

  const [processList, setProcessList] = useState({});

  useEffect(() => {
    const storedQueue = getProcessQueueFromLocalStorage();
    if (Object.keys(storedQueue).length === 0) {
      setProcessList(PROCESSES);
      setProcessQueueForLocalStorage(PROCESSES);
    } else {
      setProcessList(storedQueue);
    }
    const handleProcessQueueChange = () => {
      setProcessList(getProcessQueueFromLocalStorage());
    };
    window.addEventListener('processQueueChange', handleProcessQueueChange);
    return () => {
      window.removeEventListener('processQueueChange', handleProcessQueueChange);
    };
  }, []);

  // Función para manejar la adición de procesos a la memoria
  const handleAddProcessToMemory = (process) => {
    let currentMemory = getMemoryFromLocalStorage();

    // Verificar si la memoria es dinámica y hay suficiente espacio libre
    if (getMemoryTypeFromLocalStorage() === 'Dinamica') {
      // Buscar la partición de memoria libre
      const freeBlockIndex = currentMemory.findIndex(block => block.process === null);

      // Verificar si hay una partición libre y si tiene suficiente espacio
      if (freeBlockIndex !== -1 && process.memory <= currentMemory[freeBlockIndex].size) {
        const freeBlock = currentMemory[freeBlockIndex];

        // Crear una nueva partición para el proceso
        const newPartition = {
          process: process.id,
          id: process.id,
          name: process.name,
          memory: process.memory,
          image: process.image,
          size: process.memory,
        };

        // Insertar la nueva partición antes de la partición libre
        currentMemory.splice(freeBlockIndex, 0, newPartition);

        // Reducir el tamaño de la partición libre restante
        freeBlock.size -= process.memory;

        // Si la partición libre se quedó sin espacio, eliminarla
        if (freeBlock.size === 0) {
          currentMemory.splice(freeBlockIndex + 1, 1);
        }

        // Guardar la memoria actualizada
        setMemoryForLocalStorage(currentMemory);
      } else {
        alert('No hay suficiente espacio disponible en la memoria libre para este proceso.');
      }
    } else {
      // Si no hay suficiente memoria libre, buscar un bloque disponible
      const blockIndex = findMemoryBlock(process, currentMemory);

      if (blockIndex !== -1 && process.memory <= currentMemory[blockIndex].size) {
        // Agregar el proceso al bloque encontrado
        currentMemory[blockIndex] = {
          ...currentMemory[blockIndex],
          process: process.id,
          id: process.id,
          name: process.name,
          memory: process.memory,
          image: process.image,
        };
        setMemoryForLocalStorage(currentMemory);
      } else {
        // Alertar si no hay espacio disponible en ningún bloque
        alert('No hay suficiente espacio disponible para este proceso.');
      }
    }
  };


  // Función para manejar el reinicio de localStorage
  const handleReset = () => {
    resetLocalStorage();
  };

  return (
    <section className="process-list-container">
      <header className="header">
        <div className="title">
          <h1>Procesos</h1>
        </div>
        <div className="controls-container">
          <button className="btn-reset" onClick={handleReset}>Reiniciar</button> {/* Botón para reiniciar */}
        </div>
      </header>
      <ul className="processes-list">
        {Object.keys(processList).map((key) => {
          const process = processList[key];
          // Condicional para no mostrar el proceso con id '0'
          if (process.id === '0') {
            return null; // No renderiza nada si el proceso es 'SO'
          }
          return (
            <li key={process.id} className="process-card" onClick={() => handleAddProcessToMemory(process)}>
              <div className="process">
                <img src={process.image} alt={process.id} className="process-image" />
                <div className="process-info">
                  <span className="process-id">{process.name}</span>
                  <span className="process-memory">{process.memory} KB</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Validación de Props con PropTypes
ProcessList.propTypes = {
  processList: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      memory: PropTypes.number,
      image: PropTypes.string,
    })
  ).isRequired,
  addProcessToMemory: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired, // Añade la validación del nuevo prop onReset
};

export default ProcessList;
