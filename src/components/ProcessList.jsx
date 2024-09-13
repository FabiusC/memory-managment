// ProcessList.jsx

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
} from '../logic/LocalStorage/memory';
import { getMemoryTypeFromLocalStorage } from '../logic/LocalStorage/memoryControls';
import { resetLocalStorage } from '../logic/LocalStorage/localStorageUtils';

// Imports for MemoryManagement functions
import { findMemoryBlock } from '../logic/MemoryManagment/memoryAlgorithms';
import { calculateTotalFreeMemory } from '../logic/MemoryManagment/memoryCalculations';
import { addPartition } from '../logic/MemoryManagment/partitionManagment';
import { addProcessToMemory, deleteAllProcesses } from '../logic/MemoryManagment/memoryManipulation'; // Importar el nuevo método

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

    if (getMemoryTypeFromLocalStorage() === 'Dinamica') {
      const totalFreeMemory = calculateTotalFreeMemory();
      // Intentar encontrar una partición usando el método firstFit
      const blockIndex = findMemoryBlock(process, currentMemory);
      // Si se encuentra una partición adecuada
      if (blockIndex !== -1 && blockIndex < currentMemory.length - 1) {
        console.log(`Añadiendo proceso ${process.name} a una particion existente en el índice ${blockIndex}`);
        addProcessToMemory(process, blockIndex);
      }

      // Si el índice es igual a la longitud de la memoria, se procede a crear una nueva partición
      if (blockIndex !== -1 && blockIndex === currentMemory.length - 1) {
        // Verificar si hay suficiente espacio para crear una nueva partición
        const freeBlockIndex = currentMemory.findIndex((block) => block.process === null);
        
        if (freeBlockIndex !== -1 && process.memory <= totalFreeMemory) {
          // Crear una nueva partición para el proceso
          addPartition(process.memory);
          console.log(`Creando nueva partición para el proceso ${process.name}`);

          // Obtener la memoria actualizada después de añadir la partición
          currentMemory = getMemoryFromLocalStorage();

          // Encontrar la nueva partición creada
          const newPartitionIndex = currentMemory.findIndex(
            (block) => block.size === process.memory && block.process === null
          );

          // Asignar el proceso a la nueva partición
          if (newPartitionIndex !== -1) {
            addProcessToMemory(process, newPartitionIndex);
          } else {
            alert('Error al crear la nueva partición para el proceso.');
          }
        } else {
          alert('No hay suficiente espacio disponible en la memoria libre para este proceso.');
        }
      }
    } else {
      // Memoria no dinámica: intentar encontrar un bloque adecuado
      const blockIndex = findMemoryBlock(process, currentMemory);

      if (blockIndex !== -1 && process.memory <= currentMemory[blockIndex].size) {
        addProcessToMemory(process, blockIndex);
      } else {
        alert('No hay suficiente espacio disponible para este proceso.');
      }
    }
  };


  // Función para manejar el reinicio de localStorage
  const handleReset = () => {
    resetLocalStorage();
  };

  // Función para eliminar todos los procesos de la memoria
  const handleDeleteAllProcesses = () => {
    deleteAllProcesses();
  };

  return (
    <section className="process-list-container">
      <header className="header">
        <div className="title">
          <h1>Procesos</h1>
        </div>
        <div className="controls-container">
          <button className="btn-reset" onClick={handleReset}>Reiniciar</button>
          <button className="btn-reset" onClick={handleDeleteAllProcesses}>Limpiar Procesos</button>
        </div>
      </header>
      <ul className="processes-list">
        {Object.keys(processList).map((key) => {
          const process = processList[key];
          if (process.id === '0') {
            return null;
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
  onReset: PropTypes.func.isRequired,
};

export default ProcessList;
