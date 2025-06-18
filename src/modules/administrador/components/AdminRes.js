// components/AdminResolucionModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsInfoCircle } from 'react-icons/bs';

const AdminRes = ({ show, onHide, resolucion }) => {
    if (!resolucion) return null;

    const mensajeAdmin = resolucion.ObsRes || 'No hay mensaje disponible.';
    const fechaRespuesta = resolucion.FechaRes || 'No disponible';
    const usuarioRespuesta = resolucion.UsrRes || 'No disponible';

    return (
        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>
            <BsInfoCircle className="me-2" />
            Resolución del Reclamo
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p><strong>Mensaje del Administrador:</strong></p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{mensajeAdmin}</p>
            <hr />
            <p><strong>Fecha de respuesta:</strong> {fechaRespuesta}</p>
            <p><strong>Respondido por:</strong> {usuarioRespuesta}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="dark" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
        </Modal>
    );
};

export default AdminRes;
