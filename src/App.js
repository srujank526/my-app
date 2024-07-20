import './App.css';
import io from 'socket.io-client';


function App() {
  async function callingApi() {
    console.log("started")
    let res = await fetch('https://node-backend-92lw.onrender.com/')
    let temp = await res.json()
    console.log(temp)
    const SOCKET_SERVER_URL = 'https://node-backend-92lw.onrender.com/';
    const socket = io(SOCKET_SERVER_URL);
    socket.on('connection', () => {
      console.log("connected to socket")
    })
    setTimeout(()=>{console.log(socket)},10000)
  }
  return (
    <div className="App">
      <h1>Hello World</h1>
      <h2>Srujan</h2>
      <button onClick={callingApi}>click me</button>
    </div>
  );
}

export default App;
