import './AuctionScreen.css'
import React, { useState } from 'react'


function AuctionScreen({ users, socket, isGameEnd, handleGameEnd,handleSellPlayer }) {

    const [currSet, setCurrSet] = useState('')
    const [showSetButton, setshowSetButton] = useState(true)
    const [currPlayer, setCurrPlayer] = useState('')
    const [currBidWith, setCurrBidWith] = useState({})

    socket.on('resSet', (data) => {
        setshowSetButton(false)
        setCurrSet(data)
        if (data === null) {
            handleGameEnd(true)
        }
    })
    socket.on('resPlayer', (data) => {
        setCurrPlayer(data)
        if (data === null) setshowSetButton(true)
    })
    // socket.on('currentBid', (data) => {
    //     console.log("auction screen", data)
    // })
    socket.on('resBidPlaced', (data) => {
        let person = users.filter((user) => user.socketId === data.socketId)
        if (person.length !== 0) {
            let obj = { name: person[0].name, amount: data.amount }
            setCurrBidWith(obj)
        }

    })

    const getSet = () => {
        socket.emit('reqSet')
    }
    const getPlayer = () => {
        socket.emit('reqPlayer')
    }

    return (<>
        {isGameEnd ? <h1>End of Auction....<br /> Thank you for playing</h1> :
            <div className='screen'>
                <div>Current Set: {showSetButton ? 'Draw a Set...' : currSet}</div>
                {currPlayer ? <div>
                    <div>Current Player: {currPlayer.name}</div>
                    <div>Base Price: {currPlayer.basePrice}L</div>
                    <h2>Current Bid is with: {currBidWith.name} at {currBidWith.amount}L</h2>
                </div> : ''}
                {showSetButton ? <button onClick={getSet}>get Set</button> : <button onClick={getPlayer}>get player</button>}
                <button onClick={()=>handleSellPlayer(socket.id,currPlayer,currBidWith.amount)}>sell player</button>
            </div>}
    </>
    );
}
export default AuctionScreen;