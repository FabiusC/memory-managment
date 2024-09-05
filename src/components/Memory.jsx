import { useState, useEffect, useRef } from 'react';
import {
  initializeMemoryAndQueue,
  getMemoryType,
  setMemoryType,
  getAlgorithmType,
  setAlgorithmType,
  getIsCompact,
  setCompactMode,
  removeProcess,
  addPartition,
  removePartition,
  calculateTotalFreeMemory,
  compactMemory,
  calculateTotalWastedMemory,
  initializeProcessQueue,
} from '../logic/MemoryManagment';
import {
  addProcessToProcessQueue,
  getAlgorithmTypeFromLocalStorage,
  getIsCompactFromLocalStorage,
  getMemoryFromLocalStorage,
  getMemoryTypeFromLocalStorage,
} from '../logic/LocalStorage';
import { MEMORY_TYPES } from '../constants';
import { Chart } from 'chart.js/auto'; // Import Chart.js with all dependencies

function Memory() {
  const [localMemory, setLocalMemory] = useState([]);
  const [memoryType, setLocalMemoryType] = useState(getMemoryType());
  // eslint-disable-next-line no-unused-vars
  const [algorithmType, setLocalAlgorithmType] = useState(getAlgorithmType());
  const [isCompact, setLocalIsCompact] = useState(getIsCompact());
  const [partitionSize, setPartitionSize] = useState('');

  // Reference for the chart canvas
  const chartRef = useRef(null);
  let myChart = useRef(null); // To store the chart instance

  // Initialize memory and process queue
  useEffect(() => {
    initializeMemoryAndQueue();
    setLocalMemory(getMemoryFromLocalStorage());

    // Event listener for memory changes
    const handleMemoryChange = () => {
      setLocalMemory(getMemoryFromLocalStorage());
      updateChart(); // Update chart when memory changes
    };

    window.addEventListener('memoryChange', handleMemoryChange);
    return () => {
      window.removeEventListener('memoryChange', handleMemoryChange);
    };
  }, []);

  // Set up the Chart.js stacked bar chart when component mounts
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      myChart.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: localMemory.map((_, index) => `Bloque ${index + 1}`),
          datasets: [
            {
              label: 'Memoria Usada',
              data: localMemory.map((block) => block.memory || 0),
              backgroundColor: '#88ffc3',
              hoverBackgroundColor: '#56db78',
              barThickness: 30,
            },
            {
              label: 'Memoria Libre',
              data: localMemory.map((block) => block.size - (block.memory || 0)),
              backgroundColor: '#88e7ff',
              hoverBackgroundColor: '#4ed3f5',
              barThickness: 30,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: true,
              backgroundColor: '#1a1a1a',
              titleFont: {
                size: 16, 
              },
              bodyFont: {
                size: 16, 
              },
            },
            title: {
              display: true,
              text: 'Bloques de Memoria',
              font: {
                size: 40,
                weight: 'bold',
                color: '#ffffff', 
              },
            },
            legend: {
              labels: {
                color: '#e0e0e0',
                font: {
                  size: 25,
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: '#e0e0e0',
                font: {
                  size: 15,
                },
              },
            },
            y: {
              stacked: true,
              ticks: {
                color: '#e0e0e0', 
                font: {
                  size: 15,
                },
              },
            },
          },
        },
      });
    }
  
    // Cleanup on unmount
    return () => {
      if (myChart.current) {
        myChart.current.destroy();
      }
    };
  }, [localMemory]);

// Function to update chart data
const updateChart = () => {
  if (myChart.current) {
    myChart.current.data.datasets[0].data = localMemory.map((block) => block.memory || 0);
    myChart.current.data.datasets[1].data = localMemory.map((block) => block.size - (block.memory || 0));
    myChart.current.update();
  }
};

const handleMemoryTypeChange = (event) => {
  const memoryType = event.target.value;
  setLocalMemoryType(memoryType);
  setMemoryType(memoryType);
  initializeProcessQueue();
  setLocalMemory(getMemoryFromLocalStorage());
};

const handleAlgorithmChange = (event) => {
  const algorithmType = event.target.value;
  setLocalAlgorithmType(algorithmType);
  setAlgorithmType(algorithmType);
  setLocalAlgorithmType(getAlgorithmTypeFromLocalStorage());
};

const handleCompactChange = (event) => {
  const compact = event.target.checked;
  setLocalIsCompact(compact);
  setCompactMode(compact);
  setLocalIsCompact(getIsCompactFromLocalStorage());
};

const handleRemoveProcess = (processId) => {
  addProcessToProcessQueue(processId);
  removeProcess(processId);
  if (isCompact) {
    compactMemory();
  }
  setLocalMemory(getMemoryFromLocalStorage());
};

const handleAddPartition = () => {
  const size = parseInt(partitionSize, 10);
  if (!isNaN(size) && size > 0) {
    addPartition(size);
    setPartitionSize('');
  } else {
    alert('Ingrese un tamaño válido para la partición.');
  }
};

const handleRemovePartition = (index) => {
  if (memoryType === 'Estática Personalizada' || memoryType === 'Dinamica') {
    removePartition(index);
    const updatedMemory = getMemoryFromLocalStorage();
    setLocalMemory(Array.isArray(updatedMemory) ? updatedMemory : []);
  }
};

return (
  <section className="memory-container">
    <header className="memory-header">
      <h2>Gestión de Memoria</h2>
      <div className="memory-info">
        <span>Memoria total Libre: {calculateTotalFreeMemory()} KB</span>
        <span>Memoria total Desperdiciada: {calculateTotalWastedMemory()}</span>
      </div>
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
        <select className="select-memory-type" onChange={handleMemoryTypeChange} value={getMemoryTypeFromLocalStorage()}>
          {MEMORY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select className="select-algorithm-type" onChange={handleAlgorithmChange} value={getAlgorithmTypeFromLocalStorage()}>
          <option value="Primer ajuste">Primer ajuste</option>
          <option value="Mejor ajuste">Mejor ajuste</option>
          <option value="Peor ajuste">Peor ajuste</option>
        </select>
      </div>
    </header>
    <div className="memory-visualization-container">
      <canvas ref={chartRef} className='chart' style={{ width: '100%', height: '400px' }}></canvas>
      <div className="blocks-wrapper">
        {localMemory.map((block, index) => (
          <div key={index} className={`memory-block `}>
            <span className={`memory-status ${(memoryType === 'Estática Personalizada' && 'custom-memory')} ${block.name ? 'memory-block-with-process' : ''}`}>
              {block.name ? (
                <p>{block.name}, Tamaño: {block.memory} KB</p>
              ) : (
                <p>Espacio Libre: {block.size} KB</p>
              )}
            </span>
            {block.id && (
              <button className="remove-btn" onClick={() => handleRemoveProcess(block.id)}>
                X
              </button>
            )}
            {((memoryType === 'Estática Personalizada' || memoryType === 'Dinamica') && !block.id) && (
              <button className="remove-partition-btn" onClick={() => handleRemovePartition(index)}>
                Remove Partition
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    {memoryType === 'Estática Personalizada' && (
      <div className="custom-partition-creator">
        <input
          type="number"
          className="memory-input"
          placeholder="Tamaño de la partición en KB"
          value={partitionSize}
          onChange={(e) => setPartitionSize(e.target.value)}
        />
        <button className="btn-memory-input" onClick={handleAddPartition}>
          Agregar Partición
        </button>
      </div>
    )}
  </section>
);
}

export default Memory;
