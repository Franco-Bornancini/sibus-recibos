import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEdit, FaLock } from 'react-icons/fa';
import '../styles/AdminUsuarios.css';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    const userS = 'S18u5';
    const userkey = 'S-Bu5*wS/25';

    // Obtener token y cargar usuarios
    useEffect(() => {
        const obtenerTokenYUsuarios = async () => {
            try {
                setLoading(true);
                const resToken = await axios.post('/api/token', {
                    usuario: userS,
                    clave: userkey,
                });

                const t = typeof resToken.data === 'string' ? resToken.data : resToken.data.token;
                setToken(t);

                const resUsuarios = await axios.get('/api/Consultas/empleados', {
                    headers: { Authorization: `Bearer ${t}` },
                    params: { IdLegajo: 0 },
                });

                const usuariosApi = resUsuarios.data.map((emp, index) => ({
                    id: index + 1,
                    legajo: emp.Legajo,
                    nombre: emp.Nombre,
                    dni: emp.CUIL,
                    password: emp.Clave,
                    mostrarPassword: false,
                }));

                setUsuarios(usuariosApi);
            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError('Error al cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };

        obtenerTokenYUsuarios();
    }, []);

    const toggleMostrarPassword = (id) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.id === id
                ? { ...usuario, mostrarPassword: !usuario.mostrarPassword }
                : usuario
        ));
    };

    const handleAbrirModalCambio = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setNuevaPassword('');
        setConfirmPassword('');
        setError('');
        setShowModal(true);
    };

    const handleCambiarPassword = async () => {
        if (!/^\d+$/.test(nuevaPassword)) {
            setError('La contraseña debe contener solo números');
            return;
        }

        if (nuevaPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 dígitos');
            return;
        }

        if (nuevaPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const payload = {
                Legajo: usuarioSeleccionado.legajo.toString(),
                ClaveAnterior: usuarioSeleccionado.password.toString(),
                ClaveNueva: nuevaPassword.toString()
            };

            const response = await axios.post('/api/cambiaclave', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Cambio de clave OK:', response.data);

            setUsuarios(prev =>
                prev.map(u =>
                    u.legajo === usuarioSeleccionado.legajo
                        ? { ...u, password: nuevaPassword }
                        : u
                )
            );

            setShowModal(false);
            setUsuarioSeleccionado(null);
            setNuevaPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error('Error al cambiar contraseña:', err);
            setError('No se pudo cambiar la contraseña');
        }
    };

    return (
        <>
            <Card className="main-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5>Administración de Usuarios</h5>
                    <Badge bg="primary" pill>
                        Total: {usuarios.length} usuarios
                    </Badge>
                </Card.Header>
                <div className="mb-4 px-3">
                    <Form>
                        <Form.Group controlId="busquedaLegajo">
                            <Form.Label className="fw-semibold">Buscar por Legajo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el legajo"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="shadow-sm"
                                style={{ maxWidth: '300px' }}
                            />
                        </Form.Group>
                    </Form>
                </div>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                            <p className="mt-3">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Legajo</th>
                                    <th>Nombre</th>
                                    <th>DNI</th>
                                    <th>Contraseña</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios
                                .filter((u) =>
                                    u.legajo.toString().includes(busqueda.trim())
                                )
                                .map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.legajo}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.dni}</td>
                                        <td>
                                            <div className="password-field">
                                                {usuario.mostrarPassword ? (
                                                    <span className="text-mono">{usuario.password}</span>
                                                ) : (
                                                    <span className="text-mono">••••••••</span>
                                                )}
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => toggleMostrarPassword(usuario.id)}
                                                    title={usuario.mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                >
                                                    {usuario.mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>
                                            </div>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleAbrirModalCambio(usuario)}
                                                title="Cambiar contraseña"
                                            >
                                                <FaEdit /> Cambiar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaLock className="me-2" />
                        Cambiar contraseña
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Cambiando contraseña para: <strong>{usuarioSeleccionado?.nombre}</strong>
                    </p>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repita la nueva contraseña"
                            />
                        </Form.Group>

                        {error && <div className="alert alert-danger">{error}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCambiarPassword}>
                        Confirmar Cambio
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminUsuarios;