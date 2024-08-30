import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { closestCorners, DndContext } from '@dnd-kit/core'
import DraggablePlayingXI from './DraggablePlayingXI';
import { arrayMove } from '@dnd-kit/sortable';
import { Modal, Button, Form } from 'react-bootstrap';

export default function PlayingElevenModal({ isOpen, socket, users, handleModalClose }) {
    const [step, setStep] = useState(0)
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [playersWithId, setPlayersWithId] = useState([]);

    // const modalStyle = {
    //     position: 'fixed',
    //     top: 0,
    //     left: 0,
    //     width: '100%',
    //     height: '100%',
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     zIndex: 1000
    // };
    // const modalContentStyle = {
    //     backgroundColor: 'white',
    //     padding: '20px',
    //     borderRadius: '4px'
    // };

    useEffect(() => {
        if (isOpen) {
            const currentUser = users.find(user => user.socketId === socket.id);
            if (currentUser) {
                setPlayers([...currentUser.playersBought]);
            }
        }
    }, [isOpen, socket.id, users]);

    const handleCheckboxChange = (playerName) => {
        setSelectedPlayers(prevSelectedPlayers => {
            if (prevSelectedPlayers.includes(playerName)) {
                return prevSelectedPlayers.filter(name => name !== playerName);
            } else {
                if (prevSelectedPlayers.length < 11) {
                    return [...prevSelectedPlayers, playerName];
                } else {
                    return prevSelectedPlayers;
                }
            }
        });
    };

    const handleNext = () => {
        if (step === 0) {
            setStep(1)
            let tempArr = selectedPlayers.map((player, id) => ({ id: id+1, name: player }))
            setPlayersWithId(() => tempArr)
        }
        else {
            const arr = playersWithId.map(({ id, name }) => name)
            socket.emit('reqUpdatePlayingXI', { socketId: socket.id, selectedPlayers: arr })
            setStep(0)
            handleModalClose(arr);
        }


    };
    const handleClose = () => {
        if (step === 0) handleModalClose(selectedPlayers);
        else {
            setStep(0)
        }
    }
    const getPlayerPosition = (id) => playersWithId.findIndex(player => player.id === id)
    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id === over.id) return
        setPlayersWithId(() => {
            const originalPosition = getPlayerPosition(active.id)
            const newPosition = getPlayerPosition(over.id)
            const newPlayerPositionArray = arrayMove(playersWithId, originalPosition, newPosition)
            setPlayersWithId(newPlayerPositionArray)
            return newPlayerPositionArray
        })
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div>
            <Modal show={step === 0} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Players</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {players.length > 0 ? (
                        <div>
                            {players.map(player => (
                                <Form.Check
                                    key={player.name}
                                    type="checkbox"
                                    id={player.name}
                                    label={player.name}
                                    checked={selectedPlayers.includes(player.name)}
                                    onChange={() => handleCheckboxChange(player.name)}
                                    disabled={!selectedPlayers.includes(player.name) && selectedPlayers.length >= 11}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No players available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleNext} disabled={players.length===0}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={step === 1} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Adjust Your Playing XI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                        <DraggablePlayingXI players={playersWithId} />
                    </DndContext>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>,
        document.body
    );
}
