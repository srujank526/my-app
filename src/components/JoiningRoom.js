import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import './JoiningRoom.css'


function JoiningRoom({ handleJoinRoom }) {
    const nameRef = useRef('')
    const roomRef = useRef('')
    const handleSubmit = (e) => {
        e.preventDefault()
        handleJoinRoom(nameRef.current.firstChild.value, roomRef.current.firstChild.value);
    }
    return (
        <div className='container' >
            <Form className='form'>
                <FloatingLabel
                    controlId="floatingInput"
                    label="user name"
                    className="mb-3"
                    ref={nameRef}
                >
                    <Form.Control type="text" placeholder="name" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="room Id"
                    className="mb-3"
                    ref={roomRef}
                >
                    <Form.Control type="text" placeholder="name" />
                </FloatingLabel>
                <Button type="submit" onClick={handleSubmit}>Create/Join</Button>
            </Form>
        </div>
    )
}
export default JoiningRoom;