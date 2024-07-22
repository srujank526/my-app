import AuctionScreen from "./AuctionScreen";
import './AuctionTable.css'
function AuctionTable({ socket,users }) {
    console.log(users)
    return (
        <>
            <AuctionScreen socket={socket} />
            <div className="usersFloor">
                {users.map((user) => (
                    <div key={user.socket}>
                        {user.name}
                        {socket.id === user.socket?<button>BID</button>:''}
                    </div>
                ))}
            </div>
        </>
    )
}
export default AuctionTable;