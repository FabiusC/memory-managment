import { useState, useEffect } from 'react';

import {
  getProcessQueueFromLocalStorage,
  setProcessQueueForLocalStorage,
  getMemoryFromLocalStorage,
  setMemoryForLocalStorage,
  resetLocalStorage
} from '../logic/LocalStorage';
import { findMemoryBlock } from '../logic/MemoryManagment';
import { PROCESSES } from '../constants';

import PropTypes from 'prop-types';

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
    const blockIndex = findMemoryBlock(process, currentMemory);

    if (blockIndex !== -1 && process.memory <= currentMemory[blockIndex].size) {
      currentMemory[blockIndex] = {
        ...currentMemory[blockIndex],
        process: process.id,
        id: process.id,
        name: process.name,
        memory: currentMemory[blockIndex].size - process.memory,
        image: process.image,
      };

      setMemoryForLocalStorage(currentMemory); // Solo actualiza localStorage
      setProcessList((prevList) => {
        const updatedList = { ...prevList };
        delete updatedList[process.id];
        setProcessQueueForLocalStorage(updatedList);
        return updatedList;
      });
    } else {
      alert('El proceso no cabe en el bloque seleccionado.');
    }
  };

  // Función para manejar el reinicio de localStorage
  const handleReset = () => {
    resetLocalStorage();
    setProcessList(PROCESSES); // Actualiza el estado con los procesos iniciales
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
