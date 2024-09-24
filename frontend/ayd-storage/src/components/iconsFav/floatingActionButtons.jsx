import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { FaDatabase, FaTrashAlt } from 'react-icons/fa';
import ModalChangeStorageRequest from '../Modals/ModalChangeStorageRquest';
import Swal from 'sweetalert2';

import '../../styles/floatingActionButtons.css';

const FloatingActionButtons = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openModal = (modal) => {
        setActiveModal(modal);
    };

    const closeModal = () => {
        setActiveModal(null);
    }

    const handleSubmit = (formData) => {
        //console.log(formData);
    }

    async function deleteAccountRequest(email_) {

        var userData = JSON.parse(localStorage.getItem('USUARIO'));

        try {

            const response = await fetch(`${process.env.FRONT_URL}/deleteAccountRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userData.EMAIL })
            });

            const data = await response.json();

            if (data.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Email not found!',
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Email sent!',
                    text: 'Check your email to confirm the deletion of your account',
                    showConfirmButton: false,
                });
            }

        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error);
        }
    }

    const handleDeleteAccount = () => {

       
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAccountRequest();
            }
        });
    };

    return (
        <div className="fab-container" ref={buttonRef}>
            <button className="fab-main" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaPlus />}
            </button>
            {isOpen && (
                <div className="fab-menu">
                    <button onClick={() => openModal('change-storage')} title='Change storage' className="fab-item fab-change-storage">
                        <FaDatabase />
                    </button>
                    <button onClick={handleDeleteAccount} title="Delete account" className="fab-item fab-delete-account">
                            <FaTrashAlt />
                    </button>
                </div>
            )}
            {activeModal === 'change-storage' && (
                <ModalChangeStorageRequest 
                    open={activeModal === 'change-storage'} //asi se pasa el prop para la modal :D
                    onClose={closeModal}
                    handleClose={closeModal}
                    handleSubmit={handleSubmit} />  
            )}
        </div>
    );
};

export default FloatingActionButtons;