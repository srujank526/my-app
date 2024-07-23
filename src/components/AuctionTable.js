import React,{useState} from "react";
import AuctionScreen from "./AuctionScreen";
import './AuctionTable.css'
function AuctionTable({ socket,users }) {
    const [isGameEnd,setIsGameEnd] = useState(false);
    function handleGameEnd(isGameEnd){
        setIsGameEnd(isGameEnd)
    }
    return (
        <>
            <AuctionScreen socket={socket} isGameEnd={isGameEnd} handleGameEnd={handleGameEnd}/>
            <div className="usersFloor">
                {users.map((user) => (
                    <div key={user.socket}>
                        {user.name}
                        {(socket.id === user.socket && !isGameEnd)?<button>BID</button>:''}
                    </div>
                ))}
            </div>
        </>
    )
}
export default AuctionTable;