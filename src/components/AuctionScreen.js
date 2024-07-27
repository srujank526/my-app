
import { useState, useEffect } from 'react'
import './AuctionScreen.css'
import SkipModal from './SkipModal'
export default function AuctionScreen({ socket, users, currSet, showSetButton, currPlayer, currBidWith, isPlayerSold, isGameEnd, showPlayerButton, showSkipPlayerButton }) {
    const [showSellButton, setShowSellButton] = useState(!isPlayerSold)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        setShowSellButton(!isPlayerSold)
    }, [isPlayerSold])

    const getSet = () => {
        socket.emit('reqSet')
    }
    const getPlayer = () => {
        socket.emit('reqPlayer')
    }
    const skipPlayer = () => {
        setIsModalOpen(true)
    }
    const handleCloseModal = (toGetPlayer) => {
        console.log(toGetPlayer)
        if (toGetPlayer) getPlayer()
        setIsModalOpen(false)
    }
    const handleSellPLayerButton = () => {
        setShowSellButton(false)
        socket.emit('sell-player', { socketId: currBidWith.socketId, playerObj: currPlayer, bidAmount: currBidWith.amount })
        socket.emit('req-players-sold-details')
    }
    return (<>
        {isGameEnd ? <h1>End of Auction....<br /> Thank you for playing</h1> :
            <div className='screen'>
                {currPlayer ? <SkipModal isOpen={isModalOpen} handleCloseModal={handleCloseModal}>
                    <h3>Are you sure want to skip {currPlayer.name || ''}?</h3>
                </SkipModal> : ''}
                <h3>Current Set: {showSetButton ? 'Draw a Set...' : currSet}</h3>
                {currPlayer ? <div>
                    <h3>Current Player: {currPlayer.name}</h3>
                    <h4>Base Price: {currPlayer.basePrice}L</h4>
                </div> : ''}
                {currBidWith.name ? <h4>Current Bid is with: {currBidWith.name} at {currBidWith.amount}L</h4> : ''}
                {users.map((user) => (
                    user.socketId === socket.id && user.isAdmin ? (
                        <div key={user.socketId}>
                            {showSetButton ? <button onClick={getSet}>get Set</button> : ''}
                            {showPlayerButton ? <button onClick={getPlayer}>get player</button> : ''}
                            {showSkipPlayerButton ? <button onClick={skipPlayer}>skip player</button> : ''}
                            {showSellButton ? <button onClick={handleSellPLayerButton}>sell player</button> : ''}
                        </div>
                    ) : null
                ))}
            </div>}
    </>)
}