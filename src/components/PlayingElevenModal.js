import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { closestCorners, DndContext } from '@dnd-kit/core'
import DraggablePlayingXI from './DraggablePlayingXI';
import { arrayMove } from '@dnd-kit/sortable';

export default function PlayingElevenModal({ isOpen, socket, users, handleModalClose }) {
    const [step, setStep] = useState(0)
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [playersWithId, setPlayersWithId] = useState([]);

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };
    const modalContentStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '4px'
    };

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
            let tempArr = selectedPlayers.map((player, id) => ({ id: id, name: player }))
            setPlayersWithId(() => tempArr)
        }
        else {
            const arr = playersWithId.map(({id,name})=>name)
            socket.emit('reqUpdatePlayingXI', { socketId: socket.id,selectedPlayers: arr })
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
    const getPlayerPosition = (id)=> playersWithId.findIndex(player=>player.id===id)
    const handleDragEnd =(event)=>{
        const {active,over} = event

        if(active.id === over.id)return
        setPlayersWithId(()=>{
            const originalPosition = getPlayerPosition(active.id)
            const newPosition = getPlayerPosition(over.id)
            const newPlayerPositionArray = arrayMove(playersWithId,originalPosition,newPosition)
            setPlayersWithId(newPlayerPositionArray)
            return newPlayerPositionArray
        })
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={modalStyle}>

            <div style={{ 'display': step === 0 ? 'block' : 'none' }}>
                {players.length !== 0 ? (
                    <div style={modalContentStyle}>
                        {players.map(player => (
                            <div key={player.name}>
                                <input
                                    type="checkbox"
                                    id={player.name}
                                    name={player.name}
                                    value={player.name}
                                    checked={selectedPlayers.includes(player.name)}
                                    onChange={() => handleCheckboxChange(player.name)}
                                    disabled={!selectedPlayers.includes(player.name) && selectedPlayers.length >= 11}
                                />
                                <label htmlFor={player.name}> {player.name}</label>
                            </div>
                        ))}
                    </div>
                ) : ''}
                <div>
                    <button onClick={handleNext}>Next</button>
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>

            <div style={{ 'display': step === 1 ? 'block' : 'none' }}>
                <div style={modalContentStyle}>
                    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                        <DraggablePlayingXI players = {playersWithId}/>
                    </DndContext>
                    <div>
                        <button onClick={handleNext}>Apply</button>
                        <button onClick={handleClose}>Back</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
