import React, { useState,useEffect } from "react";
import AuctionScreen from "./AuctionScreen";
import './AuctionTable.css'
function AuctionTable({ socket, users }) {
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [toBidAmount, setToBidAmount] = useState('')
    const [showBidButton, setShowBidButton] = useState(true)
    const [playersBoughtData, setPlayersBoughtData] = useState(users)
    const [isPlayerSold, setIsPlayerSold] = useState(true)

    useEffect(()=>{
        setPlayersBoughtData(users)
    },[users])

    socket.on('currentBid', (data) => {
        if (data.user === null) setToBidAmount(data.bidAmount)
        else {
            setToBidAmount(() => data.bidAmount + 20)
        }
    })
    socket.on('resBidPlaced', (data) => {
        if (data.socketId === socket.id) {
            setShowBidButton(false)
        }
        else setShowBidButton(true)
        let nextBidAmount = 0
        if (data.amount < 200) nextBidAmount = data.amount + 10
        else if (data.amount < 1000) nextBidAmount = data.amount + 20
        else nextBidAmount = data.amount + 25
        setToBidAmount(nextBidAmount)
        setIsPlayerSold(false)
    })
    socket.on('res-players-sold-details', (data) => {
        setPlayersBoughtData([...data])
        console.log("isPlayerSold is setted to true")
        setIsPlayerSold(true)
        setShowBidButton(false)
    })


    const handleGameEnd = (isGameEnd) => {
        setIsGameEnd(isGameEnd)
    }
    const handleBid = () => {
        socket.emit('bidPlaced', { socketId: socket.id, amount: toBidAmount })
    }
    const handleSellPlayer = (socketId, playerObj, bidAmount) => {
        socket.emit('sell-player', { socketId, playerObj, bidAmount })
        socket.emit('req-players-sold-details')
    }
    const handleShowBidButton = (flag) => {
        setShowBidButton(flag);
    }

    return (
        <>
            <AuctionScreen users={users} socket={socket} isGameEnd={isGameEnd} isPlayerSold={isPlayerSold} handleGameEnd={handleGameEnd} handleSellPlayer={handleSellPlayer} handleShowBidButton={handleShowBidButton} />
            <div className="usersFloor">
                {users.map((user) => (
                    <div key={user.socketId}>
                        {user.name}<br/>
                        purse left: {playersBoughtData.map((obj) =>
                                obj.socketId === user.socketId &&
                                <span key={obj.socketId}>{obj.purse}</span>
                            )}
                            <br/>
                        {(socket.id === user.socketId && !isGameEnd && showBidButton) ? <button onClick={handleBid}>BID {toBidAmount}L</button> : ''}
                        <ol>
                            {playersBoughtData.map((obj) =>
                                obj.socketId === user.socketId &&
                                obj.playersBought.map((player) => (
                                    <li key={player.name}>{player.name}</li>
                                ))
                            )}
                        </ol>

                    </div>
                ))}
            </div>
        </>
    )
}
export default AuctionTable;