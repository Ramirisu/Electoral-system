import './App.css';
import { ElectoralSystem } from './component/ElectoralSystem';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Electoral Systems</h1>
      </header>
      <ElectoralSystem />
    </div>
  );
}

export default App;
