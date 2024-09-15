import { useState, useEffect, useRef } from 'react';
import { MEMORY_TYPES } from '../data/constants';
import { Chart } from 'chart.js/auto'; // Import Chart.js con todas sus dependencias
import MemoryBlockModal from './MemoryBlockModal';

// Imports for localStorage functions
import {
  getMemoryFromLocalStorage,
} from '../logic/LocalStorage/memory';
import {
  getAlgorithmTypeFromLocalStorage,
  getIsCompactFromLocalStorage,
  getMemoryTypeFromLocalStorage,
} from '../logic/LocalStorage/memoryControls';

// Imports for MemoryMangment functions
import {
  getAlgorithmType, getIsCompact, getMemoryType, initializeMemoryAndQueue, initializeProcessQueue,
  setAlgorithmType, setCompactMode, setMemoryType
} from '../logic/MemoryManagment/initialiceMemory';
import { removeProcess } from '../logic/MemoryManagment/memoryManipulation';
import { addPartition, removePartition } from '../logic/MemoryManagment/partitionManagment';
import { calculateTotalFreeMemory, calculateTotalWastedMemory, getMemoryIndex } from '../logic/MemoryManagment/memoryCalculations';
import { compactMemory } from '../logic/MemoryManagment/memoryManipulation';

function Memory() {
  const [localMemory, setLocalMemory] = useState([]);
  const [memoryType, setLocalMemoryType] = useState(getMemoryType());
  // eslint-disable-next-line no-unused-vars
  const [algorithmType, setLocalAlgorithmType] = useState(getAlgorithmType());
  // eslint-disable-next-line no-unused-vars
  const [isCompact, setLocalIsCompact] = useState(getIsCompact());
  // eslint-disable-next-line no-unused-vars
  const [selectedBlock, setSelectedBlock] = useState(null); // Estado para el bloque seleccionado
  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [partitionSize, setPartitionSize] = useState('');

  // Referencias para el Chart
  const chartRef = useRef(null);
  let myChart = useRef(null); // To store the chart instance

  // Inicializar el estado local con los valores de localStorage
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

  // Montaje del grafico con Chart.js
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
  
      // Crear datasets para cada bloque de memoria, dividiendo entre memoria usada y libre
      const datasets = localMemory.flatMap((block, index) => {
        const { startAddress, endAddress } = getMemoryIndex(index);
  
        // Dataset para la memoria usada (solo si hay un proceso)
        const usedDataset = {
          label: `Memoria Usada (${startAddress} - ${endAddress})`,
          data: [block.memory || 0], // Memoria usada por el proceso
          backgroundColor: '#ff4444', // Rojo para la memoria usada
          borderColor: '#000000',
          borderWidth: 2,
          borderSkipped: (block.size === block.memory) ? false : // Borde completo si el bloque esta lleno
          (block.size > block.memory) ? 'top' : false, // Borde superior si tiene espacio
          borderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
          stack: `memoryStack`,
          tooltipInfo: `Proceso: ${block.name}\nMemoria Usada: ${block.memory || 0} KB\nDirección: ${startAddress} - ${endAddress}`,
        };
  
        // Dataset para la memoria libre
        const freeDataset = {
          label: `Memoria Libre (${startAddress} - ${endAddress})`,
          data: [block.size - (block.memory || 0)], // Espacio libre en la partición
          backgroundColor: '#4FC3F7', // Azul para la memoria libre
          borderColor: '#000000',
          borderWidth: 2,
          borderSkipped: (block.size === block.memory) ? false : // Borde completo si el bloque esta lleno
          (block.memory === null) ? false : // Borde completo si el bloque esta vacío
          (block.size > block.memory) ? 'bottom' : false, // Borde completo si está lleno, solo borde inferior si tiene espacio
          borderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
          stack: `memoryStack`,
          tooltipInfo: `Memoria Libre: ${block.size - (block.memory || 0)} KB\nDirección: ${startAddress} - ${endAddress}`,
        };
  
        // Retorna ambos datasets (usado y libre) para cada bloque
        return [usedDataset, freeDataset];
      });
  
      myChart.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Memoria'], // Solo una etiqueta para toda la barra
          datasets: datasets, // Todos los bloques se muestran apilados
        },
        options: {
          indexAxis: 'x', // Mantiene la orientación vertical
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
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
              callbacks: {
                // Personaliza el contenido del tooltip
                label: function (tooltipItem) {
                  const dataset = tooltipItem.dataset; // Obtiene el dataset actual
                  // Muestra la información personalizada definida en tooltipInfo
                  return dataset.tooltipInfo || tooltipItem.label;
                },
              },
            },
            legend: {
              position: 'right',
              align: 'space-around',
              labels: {
                boxWidth: 20,
                padding: 20,
                usePointStyle: true,
                color: '#e0e0e0',
                font: {
                  size: 12,
                },
                filter: function (item) {
                  // Filtrar para mostrar solo las direcciones de memoria
                  return !item.text.includes('Memoria Usada') && !item.text.includes('Memoria Libre');
                },
                generateLabels: function (chart) {
                  // Filtra y muestra solo las direcciones únicas
                  const uniqueLabels = [];
                  chart.data.datasets.forEach((dataset) => {
                    if (!uniqueLabels.includes(dataset.label)) {
                      uniqueLabels.push(dataset.label);
                    }
                  });
                  return uniqueLabels.map((label) => ({
                    text: label, // Mostrar solo las direcciones de memoria
                    fillStyle: '#4FC3F7',
                    hidden: false,
                    lineCap: 'butt',
                    lineDash: [],
                    lineDashOffset: 0,
                    lineJoin: 'miter',
                    pointStyle: 'circle',
                  }));
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
                  size: 12,
                },
                beginAtZero: true,
                callback: (value) => `${value} KB`,
              },
              grid: {
                display: true,
                color: '#444',
              },
              barPercentage: 0.9,
              categoryPercentage: 0.8,
            },
            y: {
              stacked: true,
              ticks: { display: false },
              grid: { display: true },
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
  

  // Funcion para actualizar el chart
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
    setCompactMode(false);
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
    if (getIsCompactFromLocalStorage()) {
      compactMemory();
    }
    compactMemory();
  };

  const handleRemoveProcess = (index) => {
    removeProcess(index);
    if (getIsCompactFromLocalStorage()) {
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
    if (getMemoryTypeFromLocalStorage() === 'Variable Personalizada') {
      removePartition(index);
      const updatedMemory = getMemoryFromLocalStorage();
      setLocalMemory(Array.isArray(updatedMemory) ? updatedMemory : []);
    }
  };

  const handleBlockClick = (index) => {
    setSelectedBlock(index);
    setShowModal(true);
  };

  return (
    <section className="memory-container">
      <header className="memory-header">
        <h2>Gestión de Memoria</h2>
        <div className="memory-info">
          <span>Memoria total Libre: {calculateTotalFreeMemory()} KB</span>
          <span>Memoria total Desperdiciada: {calculateTotalWastedMemory()} KB</span>
        </div>
        <div className="memory-controls">
          {getMemoryTypeFromLocalStorage() === 'Dinamica' && (
            <label className="compact-checkbox">
              <input
                type="checkbox"
                className="checkbox"
                onChange={handleCompactChange}
                checked={getIsCompactFromLocalStorage()}
              />
              Compactar Memoria
            </label>
          )}
          <select className="select-memory-type" onChange={handleMemoryTypeChange} value={getMemoryTypeFromLocalStorage()}>
            {MEMORY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {getMemoryTypeFromLocalStorage() !== 'Estática (16x1MB)' && (
            <select className="select-algorithm-type" onChange={handleAlgorithmChange} value={getAlgorithmTypeFromLocalStorage()}>
              <option value="Primer ajuste">Primer ajuste</option>
              <option value="Mejor ajuste">Mejor ajuste</option>
              <option value="Peor ajuste">Peor ajuste</option>
            </select>
          )}
        </div>
      </header>
      <div className={`memory-visualization-container ${(memoryType === 'Variable Personalizada') ? 'memory-visualization-container-height' : ''}`}>
        <canvas ref={chartRef} className="chart"></canvas>
        <div className="blocks-wrapper">
          {localMemory.map((block, index) => (
            <div
              key={index}
              className={`memory-block`}
              onClick={() => handleBlockClick(index)} // Abre el modal al hacer clic en el bloque
            >
              <span
                className={`memory-status ${block.process ? 'memory-block-with-process' : ''}`}
              >
                {block.process === null ? (
                  <p>Libre: {block.size} KB</p>
                ) : (
                  <p>{`${block.name}, Tamaño: ${block.memory} KB`}</p>
                )}
              </span>
              {(block.id && block.name !== 'SO') && (
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevenir que el clic abra el modal
                    handleRemoveProcess(index);
                  }}
                >
                  X
                </button>
              )}
              {((memoryType === 'Variable Personalizada') && block.name === 'Libre') && (
                <button
                  className="remove-partition-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePartition(index);
                  }}
                >
                  X Particion
                </button>
              )}
            </div>
          ))}
          <MemoryBlockModal
            show={showModal}
            index={selectedBlock}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
      {getMemoryTypeFromLocalStorage() === 'Variable Personalizada' && (
        <div className="custom-partition-creator">
          <input
            type="number"
            className="memory-input"
            placeholder="Tamaño de la partición en KB"
            value={partitionSize}
            onChange={(e) => setPartitionSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddPartition();
              }
            }}
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
