import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import JoiningRoom from './components/JoiningRoom';
import AuctionTable from './components/AuctionTable';

const prodUrl = "https://node-backend-92lw.onrender.com/"
// const local = "http://localhost:8080/"
const socket = io(prodUrl);


function App() {

  const [showAuctionTable, setShowAuctionTable] = useState(false)
  const [users, setUsers] = useState([])
  
  function joinRoom(name, roomId) {
    socket.emit("join-room", { name, roomId });
    socket.on('roomJoined', (users) => {
      setShowAuctionTable(true)
      setUsers([...users])
    })
  }

  return (
    <div className="App">
      <h1>Welcome to Auction Simulator</h1>
      {showAuctionTable ? <AuctionTable socket={socket} users={users} /> : <JoiningRoom handleJoinRoom={joinRoom} />}
    </div>
  );
}

export default App;
