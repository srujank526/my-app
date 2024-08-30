import { useState, useEffect } from "react"
import './AuctionTable.css'
import PlayingElevenModal from './PlayingElevenModal'
import { Container,ButtonGroup,Card, Button } from 'react-bootstrap';

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
    <div className="usersFloor mt-3">
      {users.map((user) => (
        <Card key={user.socketId} className="user-info-card">
          <Card.Body>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-purse">
                Purse Left: <span>{user.purse}L</span>
              </div>
            </div>

            <Container className="d-flex justify-content-center align-items-start" >
              <ButtonGroup vertical>
                {(socket.id === user.socketId && showBidButton) && (
                  <Button variant="primary" onClick={handleBid} className="mb-2">
                    BID {toBidAmount}L
                  </Button>
                )}
                {socket.id === user.socketId && (
                  <Button variant="success" onClick={() => setIsModalOpen(true)}>
                    Update Playing XI
                  </Button>
                )}
              </ButtonGroup>
            </Container>

            <PlayingElevenModal
              isOpen={isModalOpen}
              socket={socket}
              users={users}
              handleModalClose={handleModalClose}
            />

            <div className="playing-xi">
              <h4>Playing XI:</h4>
              <ol>
                {user.playingXI.map(player => (
                  <li key={player}>{player}</li>
                ))}
              </ol>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>

  </>)
}