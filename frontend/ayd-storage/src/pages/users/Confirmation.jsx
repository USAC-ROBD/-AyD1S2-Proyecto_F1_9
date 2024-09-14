import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Confirmation() {
    const params = useParams()
    const navigate = useNavigate();

    const confirmation = async () => {
        try {
            const { id } = params

            const response = await fetch(`${process.env.REACT_APP_API_HOST}/confirmation?id=${id}`)

            if(!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Account confirmation failed!',
                    showConfirmButton: false,
                    timer: 2000
                });
                return
            }

            const data = await response.json()

            if(data.icon === 'success') {
                Swal.fire({
                    icon: data.icon,
                    title: data.message,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Account confirmation failed!',
                showConfirmButton: false,
                timer: 2000
            });
        }

        navigate('/')
    }

    useEffect(() => {
        confirmation()
    }, [])

    return <div/>
}