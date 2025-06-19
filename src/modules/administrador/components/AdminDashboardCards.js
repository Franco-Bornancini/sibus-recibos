// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
// import { FaExclamationCircle, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';
// import axios from 'axios';

// const AdminDashboardCards = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [cantidadPendientes, setCantidadPendientes] = useState(0);
//     const [cantidadResueltos, setCantidadResueltos] = useState(0);
//     const [cantidadValidados, setCantidadValidados] = useState(0);

//     const fetchCantidadPorEstado = async (estado) => {
//         try {
//         const token = localStorage.getItem('token');
//         const params = {
//             sMes: '99/9999',
//             IdLegajo: 0,
//             nFirmado: 1,
//             nValidado: 0,
//             nProtestado: 0,
//             nResuelto: 0,
//         };

//         if (estado === 'pendientes') params.nProtestado = 1;
//         if (estado === 'resueltos') params.nResuelto = 1;
//         if (estado === 'validados') {
//             params.nResuelto = 1;
//             params.nValidado = 1;
//         }

//         const response = await axios.get('/api/Consultas/consultarecibos', {
//             params,
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         return response.data.length;
//         } catch (err) {
//         throw new Error('Error al obtener datos de ' + estado);
//         }
//     };

//     useEffect(() => {
//         const cargarCantidades = async () => {
//         try {
//             setLoading(true);
//             const [pend, res, val] = await Promise.all([
//             fetchCantidadPorEstado('pendientes'),
//             fetchCantidadPorEstado('resueltos'),
//             fetchCantidadPorEstado('validados'),
//             ]);
//             setCantidadPendientes(pend);
//             setCantidadResueltos(res);
//             setCantidadValidados(val);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//         };

//         cargarCantidades();
//     }, []);

//     if (loading) return <Spinner animation="border" className="mt-4" />;

//     if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

//     return (
//         <Row className="mt-4">
//         <Col md={4}>
//             <Card className="stat-card border-warning">
//             <Card.Body className="d-flex align-items-center">
//                 <div className="stat-icon bg-warning text-white me-3 p-3 rounded-circle">
//                 <FaExclamationCircle size={30} />
//                 </div>
//                 <div>
//                 <h6 className="mb-1">Pendientes</h6>
//                 <h3>{cantidadPendientes}</h3>
//                 </div>
//             </Card.Body>
//             </Card>
//         </Col>

//         <Col md={4}>
//             <Card className="stat-card border-success">
//             <Card.Body className="d-flex align-items-center">
//                 <div className="stat-icon bg-success text-white me-3 p-3 rounded-circle">
//                 <FaCheckCircle size={30} />
//                 </div>
//                 <div>
//                 <h6 className="mb-1">Resueltos</h6>
//                 <h3>{cantidadResueltos}</h3>
//                 </div>
//             </Card.Body>
//             </Card>
//         </Col>

//         <Col md={4}>
//             <Card className="stat-card border-info">
//             <Card.Body className="d-flex align-items-center">
//                 <div className="stat-icon bg-info text-white me-3 p-3 rounded-circle">
//                 <FaClipboardCheck size={30} />
//                 </div>
//                 <div>
//                 <h6 className="mb-1">Validados</h6>
//                 <h3>{cantidadValidados}</h3>
//                 </div>
//             </Card.Body>
//             </Card>
//         </Col>
//         </Row>
//     );
// };

// export default AdminDashboardCards;

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AdminDashboardCards = () => {
  const [stats, setStats] = useState({ 
    pendientes: 0, 
    resueltos: 0, 
    validados: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const COLORS = ['#FFC107', '#28A745', '#17A2B8'];
  const ICONS = {
    pendientes: <FaExclamationTriangle className="text-warning" size={24} />,
    resueltos: <FaCheckCircle className="text-success" size={24} />,
    validados: <FaClipboardCheck className="text-info" size={24} />
  };

  const fetchCantidadPorEstado = async (estado) => {
    try {
      const token = localStorage.getItem('token');
      const params = {
        sMes: '99/9999',
        IdLegajo: 0,
        nFirmado: 1,
        nValidado: 0,
        nProtestado: 0,
        nResuelto: 0,
      };

      // Configuración de parámetros según estado
      switch(estado) {
        case 'pendientes':
          params.nProtestado = 1;
          break;
        case 'resueltos':
          params.nResuelto = 1;
          break;
        case 'validados':
          params.nResuelto = 1;
          params.nValidado = 1;
          break;
        default:
          break;
      }

      const response = await axios.get('/api/Consultas/consultarecibos', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.length;
    } catch (err) {
      console.error(`Error fetching ${estado}:`, err);
      throw new Error(`Error al obtener datos de ${estado}`);
    }
  };

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const [pendientes, resueltos, validados] = await Promise.all([
          fetchCantidadPorEstado('pendientes'),
          fetchCantidadPorEstado('resueltos'),
          fetchCantidadPorEstado('validados')
        ]);
        
        setStats({
          pendientes,
          resueltos,
          validados
        });
      } catch (err) {
        setError(err.message || 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  const chartData = [
    { name: 'Pendientes', value: stats.pendientes },
    { name: 'Resueltos', value: stats.resueltos },
    { name: 'Validados', value: stats.validados },
  ];

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  return (
    <div className="dashboard-cards">
      <h3 className="mb-4 text-center">Resumen de Reclamos</h3>
      
      <Row className="mb-4">
        {Object.entries(stats).map(([key, value], index) => (
          <Col key={key} xl={4} md={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center py-3">
                <div className="mb-2">{ICONS[key]}</div>
                <h5 className="text-uppercase text-muted mb-1">{key}</h5>
                <h2 className="mb-0">{value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {chartData.some(item => item.value > 0) && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="text-center mb-3">Distribución de Reclamos</h5>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} reclamos`, 'Cantidad']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardCards;