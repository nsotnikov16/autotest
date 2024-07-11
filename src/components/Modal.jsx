import { useEffect, useState, createRef } from "react"

export default function Modal({ children, isOpen, setIsOpen }) {
    let popup = createRef();
    const handleOutsideClick = (e) => {
        if (popup.current && e.target === popup.current) setIsOpen(false);
    }

    return <div className={`popup ${isOpen ? 'popup_opened' : ''}`} onClick={handleOutsideClick} ref={popup}>
        <div className="popup__container">
            <div className="popup__content" >
                {children}
            </div>
            <button className="popup__close" onClick={() => setIsOpen(false)}><span>&#10006;</span></button>
        </div>
    </div>
}