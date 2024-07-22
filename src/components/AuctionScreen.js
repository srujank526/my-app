import './AuctionScreen.css'
import React,{useState} from 'react'


function AuctionScreen({socket}){

    const [currSet,setCurrSet] = useState('')
    const [currPlayer,setCurrPlayer] = useState('')

    function getSet(){
        socket.emit('reqSet')
        socket.on('resSet',(data)=>{
            setCurrSet(data)
        })
    }
    function getPlayer(){
        socket.emit('reqPlayer')
        socket.on('resPlayer',(data)=>{
            setCurrPlayer(data)
        })
    }
    
    return (
        <div className='screen'>
            Current Set: {currSet}
            {currPlayer?`Current Player: ${currPlayer.name}`:''}
            {currPlayer?'':<button onClick={getSet}>get Set</button>}
            <button onClick={getPlayer} disabled={!currSet}>get player</button>
        </div>
    );
}
export default AuctionScreen;