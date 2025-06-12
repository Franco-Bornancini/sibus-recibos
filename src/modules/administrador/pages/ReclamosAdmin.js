
// import React, { useEffect, useState } from 'react';
// import { generateReclamoPDF } from '../../../components/generateReclamoPDF';
// import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
// import { FaFilePdf, FaCheck, FaEye } from 'react-icons/fa';
// import axios from 'axios';
// import '../styles/adminReclamos.css';

// const AdminReclamos = () => {
//     const [reclamos, setReclamos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [successMsg, setSuccessMsg] = useState(null);
//     const [adminData, setAdminData] = useState(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//         setAdminData(JSON.parse(storedUser));
//         }
//     }, []);

//     const fetchReclamos = async () => {
//         try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('Token no encontrado. Inicie sesión nuevamente.');

//         const params = {
//             sMes: '99/9999',
//             IdLegajo: 0,
//             nFirmado: 1,
//             nValidado: 0,
//             nProtestado: 1,
//             nResuelto: 0,
//         };

//         const response = await axios.get('/api/Consultas/consultarecibos', {
//             params,
//             headers: {
//             Authorization: `Bearer ${token}`,
//             },
//         });

//         const reclamosFiltrados = response.data.filter((recibo) => recibo.Protesta === 1);
//         setReclamos(reclamosFiltrados);
//         } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Error al obtener los reclamos');
//         } finally {
//         setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (adminData) {
//         fetchReclamos();
//         }
//     }, [adminData]);

//     const verReclamoPDF = async (recibo) => {
//         try {
//         const datosReclamo = {
//             legajo: recibo.Legajo,
//             nombre: recibo.Nombre, // me devuelve undefine, no esta este campo
//             mes: recibo.Mes,
//             secuencia: recibo.Secuencia,
//             motivo: recibo.ObsProt || 'Motivo no especificado',
//             firmaBase64: recibo.Firma,
//             fechaProtesta: recibo.FechaProtesta,
//         };

//         const { url } = await generateReclamoPDF(datosReclamo);
//         window.open(url, '_blank');
//         } catch (error) {
//         setError('Error generando PDF del reclamo');
//         }
//     };

//     const resolverReclamo = async (recibo) => {
//         try {
//         setLoading(true);

//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('Token no encontrado. Inicie sesión nuevamente.');

//         const datosActualizacion = {
//             legajo: recibo.Legajo,
//             mes: recibo.Mes,
//             secuencia: recibo.Secuencia,
//             Resuelto: 1,
//             usrRes: adminData?.legajo || 'abcd',
//             obsRes: 'Reclamo resuelto por administrador',
//         };

//         await axios.post('/api/Procesos/resuelto', datosActualizacion, {
//             headers: {
//             Authorization: `Bearer ${token}`,
//             },
//         });

//         setSuccessMsg('Reclamo marcado como resuelto correctamente');
//         fetchReclamos(); // Actualizar reclamos
//         } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Error al resolver el reclamo');
//         } finally {
//         setLoading(false);
//         }
//     };

//     const formatFecha = (fecha) => {
//         if (!fecha) return 'No disponible';
//         return new Date(fecha).toLocaleDateString('es-AR');
//     };

//     return (
//         <Container fluid className="admin-reclamos-container">
//         <h2 className="mb-4">Gestión de Reclamos</h2>

//         {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//         {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

//         {loading ? (
//             <div className="text-center">
//             <Spinner animation="border" role="status" />
//             <p>Cargando reclamos...</p>
//             </div>
//         ) : (
//             <>
//             {reclamos.length === 0 ? (
//                 <Alert variant="info">No hay reclamos pendientes para mostrar.</Alert>
//             ) : (
//                 <Table striped bordered hover responsive className="mt-3">
//                 <thead>
//                     <tr>
//                     <th>Legajo</th>
//                     <th>Mes</th>
//                     <th>Secuencia</th>
//                     <th>Fecha Protesta</th>
//                     <th>Estado</th>
//                     <th>Acciones</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {reclamos.map((recibo, index) => (
//                     <tr key={index}>
//                         <td>{recibo.Legajo}</td>
//                         <td>{recibo.Mes}</td>
//                         <td>{recibo.Secuencia}</td>
//                         <td>{formatFecha(recibo.FechaProtesta)}</td>
//                         <td>
//                         <Badge bg={recibo.Resuelto === 1 ? "success" : "warning"}>
//                             {recibo.Resuelto === 1 ? "Resuelto" : "Pendiente"}
//                         </Badge>
//                         </td>
//                         <td>
//                         <Button variant="primary" size="sm" onClick={() => verReclamoPDF(recibo)} className="me-2">
//                             <FaEye className="me-1" />
//                         </Button>
//                         {recibo.Resuelto !== 1 && (
//                             <Button variant="success" size="sm" onClick={() => resolverReclamo(recibo)} disabled={loading}>
//                             <FaCheck className="me-1" />
//                             </Button>
//                         )}
//                         </td>
//                     </tr>
//                     ))}
//                 </tbody>
//                 </Table>
//             )}
//             </>
//         )}
//         </Container>
//     );
// };

