
import React, { useEffect, useState, useCallback } from 'react';
import { FaBus } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import CustomNavbar from '../components/Navbar';
import Recibos from './Recibos';
import EmployeeCard from '../components/Card';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Init = () => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      navigate('/');
      return;
    }

    setUserData(JSON.parse(storedUser));
    setToken(storedToken);
  }, [navigate]);

  const fetchRecibos = useCallback(async () => {
    if (!userData || !token) {
      setError('No se encontraron datos del usuario o token.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const sMes = '99/9999';        // todos los meses
      const nSecuencia = 9;          // todas las secuencias

      const response = await fetch(
        `/api/Consultas/recibos?IdLegajo=${userData.Legajo}&sMes=${sMes}&nSecuencia=${nSecuencia}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener recibos: ${response.statusText}`);
      }

      const data = await response.json();
      setRecibos(data); // Esto ahora contiene más datos que pueden usarse en otros componentes
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userData, token]);

  useEffect(() => {
    if (userData && token) {
      fetchRecibos();
    }
  }, [userData, token, fetchRecibos]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="bus-loading">
          <FaBus className="pink-bus-icon" />
          <BeatLoader color="#ff5fb0" size={15} />
        </div>
      </div>
    );
  }

  console.log("userdata", userData)


  return (
    <div className="init-container">
      <CustomNavbar userData={userData} />
      
      <Container className="main-content py-4">
        <Row className="justify-content-center mb-4">
          <Col xs={12} className="text-center">
            <div className='title_init'>
              <h2 className='welc'>Bienvenido a </h2>
              <h2 className='color_si'> Si</h2>
              <h2>Bus</h2>
            </div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col xs={12}>
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {!error && (
          <Row className="justify-content-center">
            <Col lg={4} className="mb-4">
              {userData && <EmployeeCard userData={userData} />}
            </Col>

            <Col lg={8}>
              <Recibos
                recibos={recibos}
                userLegajo={userData?.Legajo}
                userName={userData?.Nombre}
                refetchRecibos={fetchRecibos}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Init;
