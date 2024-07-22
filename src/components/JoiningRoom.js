import React, {useRef} from 'react'


function JoiningRoom({handleJoinRoom}) {
    const nameRef = useRef('')
    const roomRef = useRef('')
    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(nameRef.current)
        handleJoinRoom(nameRef.current.value,roomRef.current.value);
    }
    return (
        <form>
            <label htmlFor="name">user name</label>
            <input
                ref={nameRef}
                type="text"
                id="name"
                placeholder="enter user name"
                required
                
            />
            <label htmlFor="roomId">room id</label>
            <input
                ref = {roomRef}
                type="text"
                id="roomId"
                placeholder="enter room Id"
                required
                
            />
            <button type="submit" onClick={handleSubmit}>Create/Join</button>
        </form>
    )
}
export default JoiningRoom;