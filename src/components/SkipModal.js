import ReactDom from "react-dom";
function SkipModal({ isOpen, children, handleCloseModal }) {
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
    if (!isOpen) return null
    return ReactDom.createPortal(
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <div>{children}</div>
                <button onClick={() => handleCloseModal(true)}>Yes</button>
                <button onClick={() => handleCloseModal(false)}>No</button>
            </div>
        </div>
        , document.body)
}

export default SkipModal;