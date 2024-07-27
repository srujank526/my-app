import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function PlayingElevenModal({ isOpen, socket, users, handleModalClose }) {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

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

    const handleApply = () => {
        console.log('Selected players:', selectedPlayers);
        handleModalClose(selectedPlayers);
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={modalStyle}>
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
                <button onClick={handleApply}>Apply</button>
                <button onClick={() => handleModalClose(selectedPlayers)}>Close</button>
            </div>
        </div>,
        document.body
    );
}
