// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Spinner } from 'react-bootstrap';
// import '../styles/PlaceholderPanel.css';

// const ReclamosAdmin = () => {
//     const [reclamos, setReclamos] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Datos simulados (reemplazar cuando tengas backend)
//     useEffect(() => {
//         const fetchReclamosSimulados = async () => {
//         // Simulamos un delay de carga
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Datos de ejemplo basados en tus archivos PDF
//         const reclamosEjemplo = [
//             {
//             id: 1,
//             legajo: '7393',
//             nombre: 'Juan Pérez',
//             fecha: '2025-05-15',
//             mesReclamo: '05/2025',
//             archivo: 'Reclamo_7393_05_2025_1749575078375.pdf',
//             estado: 'Pendiente'
//             },
//             {
//             id: 2,
//             legajo: '5421',
//             nombre: 'María Gómez',
//             fecha: '2025-04-10',
//             mesReclamo: '04/2025',
//             archivo: 'Reclamo_5421_04_2025_1749575078376.pdf',
//             estado: 'Resuelto'
//             },
//             {
//             id: 3,
//             legajo: '8125',
//             nombre: 'Carlos Rodríguez',
//             fecha: '2025-05-18',
//             mesReclamo: '05/2025',
//             archivo: 'Reclamo_8125_05_2025_1749575078377.pdf',
//             estado: 'En revisión'
//             }
//         ];

//         setReclamos(reclamosEjemplo);
//         setLoading(false);
//         };

//         fetchReclamosSimulados();
//     }, []);

//     const handleVerReclamo = (archivo) => {
//         // Abre el PDF en una nueva pestaña
//         window.open(`/assets/Reclamos/${archivo}`, '_blank');
//     };

//     const handleCambiarEstado = (id, nuevoEstado) => {
//         setReclamos(prev => prev.map(reclamo => 
//         reclamo.id === id ? {...reclamo, estado: nuevoEstado} : reclamo
//         ));
//     };

//     if (loading) {
//         return (
//         <Card className="main-card">
//             <Card.Body className="text-center">
//             <Spinner animation="border" role="status">
//                 <span className="visually-hidden">Cargando reclamos...</span>
//             </Spinner>
//             <p>Cargando reclamos...</p>
//             </Card.Body>
//         </Card>
//         );
//     }

//     return (
//         <Card className="main-card">
//         <Card.Header>
//             <h5>Administración de Reclamos</h5>
//         </Card.Header>
//         <Card.Body>
//             <div className="table-responsive">
//             <Table striped bordered hover>
//                 <thead>
//                 <tr>
//                     <th>Legajo</th>
//                     <th>Nombre</th>
//                     <th>Fecha Reclamo</th>
//                     <th>Mes Reclamado</th>
//                     <th>Estado</th>
//                     <th>Acciones</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {reclamos.map(reclamo => (
//                     <tr key={reclamo.id}>
//                     <td>{reclamo.legajo}</td>
//                     <td>{reclamo.nombre}</td>
//                     <td>{reclamo.fecha}</td>
//                     <td>{reclamo.mesReclamo}</td>
//                     <td>
//                         <span className={`badge bg-${
//                         reclamo.estado === 'Pendiente' ? 'warning' :
//                         reclamo.estado === 'Resuelto' ? 'success' :
//                         'info'
//                         }`}>
//                         {reclamo.estado}
//                         </span>
//                     </td>
//                     <td>
//                         <Button 
//                         variant="primary" 
//                         size="sm" 
//                         onClick={() => handleVerReclamo(reclamo.archivo)}
//                         className="me-2"
//                         >
//                         Ver PDF
//                         </Button>
//                         <div className="btn-group">
//                         <Button 
//                             variant={reclamo.estado === 'Pendiente' ? 'success' : 'outline-success'} 
//                             size="sm"
//                             onClick={() => handleCambiarEstado(reclamo.id, 'Resuelto')}
//                         >
//                             Resolver
//                         </Button>
//                         <Button 
//                             variant={reclamo.estado === 'En revisión' ? 'warning' : 'outline-warning'} 
//                             size="sm"
//                             onClick={() => handleCambiarEstado(reclamo.id, 'En revisión')}
//                         >
//                             Revisar
//                         </Button>
//                         </div>
//                     </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </Table>
//             </div>
//         </Card.Body>
//         </Card>
//     );
// };

// export default ReclamosAdmin;

import React, { useEffect, useState } from 'react';
import { generateReclamoPDF } from '../../../components/generateReclamoPDF';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaFilePdf, FaCheck, FaEye } from 'react-icons/fa';
import axios from 'axios';
import '../styles/adminReclamos.css';

const AdminReclamos = () => {
    const [reclamos, setReclamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [adminData, setAdminData] = useState(null);

    // Obtener datos del administrador al montar el componente
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setAdminData(JSON.parse(storedUser));
        }
    }, []);

    // Función para cargar los reclamos
    const fetchReclamos = async () => {
        try {
        setLoading(true);
        setError(null);
        
        // Parámetros para la consulta
        const params = {
            sMes: '99/9999',
            IdLegajo: 0 || 'abcd', // Usar el legajo del admin o 'abcd' como fallback
            nFirmado: 9,
            nValidado: 0,
            nProtestado: 9,
            nResuelto: 0
        };

        const response = await axios.get('/api/Consultas/consultarecibos', { params });
        
        // Filtrar solo recibos con protesta (reclamos)
        const reclamosFiltrados = response.data.filter(recibo => recibo.Protesta === 1);
        setReclamos(reclamosFiltrados);
        } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener los reclamos');
        } finally {
        setLoading(false);
        }
    };

    // Cargar reclamos cuando cambien los datos del admin
    useEffect(() => {
        if (adminData) {
        fetchReclamos();
        }
    }, [adminData]);

    // Función para ver el PDF del reclamo
    const verReclamoPDF = async (recibo) => {
        try {
        const datosReclamo = {
            legajo: adminData?.legajo || 'abcd',
            nombre: `Legajo ${recibo.Legajo}`,
            mes: recibo.Mes,
            secuencia: recibo.Secuencia,
            motivo: recibo.ObsProt || 'Motivo no especificado',
            firmaBase64: recibo.Firma,
            fechaProtesta: recibo.FechaProtesta
        };

        const { url } = await generateReclamoPDF(datosReclamo);
        window.open(url, '_blank');
        } catch (error) {
        setError('Error generando PDF del reclamo');
        }
    };

    // Función para marcar reclamo como resuelto
    const resolverReclamo = async (recibo) => {
        try {
        setLoading(true);
        
        const datosActualizacion = {
            legajo: recibo.Legajo,
            mes: recibo.Mes,
            secuencia: recibo.Secuencia,
            usrRes: adminData?.legajo || 'abcd',
            obsRes: 'Reclamo resuelto por administrador'
        };

        await axios.post('/api/Reclamos/resolver', datosActualizacion);
        
        setSuccessMsg('Reclamo marcado como resuelto correctamente');
        fetchReclamos(); // Recargar la lista de reclamos
        } catch (err) {
        setError(err.response?.data?.message || 'Error al resolver el reclamo');
        } finally {
        setLoading(false);
        }
    };

    // Función para formatear la fecha
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
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </Spinner>
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
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => verReclamoPDF(recibo)}
                            className="me-2"
                        >
                            <FaEye className="me-1" /> Ver
                        </Button>
                        
                        {recibo.Resuelto !== 1 && (
                            <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => resolverReclamo(recibo)}
                            disabled={loading}
                            >
                            <FaCheck className="me-1" /> Resolver
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
        </Container>
    );
};

export default AdminReclamos;