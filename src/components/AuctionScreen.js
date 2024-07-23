import './AuctionScreen.css'
import React,{useState} from 'react'


function AuctionScreen({socket,isGameEnd,handleGameEnd}){

    const [currSet,setCurrSet] = useState('')
    const [showSetButton,setshowSetButton] = useState(true)
    const [currPlayer,setCurrPlayer] = useState('')

    function getSet(){
        setshowSetButton(false)
        socket.emit('reqSet')
        socket.on('resSet',(data)=>{
            setCurrSet(data)
            if(data === null){
                handleGameEnd(true)
            }
        })
    }
    function getPlayer(){
        socket.emit('reqPlayer')
        socket.on('resPlayer',(data)=>{
            setCurrPlayer(data)
            if(data === null)setshowSetButton(true)
        })
    }
    
    return (<>
        {isGameEnd?<h1>End of Auction....<br/> Thank you for playing</h1>:
        <div className='screen'>
            <div>Current Set: {showSetButton?'Draw a Set...':currSet}</div>
            {currPlayer?`Current Player: ${currPlayer.name}`:''}<br/>
            {showSetButton?<button onClick={getSet}>get Set</button>:<button onClick={getPlayer} disabled={!currSet}>get player</button>}
            
        </div>}
        </>
    );
}
export default AuctionScreen;