import './App.css';
import { ElectionMethod } from './component/ElectionMethod';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Legislative Election</h1>
      </header>
      <body>
        <ElectionMethod />
      </body>
    </div>
  );
}

export default App;
