// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const ResolucionModal = ({
//     show,
//     onHide,
//     recibo,
//     userName,
//     onReclamarDeNuevo
//     }) => {

//     return (
//         <Modal show={show} onHide={onHide} centered>
//         <Modal.Header closeButton>
//             <Modal.Title>Resolución del Reclamo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//             <p><strong>Mensaje:</strong> {recibo.ObsRes || 'No disponible'}</p>
//             <p><strong>Respondido por:</strong> {recibo.UsrRes || 'No disponible'}</p>
//             <p><strong>Fecha:</strong> {recibo.FechaRes || 'No disponible'}</p>
//         </Modal.Body>
//         <Modal.Footer>
//             <Button variant="secondary" onClick={onHide}>
//             Cerrar
//             </Button>
//             <Button variant="warning" onClick={onReclamarDeNuevo}>
//             No estoy conforme - Reclamar de nuevo
//             </Button>
//         </Modal.Footer>
//         </Modal>
//     );
// };

// export default ResolucionModal;

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ResolucionModal = ({ show, onHide, resolucion }) => {
  if (!resolucion) return null;

  const mensajeAdmin = resolucion.ObsRes || 'No hay mensaje disponible.';
  const fechaRespuesta = resolucion.FechaRes || 'No disponible';
  const usuarioRespuesta = resolucion.UsrRes || 'No disponible';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Resolución del Reclamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Mensaje del Administrador:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{mensajeAdmin}</p>
        <hr />
        <p><strong>Fecha de respuesta:</strong> {fechaRespuesta}</p>
        <p><strong>Respondido por:</strong> {usuarioRespuesta}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResolucionModal;