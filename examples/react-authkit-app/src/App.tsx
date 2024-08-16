import { useConnect } from '@particle-network/authkit';
import './App.css';

function App() {
  const { connect } = useConnect();
  return (
    <div className="App">
      <button onClick={() => connect()}>Connect</button>
    </div>
  );
}

export default App;
