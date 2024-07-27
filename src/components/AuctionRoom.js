import React, { useState, useEffect } from "react";
import AuctionTable from "./AuctionTable";
import AuctionScreen from "./AuctionScreen";

export default function AuctionRoom({ socket, users }) {
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [toBidAmount, setToBidAmount] = useState('')
    const [showBidButton, setShowBidButton] = useState(true)
    const [isPlayerSold, setIsPlayerSold] = useState(true)
    const [newUsersData, setNewUsersData] = useState([...users])
    //screen hooks
    const [currSet, setCurrSet] = useState('')
    const [showSetButton, setshowSetButton] = useState(true)
    const [currPlayer, setCurrPlayer] = useState('')
    const [currBidWith, setCurrBidWith] = useState({})

    useEffect(() => {
        setNewUsersData([...users]);
    }, [users]);


    //table listners
    socket.on('currentBid', (data) => {
        if (data.user === null) setToBidAmount(data.bidAmount)
        else {
            setToBidAmount(() => data.bidAmount + 20)
        }
    })
    socket.on('resBidPlaced', (data) => {
        if (data.socketId === socket.id) {
            setShowBidButton(false)
        }
        else setShowBidButton(true)
        let nextBidAmount = 0
        if (data.amount < 200) nextBidAmount = data.amount + 10
        else if (data.amount < 1000) nextBidAmount = data.amount + 20
        else nextBidAmount = data.amount + 25
        setToBidAmount(nextBidAmount)
        setIsPlayerSold(false)

        let person = users.filter((user) => user.socketId === data.socketId)
        if (person.length !== 0) {
            let obj = { name: person[0].name, amount: data.amount, socketId: data.socketId }
            setCurrBidWith(obj)
        }
    })
    socket.on('res-players-sold-details', (data) => {
        console.log(data)
        setNewUsersData([...data])
        setIsPlayerSold(true)
        setShowBidButton(false)
        setCurrBidWith({})
    })

    //screen listners
    socket.on('resSet', (data) => {
        setshowSetButton(false)
        setCurrSet(data)
        if (data === null) {
            setIsGameEnd(true)
        }
    })
    socket.on('resPlayer', (data) => {
        setCurrBidWith({})
        setCurrPlayer(data)
        if (data === null) setshowSetButton(true)
        else setShowBidButton(true)
    })

    return (
        <>
            <h1>new implementation</h1>
            <AuctionScreen socket={socket} users={newUsersData} currSet={currSet} showSetButton={showSetButton} currPlayer={currPlayer} currBidWith={currBidWith} isPlayerSold={isPlayerSold} isGameEnd={isGameEnd} />
            <AuctionTable socket={socket} users={newUsersData} toBidAmount={toBidAmount} showBidButton={showBidButton} />
        </>
    )
}