import { useState, useEffect } from 'react';
import {
  initializeMemoryAndQueue,
  firstFit,
  bestFit,
  worstFit,
  getMemoryType,
  setMemoryType,
  getAlgorithmType,
  setAlgorithmType,
  getIsCompact,
  setCompactMode,
  removeProcess,
  addPartition,
  removePartition
} from '../logic/MemoryManagment';
import {
  addProcessToProcessQueue,
  getAlgorithmTypeFromLocalStorage,
  getIsCompactFromLocalStorage,
  getMemoryFromLocalStorage
} from '../logic/LocalStorage';
import { MEMORY_TYPES } from '../constants';

function Memory() {
  const [localMemory, setLocalMemory] = useState([]);
  const [memoryType, setLocalMemoryType] = useState(getMemoryType());
  const [algorithmType, setLocalAlgorithmType] = useState(getAlgorithmType());
  const [isCompact, setLocalIsCompact] = useState(getIsCompact());
  const [partitionSize, setPartitionSize] = useState('');

  // Inicializar memoria y cola de procesos
  useEffect(() => {
    // Inicializar memoria y cola de procesos
    initializeMemoryAndQueue();
    setLocalMemory(getMemoryFromLocalStorage());
    // Escuchar el evento de cambio de memoria
    const handleMemoryChange = () => {
      setLocalMemory(getMemoryFromLocalStorage());
    };
    // Añadir el listener del evento
    window.addEventListener('memoryChange', handleMemoryChange);
    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('memoryChange', handleMemoryChange);
    };
  }, []);

  const handleMemoryTypeChange = (event) => {
    const selectedType = event.target.value;
    setLocalMemoryType(selectedType);
    setMemoryType(selectedType);
    setLocalMemory(getMemoryFromLocalStorage());
  };

  const handleAlgorithmChange = (event) => {
    const selectedType = event.target.value;
    setLocalAlgorithmType(selectedType);
    setAlgorithmType(selectedType);
    setLocalAlgorithmType(getAlgorithmTypeFromLocalStorage());
  };

  const handleCompactChange = (event) => {
    const compact = event.target.checked;
    setLocalIsCompact(compact);
    setCompactMode(compact);
    setLocalIsCompact(getIsCompactFromLocalStorage());
  };

  const removeProcessHandler = (processId) => {
    addProcessToProcessQueue(processId);
    removeProcess(processId);
    setLocalMemory(getMemoryFromLocalStorage());
  };

  const handleAddPartition = () => {
    const size = parseInt(partitionSize, 10);
    if (!isNaN(size) && size > 0) {
      addPartition(size); // Llamar al método para agregar una partición
      setPartitionSize(''); // Limpiar el input después de añadir la partición
    } else {
      alert('Ingrese un tamaño válido para la partición.');
    }
  };

  const handleRemovePartition = (index) => {
    removePartition(index); // Llama al método para eliminar la partición en el MemoryManagement
    setLocalMemory(getMemoryFromLocalStorage()); // Actualiza el estado de la memoria local después de la eliminación
  };

  // eslint-disable-next-line no-unused-vars
  const addProcessToMemoryHandler = (process) => {
    let success = false;
    switch (algorithmType) {
      case 'Primer ajuste':
        success = firstFit(process);
        console.log(`firstFit Algorithm: ${process}`);
        break;
      case 'Mejor ajuste':
        success = bestFit(process);
        console.log(`bestFit Algorithm: ${process}`);
        break;
      case 'Peor ajuste':
        success = worstFit(process);
        console.log(`worstFit Algorithm: ${process}`);
        break;
      default:
        console.log(`No se reconoce el algoritmo: ${algorithmType}`);
        return;
    }

    if (!success) {
      alert('No hay suficiente espacio para este proceso.');
    } else {
      setLocalMemory(getMemoryFromLocalStorage());
    }
  };

  return (
    <section className="memory-container">
      <header className="memory-header">
        <h2>Gestión de Memoria</h2>
        <div className="memory-controls">
          <label className="compact-checkbox">
            <input
              type="checkbox"
              className="checkbox"
              checked={isCompact}
              onChange={handleCompactChange}
            />
            Compactar Memoria
          </label>
          <span>Total Free Memory: {/* Cálculo necesario */} KB</span>
          <select className="select-memory-type" onChange={handleMemoryTypeChange} value={memoryType}>
            {MEMORY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select className="select-algorithm-type" onChange={handleAlgorithmChange} value={algorithmType}>
            <option value="Primer ajuste">Primer ajuste</option>
            <option value="Mejor ajuste">Mejor ajuste</option>
            <option value="Peor ajuste">Peor ajuste</option>
          </select>
        </div>
      </header>
      <div className={`memory-visualization`}>
        {localMemory.map((block, index) => (
          <div key={index} className="memory-wrapper">
            <span className={`memory-status ${(memoryType === 'Estática Personalizada' && 'custom-memory')}`}>
              {block.name ? (
                <p>{block.name}, Tamaño: {block.size} KB</p>
              ) : (
                <p>Partición Disponible, Espacio Libre: {block.size} KB</p>
              )}
            </span>
            {block.process && (
              <button className="remove-btn" onClick={() => removeProcessHandler(block.process)}>
                X
              </button>
            )}
          </div>
        ))}
      </div>
      {memoryType === 'Estática Personalizada' && (
        <div className="custom-partition-creator">
          <input
            type="number"
            className='memory-input'
            placeholder="Tamaño de la partición en KB"
            value={partitionSize}
            onChange={(e) => setPartitionSize(e.target.value)}
          />
          <button className='btn-memory-input' onClick={handleAddPartition}>Agregar Partición</button>
        </div>
      )}
    </section>
  );
}

export default Memory;
