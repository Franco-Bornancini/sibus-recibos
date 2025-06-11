
import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { generateReclamoPDF } from '../components/generateReclamoPDF';

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

    // Debug: verificar props recibidas
    console.log("Props en ReclamoForm:", { userLegajo, userName, recibo });

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
            
            const response = await fetch(`/api/Procesos/protesta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                Mes: recibo?.Mes || '',
                Secuencia: recibo?.Secuencia || 0,
                Legajo: userLegajo,
                Protesta: 1,
                ObsProt: motivo,
            }),
            });

            if (!response.ok) {
            throw new Error('Error al enviar el reclamo');
            }

            const pdfFileName = await generateReclamoPDF({
                legajo: userLegajo,
                nombre: userName,
                mes: recibo?.Mes || '',
                secuencia: recibo?.Secuencia || '',
                motivo,
                firmaBase64: localStorage.getItem('firmaBase64') || null
            });

            onReclamoSuccess(pdfFileName);
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
