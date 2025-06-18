
import React, { useEffect, useState } from 'react';
import { generateReclamoPDF } from '../../../components/generateReclamoPDF';
import { Container, Table, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaEye } from 'react-icons/fa';
import axios from 'axios';
import AdminRes from '../components/AdminRes';
import { BsInfoCircle } from 'react-icons/bs'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../styles/adminReclamos.css';

const AdminReclamos = () => {
    const [reclamos, setReclamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reciboActual, setReciboActual] = useState(null);
    const [obsRes, setObsRes] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('pendientes');
    const [showModalResolucion, setShowModalResolucion] = useState(false);
    const [resolucionSeleccionada, setResolucionSeleccionada] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAdminData(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (adminData) {
            fetchReclamos();
        }
    }, [adminData, filtroEstado]);

    const fetchReclamos = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado. Inicie sesión nuevamente.');

            let params = {
                sMes: '99/9999',
                IdLegajo: 0,
                nFirmado: 1,
                nValidado: 0,
                nProtestado: 0,
                nResuelto: 0
            };

            if (filtroEstado === 'pendientes') {
                params.nProtestado = 1;
            } else if (filtroEstado === 'resueltos') {
                params.nResuelto = 1;
            } else if (filtroEstado === 'validados') {
                params.nValidado = 1;
                params.nResuelto = 1;
            }

            const response = await axios.get('/api/Consultas/consultarecibos', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const datos = response.data;
            setReclamos(datos);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Error al obtener los reclamos');
        } finally {
            setLoading(false);
        }
    };

    const formatFecha = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== 'string') return 'No disponible';

        const [datePart, timePart] = fechaStr.split(' ');
        if (!datePart || !timePart) return 'No disponible';

        const [day, month, year] = datePart.split('-');
        const formatted = `${year}-${month}-${day}T${timePart}`;
        const dateObj = new Date(formatted);

        if (isNaN(dateObj)) return 'No disponible';

        return dateObj.toLocaleString('es-AR', {
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const verReclamoPDF = async (recibo) => {
        try {
            const token = localStorage.getItem('token');
            const legajo = parseInt(recibo.Legajo);

            const params = new URLSearchParams({ IdLegajo: legajo });
            const response = await fetch(`/api/Consultas/empleados?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            let nombreEmpleado = recibo.Nombre || 'Nombre no disponible';
            if (response.ok) {
                const data = await response.json();
                nombreEmpleado = data[0]?.Nombre || nombreEmpleado;
            }

            const datosReclamo = {
                legajo: recibo.Legajo,
                nombre: nombreEmpleado,
                mes: recibo.Mes,
                secuencia: recibo.Secuencia,
                motivo: recibo.ObsProt || 'Motivo no especificado',
                firmaBase64: recibo.Firma,
                fechaProtesta: recibo.FechaProtesta,
            };

            const { url } = await generateReclamoPDF(datosReclamo);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error completo al generar PDF:', error);
            setError(`Error generando PDF: ${error.message}`);
        }
    };

    const abrirModal = (recibo) => {
        setReciboActual(recibo);
        setObsRes('');
        setShowModal(true);
    };

    const enviarResolucion = async () => {
        if (!reciboActual || !adminData) return;

        try {
            setLoading(true);
            setError(null);
            setShowModal(false);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const datosResuelto = {
                legajo: reciboActual.Legajo,
                mes: reciboActual.Mes,
                secuencia: reciboActual.Secuencia,
                Resuelto: 1,
                usrRes: adminData.Nombre,
                obsRes: obsRes || 'Resuelto sin observaciones',
            };

            await axios.post('/api/Procesos/resuelto', datosResuelto, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const datosProtesta = {
                Legajo: reciboActual.Legajo,
                Mes: reciboActual.Mes,
                Secuencia: reciboActual.Secuencia,
                Protesta: 0,
                ObsProt: reciboActual.ObsProt,
            };

            await axios.post('/api/Procesos/protesta', datosProtesta, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccessMsg('Reclamo resuelto correctamente');
            fetchReclamos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setReciboActual(null);
        }
    };

    const verResolucion = (recibo) => {
        setResolucionSeleccionada(recibo);
        setShowModalResolucion(true);
    };

    return (
        <Container fluid className="admin-reclamos-container">
            <h2 className="mb-4">Gestión de Reclamos</h2>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

            <Form.Select
                className="mb-3"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
            >
                <option value="pendientes">Pendientes</option>
                <option value="resueltos">Resueltos</option>
                <option value="validados">Validados</option>
            </Form.Select>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <p>Cargando reclamos...</p>
                </div>
            ) : (
                <>
                    {reclamos.length === 0 ? (
                        <Alert variant="info">No hay reclamos para mostrar.</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>Legajo</th>
                                    <th>Mes</th>
                                    <th>Secuencia</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reclamos.map((recibo, index) => (
                                    <tr key={index}>
                                        <td>{recibo.Legajo}</td>
                                        <td>{recibo.Mes}</td>
                                        <td>{recibo.Secuencia}</td>
                                        <td>
                                            {filtroEstado === 'pendientes' && formatFecha(recibo.FechaProtesta)}
                                            {filtroEstado === 'resueltos' && formatFecha(recibo.FechaRes)}
                                            {filtroEstado === 'validados' && formatFecha(recibo.FechaValida)}
                                        </td>
                                        <td>
                                            <Badge bg={
                                                recibo.Valida === 1
                                                    ? 'info'
                                                    : recibo.Resuelto === 1
                                                    ? 'success'
                                                    : 'warning'
                                            }>
                                                {
                                                    recibo.Valida === 1
                                                        ? 'Validado'
                                                        : recibo.Resuelto === 1
                                                        ? 'Resuelto'
                                                        : 'Pendiente'
                                                }
                                            </Badge>
                                        </td>
                                        <td>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Ver Reclamo</Tooltip>}>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => verReclamoPDF(recibo)}
                                                    className="me-2"
                                                >
                                                    <FaEye className="me-1" />
                                                </Button>
                                            </OverlayTrigger>
                                            {recibo.Resuelto !== 1 && (
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Resolver Reclamo</Tooltip>}>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => abrirModal(recibo)}
                                                        disabled={loading}
                                                    >
                                                        <FaCheck className="me-1" />
                                                    </Button>
                                                </OverlayTrigger>
                                                
                                            )}
                                            {(recibo.Resuelto === 1 || recibo.Valida === 1) && (
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Ver Resolucion</Tooltip>}>
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => verResolucion(recibo)}
                                                    >
                                                        <BsInfoCircle />
                                                    </Button>
                                                </OverlayTrigger>
                                                
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Resolver Reclamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="obsRes">
                        <Form.Label>Mensaje de resolución</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={obsRes}
                            onChange={(e) => setObsRes(e.target.value)}
                            placeholder="Ingrese un comentario para el empleado..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={enviarResolucion}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
            <AdminRes
                show={showModalResolucion}
                onHide={() => setShowModalResolucion(false)}
                resolucion={resolucionSeleccionada}
            />
        </Container>
    );
};

export default AdminReclamos;