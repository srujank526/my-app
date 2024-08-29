import { useState, useEffect } from "react"
import './AuctionTable.css'
import PlayingElevenModal from './PlayingElevenModal'
export default function AuctionTable({ users, socket, toBidAmount, showBidButton }) {

    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        // console.log('users', users)
    }, [users])

    const handleBid = () => {
        socket.emit('bidPlaced', { socketId: socket.id, amount: toBidAmount })
    }
    const handleModalClose = (selectedPlayers) => {
        // console.log(selectedPlayers)
        setIsModalOpen(false)
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
                    {socket.id === user.socketId ? <button onClick={() => setIsModalOpen(true)}>Update Playing XI</button> : ''}
                    <PlayingElevenModal isOpen={isModalOpen} socket={socket} users={users} handleModalClose={handleModalClose}></PlayingElevenModal>
                     <ol>
                        {user.playingXI.map(player => {
                            return <li key={player}>{player}</li>
                        })}
                    </ol> 
                </div>
            ))}
        </div>
    </>)
}