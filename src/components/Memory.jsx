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
} from '../logic/MemoryManagment';
import { getMemory } from '../logic/LocalStorage';
import { MEMORY_TYPES } from '../constants';

function Memory() {
  const [localMemory, setLocalMemory] = useState([]);
  const [memoryType, setLocalMemoryType] = useState(getMemoryType());
  const [algorithmType, setLocalAlgorithmType] = useState(getAlgorithmType());
  const [isCompact, setLocalIsCompact] = useState(getIsCompact());

  // Inicializar memoria y cola de procesos
  useEffect(() => {
    initializeMemoryAndQueue();
    setLocalMemory(getMemory());
  }, []);

  const handleMemoryTypeChange = (event) => {
    const selectedType = event.target.value;
    setLocalMemoryType(selectedType);
    setMemoryType(selectedType);
    setLocalMemory(getMemory());
  };

  const handleAlgorithmChange = (event) => {
    const selectedType = event.target.value;
    setLocalAlgorithmType(selectedType);
    setAlgorithmType(selectedType);
  };

  const handleCompactChange = (event) => {
    const compact = event.target.checked;
    setLocalIsCompact(compact);
    setCompactMode(compact);
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
      setLocalMemory(getMemory());
    }
  };

  const removeProcessHandler = (processId) => {
    removeProcess(processId);
    setLocalMemory(getMemory());
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
      <div className="memory-visualization">
        {localMemory.map((block, index) => (
          <div key={index} className="memory-wrapper">
            <span className="memory-status">
              {block.process ? (
                <p>Proceso en Memoria: {block.process}, Tamaño: {block.size} KB</p>
              ) : (
                <p>Partición Disponible, Espacio Libre: {block.size} KB</p>
              )}
            </span>
            {block.process && (
              <button className="remove-btn" onClick={() => removeProcessHandler(block.process)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Memory;
