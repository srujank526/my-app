import React, { useState, useCallback } from 'react';
import './App.css';
import io from 'socket.io-client';
import JoiningRoom from './components/JoiningRoom';
import AuctionRoom from './components/AuctionRoom';

const prodUrl = "https://node-backend-92lw.onrender.com/"
// const local = "http://localhost:8080/"
const socket = io(prodUrl);


function App() {

  const [showAuctionRoom, setShowAuctionRoom] = useState(false)
  const [users, setUsers] = useState([])

  const joinRoom = useCallback((name, roomId) => {
    socket.emit("join-room", { name, roomId });
    socket.on('roomJoined', (users) => {
      setShowAuctionRoom(true)
      setUsers([...users])
    })
  }, [])

  return (
    <div className="App">
      <h1>Welcome to Auction Simulator</h1>
      {showAuctionRoom ? <AuctionRoom socket={socket} users={users} /> : <JoiningRoom handleJoinRoom={joinRoom} />}

    </div>
  );
}

export default App;
