// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import GerenciaNavbar from '../components/NavbarG';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import {
//   FaChartLine,
//   FaUsers,
//   FaFileAlt,
//   FaCalendarAlt,
//   FaBell,
//   FaCog
// } from 'react-icons/fa';
// import '../styles/initG.css';

// const AdminInit = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [token, setToken] = useState(null);

//   const stats = [
//     { title: "Empleados Activos", value: "142", icon: <FaUsers size={24} />, trend: "↑ 5%", color: "#4e73df" },
//     { title: "Recibos Firmados", value: "1,248", icon: <FaFileAlt size={24} />, trend: "↑ 12%", color: "#1cc88a" },
//     { title: "Pendientes", value: "23", icon: <FaCalendarAlt size={24} />, trend: "↓ 3%", color: "#f6c23e" },
//     { title: "Alertas", value: "7", icon: <FaBell size={24} />, trend: "↑ 2", color: "#e74a3b" }
//   ];

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');

//     if (!storedUser || !storedToken) {
//       navigate('/');
//       return;
//     }

//     setUserData(JSON.parse(storedUser));
//     setToken(storedToken);
//   }, [navigate]);

//   return (
//     <div className="gerencia-init">
//       <Container fluid className="gerencia-content px-4">
//         <div className="dash-header">
//           <h1 className="welcome-title">
//             Bienvenido, <span className="user-name">{ ``}</span>
//           </h1>
//           <div className="header-actions">
//             <button className="action-btn">
//               <FaCog className="me-2" /> Configuración
//             </button>
//           </div>
//         </div>

//         <Row className="mt-4">
//           {stats.map((stat, index) => (
//             <Col xl={3} md={6} key={index} className="mb-4">
//               <Card className="stat-card">
//                 <Card.Body>
//                   <div className="stat-icon" style={{ backgroundColor: stat.color }}>
//                     {stat.icon}
//                   </div>
//                   <div className="stat-text">
//                     <h6>{stat.title}</h6>
//                     <h2>{stat.value}</h2>
//                     <span className={`trend ${stat.trend.includes('↑') ? 'up' : 'down'}`}>
//                       {stat.trend}
//                     </span>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         <Row className="mt-4">
//           <Col xl={8} className="mb-4">
//             <Card className="main-card">
//               <Card.Header>
//                 <h5>Actividad Reciente</h5>
//               </Card.Header>
//               <Card.Body>
//                 <div className="chart-placeholder">
//                   <FaChartLine size={48} className="text-muted" />
//                   <p>Gráfico de actividad se mostrará aquí</p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col xl={4} className="mb-4">
//             <Card className="main-card">
//               <Card.Header>
//                 <h5>Acciones Rápidas</h5>
//               </Card.Header>
//               <Card.Body>
//                 <div className="quick-actions">
//                   <button className="quick-btn">
//                     <FaFileAlt className="me-2" /> Generar Reporte
//                   </button>
//                   <button className="quick-btn">
//                     <FaUsers className="me-2" /> Administrar Usuarios
//                   </button>
//                   <button className="quick-btn">
//                     <FaCalendarAlt className="me-2" /> Programar Tarea
//                   </button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default AdminInit;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaBell,
  FaCog
} from 'react-icons/fa';
import '../styles/initG.css';

const AdminInit = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('Administrador'); // Valor por defecto

  const stats = [
    { title: "Empleados Activos", value: "142", icon: <FaUsers size={24} />, trend: "↑ 5%", color: "#4e73df" },
    { title: "Recibos Firmados", value: "1,248", icon: <FaFileAlt size={24} />, trend: "↑ 12%", color: "#1cc88a" },
    { title: "Pendientes", value: "23", icon: <FaCalendarAlt size={24} />, trend: "↓ 3%", color: "#f6c23e" },
    { title: "Alertas", value: "7", icon: <FaBell size={24} />, trend: "↑ 2", color: "#e74a3b" }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      navigate('/');
      return;
    }

    const user = JSON.parse(storedUser);
    setUserData(user);
    setToken(storedToken);
    
    // Extraer el nombre del usuario
    if (user) {
      // Verifica diferentes posibles propiedades donde podría estar el nombre
      const nombre = user.Nombre || 'Administrador';
      setNombreUsuario(nombre);
    }
  }, [navigate]);

  return (
    <div className="gerencia-init">
      <Container fluid className="gerencia-content px-4">
        <div className="dash-header">
          <h1 className="welcome-title">
            Bienvenido, <span className="user-name">{nombreUsuario}</span>
          </h1>
          <div className="header-actions">
            <button className="action-btn">
              <FaCog className="me-2" /> Configuración
            </button>
          </div>
        </div>

        {/* Resto del código permanece igual */}
        <Row className="mt-4">
          {stats.map((stat, index) => (
            <Col xl={3} md={6} key={index} className="mb-4">
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-text">
                    <h6>{stat.title}</h6>
                    <h2>{stat.value}</h2>
                    <span className={`trend ${stat.trend.includes('↑') ? 'up' : 'down'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ... resto del componente ... */}
      </Container>
    </div>
  );
};

export default AdminInit;