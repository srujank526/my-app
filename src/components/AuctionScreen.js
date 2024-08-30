
import { useState, useEffect } from 'react'
import { Modal, Card, Button } from 'react-bootstrap'
export default function AuctionScreen({ socket, users, currSet, showSetButton, currPlayer, currBidWith, isPlayerSold, isGameEnd, showPlayerButton, showSkipPlayerButton, handlePlayerSkip }) {
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
        // console.log(toGetPlayer)
        if (toGetPlayer) handlePlayerSkip()
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
                {currPlayer ? <>
                    {currPlayer && (
                        <Modal show={isModalOpen} onHide={() => handleCloseModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Skip Player</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h4>Are you sure you want to skip {currPlayer.name || ''}?</h4>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => handleCloseModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={() => handleCloseModal(true)}>
                                    Skip Player
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}</> : ''}

                <Card style={{ height: '300px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
                    <Card.Body style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                        <div style={{ borderBottom: '2px solid #007bff', marginBottom: '10px', paddingBottom: '10px' }}>
                            <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                Current Set: {showSetButton ? 'Draw a Set...' : currSet}
                            </div>
                        </div>
                        {currPlayer && (
                            <div style={{ backgroundColor: '#e6ffe6', padding: '15px', borderRadius: '8px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }}>
                                <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.4rem' }}>
                                    Current Player: {currPlayer.name}
                                </div>
                                <div style={{ color: '#6c757d', fontSize: '1.2rem' }}>
                                    Base Price: {currPlayer.basePrice}L
                                </div>
                            </div>
                        )}
                        {currBidWith.name && (
                            <div style={{ backgroundColor: '#fff5e6', padding: '15px', borderRadius: '8px', marginBottom: '10px', animation: 'slideIn 0.5s ease-in' }}>
                                <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Current Bid is with: {currBidWith.name} at {currBidWith.amount}L
                                </div>
                            </div>
                        )}
                    </Card.Body>

                    <Card.Footer style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', borderTop: 'none' }}>
                        {users.map((user) =>
                            user.socketId === socket.id && user.isAdmin ? (
                                <div key={user.socketId}>
                                    {showSetButton && (
                                        <Button variant="primary" onClick={getSet}>
                                            Get Set
                                        </Button>
                                    )}
                                    {showPlayerButton && (
                                        <Button variant="success" onClick={getPlayer}>
                                            Get Player
                                        </Button>
                                    )}
                                    {showSkipPlayerButton && (
                                        <Button variant="danger" onClick={skipPlayer}>
                                            Skip Player
                                        </Button>
                                    )}
                                    {showSellButton && (
                                        <Button variant="warning" onClick={handleSellPLayerButton}>
                                            Sell Player
                                        </Button>
                                    )}
                                </div>
                            ) : null
                        )}
                    </Card.Footer>
                </Card>
            </div>}
    </>)
}