// export default AdminReclamos;
import React, { useEffect, useState } from 'react';
import { generateReclamoPDF } from '../../../components/generateReclamoPDF';
import { Container, Table, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaEye } from 'react-icons/fa';
import axios from 'axios';
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

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAdminData(JSON.parse(storedUser));
        }
    }, []);

    console.log(adminData) // viendo datos del administrador

    const fetchReclamos = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado. Inicie sesión nuevamente.');

            const params = {
                sMes: '99/9999',
                IdLegajo: 0,
                nFirmado: 1,
                nValidado: 0,
                nProtestado: 1,
                nResuelto: 0,
            };

            const response = await axios.get('/api/Consultas/consultarecibos', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const reclamosFiltrados = response.data.filter((recibo) => recibo.Protesta === 1);
            setReclamos(reclamosFiltrados);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al obtener los reclamos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminData) {
            fetchReclamos();
        }
    }, [adminData]);

    const verReclamoPDF = async (recibo) => {
        try {
            const datosReclamo = {
                legajo: recibo.Legajo,
                nombre: recibo.Nombre || '', // puede venir vacío
                mes: recibo.Mes,
                secuencia: recibo.Secuencia,
                motivo: recibo.ObsProt || 'Motivo no especificado',
                firmaBase64: recibo.Firma,
                fechaProtesta: recibo.FechaProtesta,
            };

            const { url } = await generateReclamoPDF(datosReclamo);
            window.open(url, '_blank');
        } catch (error) {
            setError('Error generando PDF del reclamo');
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

            // ✅ 1. Marcar como resuelto (incluye nombre del admin que resolvió)
            const datosResuelto = {
                legajo: reciboActual.Legajo,
                mes: reciboActual.Mes,
                secuencia: reciboActual.Secuencia,
                Resuelto: 1,
                usrRes: adminData.legajo,
                nomRes: adminData.nombre, // ✅ AGREGADO
                obsRes: obsRes || 'Resuelto sin observaciones',
            };

            await axios.post('/api/Procesos/resuelto', datosResuelto, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 2. Quitar protesta
            const datosProtesta = {
                Legajo: reciboActual.Legajo,
                Mes: reciboActual.Mes,
                Secuencia: reciboActual.Secuencia,
                Protesta: 0,
                ObsProt: "",
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

    const formatFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        return new Date(fecha).toLocaleDateString('es-AR');
    };

    return (
        <Container fluid className="admin-reclamos-container">
            <h2 className="mb-4">Gestión de Reclamos</h2>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <p>Cargando reclamos...</p>
                </div>
            ) : (
                <>
                    {reclamos.length === 0 ? (
                        <Alert variant="info">No hay reclamos pendientes para mostrar.</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>Legajo</th>
                                    <th>Mes</th>
                                    <th>Secuencia</th>
                                    <th>Fecha Protesta</th>
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
                                        <td>{formatFecha(recibo.FechaProtesta)}</td>
                                        <td>
                                            <Badge bg={recibo.Resuelto === 1 ? "success" : "warning"}>
                                                {recibo.Resuelto === 1 ? "Resuelto" : "Pendiente"}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => verReclamoPDF(recibo)} className="me-2">
                                                <FaEye className="me-1" />
                                            </Button>
                                            {recibo.Resuelto !== 1 && (
                                                <Button variant="success" size="sm" onClick={() => abrirModal(recibo)} disabled={loading}>
                                                    <FaCheck className="me-1" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}

            {/* Modal para mensaje de resolución */}
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
        </Container>
    );
};

export default AdminReclamos;
