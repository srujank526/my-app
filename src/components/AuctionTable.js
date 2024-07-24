import React, { useState } from "react";
import AuctionScreen from "./AuctionScreen";
import './AuctionTable.css'
function AuctionTable({ socket, users }) {
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [toBidAmount, setToBidAmount] = useState('')
    const [showBidButton,setShowBidButton] = useState(true)


    socket.on('currentBid', (data) => {
        if (data.user === null) setToBidAmount(data.bidAmount)
        else {
            setToBidAmount(() => data.bidAmount + 20)
        }
    })
    socket.on('resBidPlaced',(data)=>{
        if(data.socketId === socket.id){
            setShowBidButton(false)
        }
        else setShowBidButton(true)
        let nextBidAmount = 0
        if(data.amount < 200) nextBidAmount = data.amount+10
        else if(data.amount<1000) nextBidAmount = data.amount+20
        else nextBidAmount = data.amount+25
        setToBidAmount(nextBidAmount)
    })
    socket.on('res-players-sold-details',(data)=>{
        console.log(data)
    })


    const handleGameEnd = (isGameEnd) => {
        setIsGameEnd(isGameEnd)
    }
    const handleBid = () => {
        socket.emit('bidPlaced', { socketId: socket.id, amount:toBidAmount })
    }
    const handleSellPlayer = (socketId,playerObj,bidAmount)=>{
        socket.emit('sell-player',{socketId,playerObj,bidAmount})
        socket.emit('req-players-sold-details')
    }

    return (
        <>
            <AuctionScreen users={users} socket={socket} isGameEnd={isGameEnd} handleGameEnd={handleGameEnd} handleSellPlayer={handleSellPlayer}/>
            <div className="usersFloor">
                {users.map((user) => (
                    <div key={user.socketId}>
                        {user.name}
                        {(socket.id === user.socketId && !isGameEnd && showBidButton) ? <button onClick={handleBid}>BID {toBidAmount}L</button> : ''}
                    </div>
                ))}
            </div>
        </>
    )
}
export default AuctionTable;