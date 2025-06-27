
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import '../styles/initG.css';
import AdminDashboardCards from '../components/AdminDashboardCards';

const AdminInit = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setNombreUsuario(user?.Nombre || 'Administrador');
    } catch (error) {
      console.error('Error parsing user data:', error);
      setNombreUsuario('Administrador');
    }
  }, [navigate]);

  return (
    <div className="gerencia-init">
      <Container fluid className="gerencia-content px-3 px-md-4">
        <div className="dash-header">
          <h1 className="welcome-title">
            Bienvenido, <span className="user-name">{nombreUsuario}</span>
          </h1>
        </div>
        <AdminDashboardCards />
      </Container>
    </div>
  );
};

export default AdminInit;