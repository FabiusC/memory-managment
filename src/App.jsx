import { useState, useEffect } from 'react';
import { getProcessQueue, setProcessQueue, getMemory, setMemory, resetLocalStorage } from './logic/LocalStorage'; // Importa resetLocalStorage
import { findMemoryBlock } from './logic/MemoryManagment';
import Memory from './components/Memory';
import ProcessList from './components/ProcessList';
import { PROCESSES } from './constants';

function App() {
  const [processList, setProcessList] = useState({});

  useEffect(() => {
    const storedQueue = getProcessQueue(); // Carga los procesos desde localStorage
    if (Object.keys(storedQueue).length === 0) {
      setProcessList(PROCESSES);
      setProcessQueue(PROCESSES); // Guarda PROCESSES en localStorage
    } else {
      setProcessList(storedQueue);
    }
  }, []);

  // Función para manejar la adición de procesos a la memoria
  const handleAddProcessToMemory = (process) => {
    let currentMemory = getMemory();

    // Buscar el bloque de memoria adecuado usando la lógica de MemoryManagement
    const blockIndex = findMemoryBlock(process, currentMemory);

    if (blockIndex !== -1 && process.memory <= currentMemory[blockIndex].size) {
      currentMemory[blockIndex].process = process.id;
      currentMemory[blockIndex].size -= process.memory;

      setMemory(currentMemory); // Actualiza la memoria en localStorage
      setProcessList((prevList) => {
        const updatedList = { ...prevList };
        delete updatedList[process.id];
        setProcessQueue(updatedList);
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
    <div className="container">
      <ProcessList processList={processList} addProcessToMemory={handleAddProcessToMemory} onReset={handleReset} />
      <Memory />
    </div>
  );
}

export default App;
