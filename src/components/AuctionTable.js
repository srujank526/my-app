// import { useState } from "react"
import './AuctionTable.css'
export default function AuctionTable({ users, socket, toBidAmount, showBidButton }) {

    const handleBid = () => {
        socket.emit('bidPlaced', { socketId: socket.id, amount: toBidAmount })
    }
    return (<>
        <div className="usersFloor">
            {users.map((user) => (
                <div key={user.socketId}>
                    {user.name}<br />
                    purse left: {users.map((obj) =>
                        obj.socketId === user.socketId &&
                        <span key={obj.socketId}>{obj.purse}</span>
                    )}
                    <br />
                    {(socket.id === user.socketId && showBidButton) ? <button onClick={handleBid}>BID {toBidAmount}L</button> : ''}
                    <ol>
                        {users.map((obj) =>
                            obj.socketId === user.socketId &&
                            obj.playersBought.map((player) => (
                                <li key={player.name}>{player.name}</li>
                            ))
                        )}
                    </ol>
                </div>
            ))}
        </div>
    </>)
}