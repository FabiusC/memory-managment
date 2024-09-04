import Memory from './components/Memory';
import ProcessList from './components/ProcessList';

function App() {

  return (
    <div className="container">
      <ProcessList />
      <Memory />
    </div>
  );
}

ProcessList.propTypes = {};
Memory.propTypes = {};

export default App;
