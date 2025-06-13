
import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const ReclamoForm = ({ 
    show, 
    onHide, 
    recibo, 
    userLegajo, 
    userName,
    onReclamoSuccess 
    }) => {
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!motivo.trim()) {
            setError('Por favor describa el motivo del reclamo');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!userName) {
                throw new Error('No se encontró el nombre del usuario');
            }

            const token = localStorage.getItem('token');

            // 1. Enviar reclamo (protesta)
            const protestaResponse = await fetch(`/api/Procesos/protesta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Mes: recibo.Mes || '',
                    Secuencia: recibo.Secuencia || 0,
                    Legajo: userLegajo,
                    Protesta: 1,
                    ObsProt: motivo,
                }),
            });

            if (!protestaResponse.ok) {
                throw new Error('Error al enviar el reclamo');
            }

            // 2. Registrar estado de resolución en 0
            const resolucionResponse = await fetch(`/api/Procesos/resuelto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Mes: recibo.Mes || '',
                    Secuencia: recibo.Secuencia || 0,
                    Legajo: userLegajo,
                    Resuelto: 0,
                    ObsRes: '',
                    UsrRes: '',
                }),
            });

            if (!resolucionResponse.ok) {
                throw new Error('Error al dejar la resolución pendiente');
            }

            onHide();

        } catch (err) {
            setError(err.message || 'Error al generar el reclamo. Intente nuevamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>
            <FaExclamationTriangle className="text-warning me-2" />
            Reclamo por Diferencias
            </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
                <Form.Label>Legajo N°:</Form.Label>
                <Form.Control 
                type="text" 
                value={userLegajo || 'No disponible'} 
                readOnly 
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Apellido y Nombre:</Form.Label>
                <Form.Control 
                type="text" 
                value={userName || 'No disponible'} 
                readOnly 
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Mes del Recibo:</Form.Label>
                <Form.Control 
                type="text" 
                value={recibo?.Mes || 'No disponible'} 
                readOnly 
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Motivo del Reclamo *</Form.Label>
                <Form.Control
                as="textarea"
                rows={5}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describa detalladamente las diferencias encontradas..."
                required
                />
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
                Cancelar
            </Button>
            <Button 
                variant="warning" 
                type="submit" 
                disabled={loading || !motivo.trim()}
            >
                {loading ? 'Generando PDF...' : 'Enviar Reclamo'}
            </Button>
            </Modal.Footer>
        </Form>
        </Modal>
    );
};

export default ReclamoForm;


// import React, { useState } from 'react';
// import { Modal, Form, Button, Alert } from 'react-bootstrap';
// import { FaExclamationTriangle } from 'react-icons/fa';
// import { generateReclamoPDF } from '../components/generateReclamoPDF';

// const ReclamoForm = ({
//   show,
//   onHide,
//   recibo,
//   userLegajo,
//   userName,
//   onReclamoSuccess,
//   tipo = 'nuevo' // puede ser 'nuevo' o 'reclamo_post_resolucion'
// }) => {
//   const [motivo, setMotivo] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!motivo.trim()) {
//       setError('Por favor describa el motivo del reclamo');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/Procesos/protesta`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Mes: recibo?.Mes || '',
//           Secuencia: recibo?.Secuencia || 0,
//           Legajo: userLegajo,
//           Protesta: 1,
//           ObsProt: motivo,
//         }),
//       });

//       if (!response.ok) throw new Error('Error al enviar el reclamo');

//       const pdfFileName = await generateReclamoPDF({
//         legajo: userLegajo,
//         nombre: userName,
//         mes: recibo?.Mes || '',
//         secuencia: recibo?.Secuencia || '',
//         motivo,
//         firmaBase64: localStorage.getItem('firmaBase64') || null,
//       });

//       onReclamoSuccess(pdfFileName);
//       onHide();
//     } catch (err) {
//       setError(err.message || 'Error al generar el reclamo.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           <FaExclamationTriangle className="text-warning me-2" />
//           {tipo === 'nuevo' ? 'Reclamo por Diferencias' : 'Nuevo Reclamo'}
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form.Group className="mb-2">
//             <Form.Label>Legajo:</Form.Label>
//             <Form.Control value={userLegajo} readOnly />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Nombre:</Form.Label>
//             <Form.Control value={userName} readOnly />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Mes:</Form.Label>
//             <Form.Control value={recibo?.Mes || ''} readOnly />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Motivo del Reclamo *</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={4}
//               value={motivo}
//               onChange={(e) => setMotivo(e.target.value)}
//               required
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide} disabled={loading}>
//             Cancelar
//           </Button>
//           <Button type="submit" variant="warning" disabled={loading || !motivo.trim()}>
//             {loading ? 'Enviando...' : 'Enviar Reclamo'}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default ReclamoForm;
