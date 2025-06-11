import React, { useState } from 'react';
import { Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEdit, FaLock } from 'react-icons/fa';
import '../styles/AdminUsuarios.css';

const AdminUsuarios = () => {
    // Remplazar cuando este la api de los usuarios.
    // Datos de ejemplo
    const [usuarios, setUsuarios] = useState([
        { 
        id: 1, 
        legajo: '1234', 
        nombre: 'Juan Pérez', 
        dni: '30123456', 
        password: 'clave123',
        mostrarPassword: false
        },
        { 
        id: 2, 
        legajo: '5678', 
        nombre: 'Ana Torres', 
        dni: '28987654', 
        password: 'ana2024',
        mostrarPassword: false
        },
        { 
        id: 3, 
        legajo: '8901', 
        nombre: 'Luis Admin', 
        dni: '35123456', 
        password: 'admin123',
        mostrarPassword: false
        }
    ]);

    // Estado para el modal de cambio de contraseña
    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Alternar visibilidad de contraseña
    const toggleMostrarPassword = (id) => {
        setUsuarios(usuarios.map(usuario => 
        usuario.id === id 
            ? {...usuario, mostrarPassword: !usuario.mostrarPassword} 
            : usuario
        ));
    };

    // Abrir modal para cambiar contraseña
    const handleAbrirModalCambio = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setNuevaPassword('');
        setConfirmPassword('');
        setError('');
        setShowModal(true);
    };

    // Cambiar contraseña (simulado)
    const handleCambiarPassword = () => {
        // Validaciones
        if (nuevaPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
        }

        if (nuevaPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
        }

        // Simular cambio de contraseña (luego será una llamada API)
        setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioSeleccionado.id 
            ? {...usuario, password: nuevaPassword} 
            : usuario
        ));

        // Cerrar modal y limpiar estado
        setShowModal(false);
        setUsuarioSeleccionado(null);
        setNuevaPassword('');
        setConfirmPassword('');
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
            <Card.Body>
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
                {usuarios.map((usuario) => (
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
            </Card.Body>
        </Card>

        {/* Modal para cambiar contraseña */}
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