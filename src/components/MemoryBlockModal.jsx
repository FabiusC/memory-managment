/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { getMemoryFromLocalStorage } from "../logic/LocalStorage/memory";
import { getProcessByIndex, getProcessIndex } from "../logic/MemoryManagment/getProcesses";
import { getMemoryIndex } from "../logic/MemoryManagment/memoryCalculations";

// Modal para mostrar la información del bloque de memoria
function MemoryBlockModal({ show, index, onClose }) {
    let block = getMemoryFromLocalStorage()[index]; // Obtener el bloque desde la memoria
    if (!show || !block) return null; // Retornar null si no se muestra o no hay bloque
    const { startAddress, endAddress } = getMemoryIndex(index); // Obtener los índices de memoria
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Información del Bloque de Memoria</h3>
                {block.image && (
                    <img
                        src={block.image}
                        alt={block.name}
                        className="process-image-modal"
                        style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                    />
                )}
                <p><strong>ID Proceso:</strong> {block.id || 'N/A'}</p>
                <p><strong>Nombre:</strong> {block.name || 'Libre'}</p>
                <p><strong>Tamaño Total:</strong> {block.size} KB</p>
                <p><strong>Memoria Usada:</strong> {block.memory || 0} KB</p>
                <p><strong>Indice Inicial:</strong> {startAddress} </p>
                <p><strong>Indice Final:</strong> {endAddress} </p>
                {(block.text !== undefined && block.process !== null) && (
                    <div className="process-memory-details">
                        <h4>Detalles de Memoria</h4>
                        <p><strong> .text:</strong> {block.text} KB</p>
                        <p><strong> .data:</strong> {block.data} KB</p>
                        <p><strong> .bss:</strong> {block.bss} KB</p>
                        <p><strong> .heap:</strong> {block.heap} KB</p>
                        <p><strong> .stack:</strong> {block.stack} KB</p>
                    </div>
                )}
                <button className="close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}
export default MemoryBlockModal;
