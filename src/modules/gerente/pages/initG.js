import React from 'react';
import GerenciaNavbar from '../components/NavbarG';
import { Container } from 'react-bootstrap';
import '../styles/initG.css';

const GerenciaInit = () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="gerencia-init">
      <GerenciaNavbar />
      
      <Container className="gerencia-content">
        <h1 className="welcome-title">
          Bienvenido, <span className="user-name">{userData?.Nombre || 'Gerente'}</span>
        </h1>
        <p className="welcome-message">
          Panel de administración
        </p>
        
        <div className="placeholder-box">
          <p>Contenido del dashboard</p>
        </div>
      </Container>
    </div>
  );
};

export default GerenciaInit;