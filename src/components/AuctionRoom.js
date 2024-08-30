import React, { useState, useEffect } from "react";
import AuctionTable from "./AuctionTable";
import AuctionScreen from "./AuctionScreen";

export default function AuctionRoom({ socket, users }) {
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [toBidAmount, setToBidAmount] = useState('')
    const [showBidButton, setShowBidButton] = useState(false)
    const [isPlayerSold, setIsPlayerSold] = useState(true)
    const [newUsersData, setNewUsersData] = useState([...users])
    //screen hooks
    const [currSet, setCurrSet] = useState('')
    const [showSetButton, setshowSetButton] = useState(true)
    const [showPlayerButton, setshowPlayerButton] = useState(false)
    const [showSkipPlayerButton, setshowSkipPlayerButton] = useState(false)
    const [currPlayer, setCurrPlayer] = useState('')
    const [currBidWith, setCurrBidWith] = useState({})
    const [biddingState, setBiddingState] = useState(0) 
    //0 -> null,1 -> no bids yet, 2->bidding going on 3 -> player sold 4 -> unsold

    useEffect(() => {
        setNewUsersData([...users]);
    }, [users]);

    const handlePlayerSkip = ()=>{
        setBiddingState(4)
        setshowPlayerButton(true)
        setshowSkipPlayerButton(false)
        setShowBidButton(false)
    }
    //table listners
    socket.on('currentBid', (data) => {
        if (data.user === null) {
            setToBidAmount(data.bidAmount)
            setshowSkipPlayerButton(true)
            setshowPlayerButton(false)
        }
        else {
            setToBidAmount(() => data.bidAmount + 20)
        }
    })
    socket.on('resBidPlaced', (data) => {
        setBiddingState(2)
        setshowSkipPlayerButton(false)
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
        setshowPlayerButton(false)

        let person = users.filter((user) => user.socketId === data.socketId)
        if (person.length !== 0) {
            let obj = { name: person[0].name, amount: data.amount, socketId: data.socketId }
            setCurrBidWith(obj)
        }
    })
    socket.on('res-players-sold-details', (data) => {
        setBiddingState(3)
        // console.log(data)
        setNewUsersData([...data])
        setIsPlayerSold(true)
        setShowBidButton(false)
        setshowPlayerButton(true)
        setCurrBidWith({})
    })
    socket.on('resUpdatePLayingXI',(data)=>{
        setNewUsersData([...data])
    })

    //screen listners
    socket.on('resSet', (data) => {
        setshowSetButton(false)
        setCurrSet(data)
        if (data === null) {
            setIsGameEnd(true)
        }
        setshowPlayerButton(true)
    })
    socket.on('resPlayer', (data) => {
        setCurrBidWith({})
        setCurrPlayer(data)
        if (data === null) {
            setBiddingState(0)
            setshowSetButton(true)
            setshowPlayerButton(false)
            setShowBidButton(false)
            setshowSkipPlayerButton(false)
        }
        else {
            setBiddingState(1)
            setShowBidButton(true)
            setShowBidButton(true)
            setshowSkipPlayerButton(true)
        }
    })

    return (
        <>
            <AuctionScreen socket={socket} users={newUsersData} currSet={currSet} showSetButton={showSetButton} currPlayer={currPlayer} currBidWith={currBidWith} isPlayerSold={isPlayerSold} isGameEnd={isGameEnd} showPlayerButton={showPlayerButton} showSkipPlayerButton={showSkipPlayerButton} handlePlayerSkip={handlePlayerSkip} biddingState={biddingState}/>
            <AuctionTable socket={socket} users={newUsersData} toBidAmount={toBidAmount} showBidButton={showBidButton} />
        </>
    )
}