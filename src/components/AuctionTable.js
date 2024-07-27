import { useState } from "react"
import './AuctionTable.css'
import PlayinfElevenModal from './PlayingElevenModal'
export default function AuctionTable({ users, socket, toBidAmount, showBidButton }) {

    const [isModalOpen,setIsModalOpen] = useState(false)

    const handleBid = () => {
        socket.emit('bidPlaced', { socketId: socket.id, amount: toBidAmount })
    }
    const handleModalClose = ()=>{
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
                    <button onClick={()=>setIsModalOpen(true)}>Create Playing XI</button>
                    <PlayinfElevenModal isOpen={isModalOpen} socket={socket} users={users} handleModalClose={handleModalClose}></PlayinfElevenModal>
                </div>
            ))}
        </div>
    </>)
}