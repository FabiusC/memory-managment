import PropTypes from 'prop-types';

function ProcessList({ processList, addProcessToMemory, onReset }) {
  return (
    <section className="process-list-container">
      <header className="header">
        <div className="title">
          <h1>Procesos</h1>
        </div>
        <div className="controls-container">
          <button className="btn-reset" onClick={onReset}>Reiniciar LocalStorage</button> {/* Botón para reiniciar */}
        </div>
      </header>
      <ul className="processes-list">
        {Object.keys(processList).map((key) => {
          const process = processList[key];
          return (
            <li key={process.id} className="process-card">
              <div className="process">
                <img src={process.image} alt={process.id} className="process-image" />
                <div className="process-info">
                  <span className="process-id">{process.name}</span>
                  <span className="process-memory">{process.memory} KB</span>
                  <button className="btn" onClick={() => addProcessToMemory(process)}>
                    Abrir
                  </button>
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
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      memory: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  addProcessToMemory: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired, // Añade la validación del nuevo prop onReset
};

export default ProcessList;
