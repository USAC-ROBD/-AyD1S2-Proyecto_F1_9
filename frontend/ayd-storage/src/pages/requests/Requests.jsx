import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@mui/material';

const Requests = () => {
    const [changeStorageRequests, setChangeStorageRequests] = useState([]);
    const [deleteAccountRequests, setDeleteAccountRequests] = useState([]);
    const [pageChangeStorage, setPageChangeStorage] = useState(0);
    const [rowsPerPageChangeStorage, setRowsPerPageChangeStorage] = useState(5);
    const [pageDeleteAccount, setPageDeleteAccount] = useState(0);
    const [rowsPerPageDeleteAccount, setRowsPerPageDeleteAccount] = useState(5);

    useEffect(() => {
        getRequests();
    }, []);

    const getRequests = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/getRequests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            // console.log(data.solicitudes_cambio_almacenamiento, data.solicitudes_eliminar_cuenta);
            setChangeStorageRequests(data.solicitudes_cambio_almacenamiento);

            console.log('SOLICITUDES', data.solicitudes_cambio_almacenamiento)

            setDeleteAccountRequests(data.solicitudes_eliminar_cuenta);

            if (data.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No requests found!',
                    showConfirmButton: false,
                });
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error("Error getting requests:", error);
        }
    };

    const handleChangePageChangeStorage = (event, newPage) => {
        setPageChangeStorage(newPage);
    };

    const handleChangeRowsPerPageChangeStorage = (event) => {
        setRowsPerPageChangeStorage(parseInt(event.target.value, 10));
        setPageChangeStorage(0);
    };

    const handleChangePageDeleteAccount = (event, newPage) => {
        setPageDeleteAccount(newPage);
    };

    const handleChangeRowsPerPageDeleteAccount = (event) => {
        setRowsPerPageDeleteAccount(parseInt(event.target.value, 10));
        setPageDeleteAccount(0);
    };

    const processChangeStorageRequest = async (id, state, accountId, packetId) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/processChangeStorageRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, state, accountId, packetId })
            });

            const data = await response.json();

            if (data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Storage change request updated successfully!',
                    showConfirmButton: false,
                });

                getRequests();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error updating storage change request!',
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error updating storage change request:", error);
        }
    };

    const processDeleteRequest = async (id, state) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/processDeleteRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, state })
            });

            const data = await response.json();

            if (data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Account deletion request updated successfully!',
                    showConfirmButton: false,
                });

                getRequests();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error updating account deletion request!',
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error updating account deletion request:", error);
        }
    };


    const handleApproveRequest = (requestId, typeRequest, status, accountId, packetId) => {

        if (typeRequest === 'changeStorage') {
            processChangeStorageRequest(requestId, status, accountId, packetId);
        } else {       
            processDeleteRequest(requestId, status);
        }

        console.log(`Request ${requestId} Type ${typeRequest} Status ${status}`);
    };

    return (
        <div className='contenedor_requests'>
            <br />
            <h2>CHANGE STORAGE REQUEST</h2>
            <div className='container_table'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>New Package</TableCell>
                            <TableCell>Request date</TableCell>
                            <TableCell className='buttons_cell'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {changeStorageRequests.slice(pageChangeStorage * rowsPerPageChangeStorage, pageChangeStorage * rowsPerPageChangeStorage + rowsPerPageChangeStorage).map((request, index) => (
                            <TableRow key={index}>
                                <TableCell>{request.NOMBRE_USUARIO}</TableCell>
                                <TableCell>{request.USUARIO}</TableCell>
                                <TableCell>{request.EMAIL}</TableCell>
                                <TableCell>{request.PAQUETE}</TableCell>
                                <TableCell>{request.MODIFICACION}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleApproveRequest(request.ID_SOLICITUD,'changeStorage','2', request.ID_CUENTA, request.ID_PAQUETE)}>
                                        Approve
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleApproveRequest(request.ID_SOLICITUD,'changeStorage','3')}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={changeStorageRequests.length}
                    rowsPerPage={rowsPerPageChangeStorage}
                    page={pageChangeStorage}
                    onPageChange={handleChangePageChangeStorage}
                    onRowsPerPageChange={handleChangeRowsPerPageChangeStorage}
                />
            </TableContainer>
            </div>  
            <br />
            <h2>DELETE ACCOUNT REQUESTS</h2>            
            <div className='container_table'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Request date</TableCell>
                            <TableCell className='buttons_cell'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deleteAccountRequests.slice(pageDeleteAccount * rowsPerPageDeleteAccount, pageDeleteAccount * rowsPerPageDeleteAccount + rowsPerPageDeleteAccount).map((request, index) => (
                            <TableRow key={index}>
                                <TableCell>{request.NOMBRE_USUARIO}</TableCell>
                                <TableCell>{request.USUARIO}</TableCell>
                                <TableCell>{request.EMAIL}</TableCell>
                                <TableCell>{request.MODIFICACION}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleApproveRequest(request.ID_SOLICITUD, 'deleteAccount', '2')}>
                                        Approve
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleApproveRequest(request.ID_SOLICITUD, 'deleteAccount','3')}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={deleteAccountRequests.length}
                    rowsPerPage={rowsPerPageDeleteAccount}
                    page={pageDeleteAccount}
                    onPageChange={handleChangePageDeleteAccount}
                    onRowsPerPageChange={handleChangeRowsPerPageDeleteAccount}
                />
            </TableContainer>
            </div>
        </div>
    );
};

export default Requests;