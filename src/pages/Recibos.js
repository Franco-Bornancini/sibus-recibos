
// import React, { useState } from 'react';
// import { Table, Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
// import { FaSearch } from 'react-icons/fa';
// import FirmaPad from '../components/FirmasPad';
// import DescargaRecibo from '../components/Descrecibos';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/recibos.css';

// const Recibos = ({ recibos, userLegajo, refetchRecibos }) => {
//   const [mostrarFirma, setMostrarFirma] = useState(false);
//   const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
//   const [datosReciboActual, setDatosReciboActual] = useState(null);
//   const [filtroMes, setFiltroMes] = useState('');

//   const handleSeleccion = async (recibo) => {

//     const [mes, anio] = recibo.Mes.split('/');
//     const legajoFormateado = userLegajo.toString().padStart(4, '0');
//     const secuencia = recibo.Secuencia;
//     const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
//     const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
//     const fileName = `${fileBase}.png`;

//     console.log("PDF rute",pdfPath)

//     try {
//       const res = await fetch(pdfPath, { method: 'GET' });
//       if (!res.ok) return alert("El archivo PDF del recibo no está disponible.");
//       setReciboSeleccionado(recibo);
//       setDatosReciboActual({ fileName, pdfPath });
//       setMostrarFirma(true);
//     } catch (error) {
//       alert("No se pudo verificar la existencia del archivo PDF.");
//     }
//   };

//   const handleFirmaConfirmada = async (firmaDataUrl) => {
//     if (!datosReciboActual || !reciboSeleccionado) return;
//     const base64 = firmaDataUrl.split(',')[1];
//     const token = localStorage.getItem('token');

//     const payload = {
//       Mes: reciboSeleccionado.Mes,           // ej: "04/2025"
//       Secuencia: reciboSeleccionado.Secuencia, // sin ceros a la izquierda
//       Legajo: userLegajo,                      // tal como fue ingresado
//       Base64Image: base64,                     // solo la parte base64
//     };

//     try {
//       const response = await fetch(`/api/Firma/firma`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error('Error al subir la firma');

//       setMostrarFirma(false);
//       setReciboSeleccionado(null);
//       setDatosReciboActual(null);

//       await refetchRecibos();

//       window.open(payload.pdfPath || datosReciboActual.pdfPath, '_blank'); // abrir PDF
//     } catch (error) {
//       alert("No se pudo enviar la firma.");
//     }
//   };

//   const recibosFiltrados = recibos.filter((recibo) =>
//     recibo.Mes.toLowerCase().includes(filtroMes.toLowerCase())
//   );

//   return (
//     <div className="container py-4">
//       <Card className="shadow-lg rounded-4 p-4">
//         <h3 className="mb-4 text-center text-dark-emphasis">📄 Recibos de Sueldo</h3>

//         <Row className="mb-4">
//           <Col md={6} className="mx-auto">
//             <InputGroup>
//               <InputGroup.Text><FaSearch /></InputGroup.Text>
//               <Form.Control
//                 type="text"
//                 placeholder="Buscar por mes (ej: 04/2025)"
//                 value={filtroMes}
//                 onChange={(e) => setFiltroMes(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//         </Row>

//         <div className="table-responsive">
//           <Table hover bordered className="tabla-estilizada">
//             <thead className="table-encabezado text-white">
//               <tr>
//                 <th>#</th>
//                 <th>Nº Sec.</th>
//                 <th>Fecha</th>
//                 <th>Acción</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recibosFiltrados.map((recibo, index) => (
//                 <tr key={`${recibo.NrLiq}-${recibo.NrRecibo}`} className={index % 2 === 0 ? 'fila-celeste' : 'fila-blanca'}>
//                   <td>{index + 1}</td>
//                   <td>{recibo.Secuencia}</td>
//                   <td>{recibo.Mes}</td>
//                   <td>
//                     {recibo.Firmado === 1 ? (
//                       <DescargaRecibo recibo={recibo} userLegajo={userLegajo} />
//                     ) : (
//                       <Button
//                         size="sm"
//                         variant="outline-pink"
//                         className="btn-firma"
//                         onClick={() => handleSeleccion(recibo)}
//                       >
//                         Firmar y Ver
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Card>

//       <Modal show={mostrarFirma} onHide={() => setMostrarFirma(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Firma del Recibo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {datosReciboActual && (
//             <FirmaPad
//               onFirmar={handleFirmaConfirmada}
//               onCancelar={() => setMostrarFirma(false)}
//               fileName={datosReciboActual.fileName}
//             />
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Recibos;


// ------------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import { Table, Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
// import { FaSearch, FaDownload } from 'react-icons/fa';
// import FirmaPad from '../components/FirmasPad';
// import DescargaRecibo from '../components/Descrecibos';
// import confirmarRecibo from '../components/confirmarRecibos';
// import reclamoRecibo from '../components/reclamoRecibo';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/recibos.css';

// const Recibos = ({ recibos, userLegajo, refetchRecibos }) => {
//   const [mostrarFirma, setMostrarFirma] = useState(false);
//   const [mostrarReclamo, setMostrarReclamo] = useState(false);
//   const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
//   const [datosReciboActual, setDatosReciboActual] = useState(null);
//   const [filtroMes, setFiltroMes] = useState('');
//   const [motivoReclamo, setMotivoReclamo] = useState('');
//   const [reclamoEnProceso, setReclamoEnProceso] = useState(false);

//   const handleSeleccion = async (recibo) => {
//     const [mes, anio] = recibo.Mes.split('/');
//     const legajoFormateado = userLegajo.toString().padStart(4, '0');
//     const secuencia = recibo.Secuencia;
//     const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
//     const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
//     const fileName = `${fileBase}.png`;

//     try {
//       const res = await fetch(pdfPath, { method: 'GET' });
//       if (!res.ok) return alert("El archivo PDF del recibo no está disponible.");
//       setReciboSeleccionado(recibo);
//       setDatosReciboActual({ fileName, pdfPath });
//       setMostrarFirma(true);
//     } catch (error) {
//       alert("No se pudo verificar la existencia del archivo PDF.");
//     }
//   };

//   const handleFirmaConfirmada = async (firmaDataUrl) => {
//     if (!datosReciboActual || !reciboSeleccionado) return;
//     const base64 = firmaDataUrl.split(',')[1];
//     const token = localStorage.getItem('token');

//     const payload = {
//       Mes: reciboSeleccionado.Mes,
//       Secuencia: reciboSeleccionado.Secuencia,
//       Legajo: userLegajo,
//       Base64Image: base64,
//     };

//     try {
//       const response = await fetch(`/api/Firma/firma`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error('Error al subir la firma');

//       setMostrarFirma(false);
//       setReciboSeleccionado(null);
//       setDatosReciboActual(null);

//       await refetchRecibos();

//       window.open(payload.pdfPath || datosReciboActual.pdfPath, '_blank');
//     } catch (error) {
//       alert("No se pudo enviar la firma.");
//     }
//   };

//   const handleAceptarRecibo = async (recibo) => {
//     // Lógica para marcar el recibo como aceptado
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/Recibos/aceptar`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Mes: recibo.Mes,
//           Secuencia: recibo.Secuencia,
//           Legajo: userLegajo,
//           Estado: 'Aceptado'
//         }),
//       });

//       if (!response.ok) throw new Error('Error al aceptar el recibo');

//       await refetchRecibos();
//       alert('Recibo aceptado correctamente');
//     } catch (error) {
//       alert('Error al aceptar el recibo');
//     }
//   };

//   const handleEnviarReclamo = async () => {
//     if (!reciboSeleccionado || !motivoReclamo) return;
    
//     setReclamoEnProceso(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/Recibos/reclamo`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Mes: reciboSeleccionado.Mes,
//           Secuencia: reciboSeleccionado.Secuencia,
//           Legajo: userLegajo,
//           Motivo: motivoReclamo,
//           Fecha: new Date().toISOString()
//         }),
//       });

//       if (!response.ok) throw new Error('Error al enviar el reclamo');

//       // Generar PDF del reclamo (esto dependerá de tu backend)
//       const pdfResponse = await fetch(`/api/Recibos/generar-reclamo-pdf`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Mes: reciboSeleccionado.Mes,
//           Secuencia: reciboSeleccionado.Secuencia,
//           Legajo: userLegajo,
//           Nombre: "Nombre del empleado", // Deberías obtener esto de tu estado
//           Motivo: motivoReclamo,
//           Fecha: new Date().toLocaleDateString()
//         }),
//       });

//       const pdfBlob = await pdfResponse.blob();
//       const pdfUrl = URL.createObjectURL(pdfBlob);
//       window.open(pdfUrl, '_blank');

//       setMostrarReclamo(false);
//       setMotivoReclamo('');
//       setReciboSeleccionado(null);
      
//       await refetchRecibos();
//       alert('Reclamo enviado correctamente');
//     } catch (error) {
//       alert('Error al enviar el reclamo');
//     } finally {
//       setReclamoEnProceso(false);
//     }
//   };

//   const handleAbrirReclamo = (recibo) => {
//     setReciboSeleccionado(recibo);
//     setMostrarReclamo(true);
//   };

//   const recibosFiltrados = recibos.filter((recibo) =>
//     recibo.Mes.toLowerCase().includes(filtroMes.toLowerCase())
//   );

//   return (
//     <div className="container py-4">
//       <Card className="shadow-lg rounded-4 p-4">
//         <h3 className="mb-4 text-center text-dark-emphasis">📄 Recibos de Sueldo</h3>

//         <Row className="mb-4">
//           <Col md={6} className="mx-auto">
//             <InputGroup>
//               <InputGroup.Text><FaSearch /></InputGroup.Text>
//               <Form.Control
//                 type="text"
//                 placeholder="Buscar por mes (ej: 04/2025)"
//                 value={filtroMes}
//                 onChange={(e) => setFiltroMes(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//         </Row>

//         <div className="table-responsive">
//           <Table hover bordered className="tabla-estilizada">
//             <thead className="table-encabezado text-white">
//               <tr>
//                 <th>#</th>
//                 <th>Nº Sec.</th>
//                 <th>Fecha</th>
//                 <th>Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recibosFiltrados.map((recibo, index) => (
//                 <tr key={`${recibo.NrLiq}-${recibo.NrRecibo}`} className={index % 2 === 0 ? 'fila-celeste' : 'fila-blanca'}>
//                   <td>{index + 1}</td>
//                   <td>{recibo.Secuencia}</td>
//                   <td>{recibo.Mes}</td>
//                   <td>
//                     {recibo.Firmado === 1 ? (
//                       <div className="d-flex gap-2 botons_actions">
//                         <DescargaRecibo recibo={recibo} userLegajo={userLegajo} />
//                         <confirmarRecibo recibo={recibo} onConfirmar={handleAceptarRecibo} />
//                         <reclamoRecibo recibo={recibo} onReclamar={handleAbrirReclamo} />
//                         {/* <Button 
//                           variant="success" 
//                           size="sm" 
//                           onClick={() => handleAceptarRecibo(recibo)}
//                           title="Aceptar recibo"
//                         >
//                           <FaCheck />
//                         </Button>
//                         <Button 
//                           variant="warning" 
//                           size="sm" 
//                           onClick={() => handleAbrirReclamo(recibo)}
//                           title="Reclamar diferencias"
//                         >
//                           <FaExclamationTriangle />
//                         </Button> */}
//                       </div>
//                     ) : (
//                       <Button
//                         size="sm"
//                         variant="outline-pink"
//                         className="btn-firma"
//                         onClick={() => handleSeleccion(recibo)}
//                         title="Firmar y descargar"
//                       >
//                         <FaDownload />
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Card>

//       {/* Modal para firma */}
//       <Modal show={mostrarFirma} onHide={() => setMostrarFirma(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Firma del Recibo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {datosReciboActual && (
//             <FirmaPad
//               onFirmar={handleFirmaConfirmada}
//               onCancelar={() => setMostrarFirma(false)}
//               fileName={datosReciboActual.fileName}
//             />
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Modal para reclamo */}
//       <Modal show={mostrarReclamo} onHide={() => setMostrarReclamo(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Reclamo por Diferencias</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Legajo</Form.Label>
//               <Form.Control type="text" value={userLegajo} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Mes del Recibo</Form.Label>
//               <Form.Control 
//                 type="text" 
//                 value={reciboSeleccionado?.Mes || ''} 
//                 readOnly 
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Secuencia</Form.Label>
//               <Form.Control 
//                 type="text" 
//                 value={reciboSeleccionado?.Secuencia || ''} 
//                 readOnly 
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Motivo del Reclamo *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 value={motivoReclamo}
//                 onChange={(e) => setMotivoReclamo(e.target.value)}
//                 placeholder="Describa detalladamente las diferencias encontradas..."
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setMostrarReclamo(false)}>
//             Cancelar
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleEnviarReclamo}
//             disabled={!motivoReclamo || reclamoEnProceso}
//           >
//             {reclamoEnProceso ? 'Enviando...' : 'Enviar Reclamo'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Recibos;

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { FaSearch, FaCheck, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import FirmaPad from '../components/FirmasPad';
import DescargaRecibo from '../components/Descrecibos';
import ReclamoForm from '../components/reclamoRecibo';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/recibos.css';

const Recibos = ({ recibos, userLegajo, userName, refetchRecibos }) => {
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [datosReciboActual, setDatosReciboActual] = useState(null);
  const [filtroMes, setFiltroMes] = useState('');

  console.log("Nombre de usuario:", userName); // Verifica que tenga valor

  const handleSeleccion = async (recibo) => {
    const [mes, anio] = recibo.Mes.split('/');
    const legajoFormateado = userLegajo.toString().padStart(4, '0');
    const secuencia = recibo.Secuencia;
    const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
    const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
    const fileName = `${fileBase}.png`;

    try {
      const res = await fetch(pdfPath, { method: 'GET' });
      if (!res.ok) return alert("El archivo PDF del recibo no está disponible.");
      setReciboSeleccionado(recibo);
      setDatosReciboActual({ fileName, pdfPath });
      setMostrarFirma(true);
    } catch (error) {
      alert("No se pudo verificar la existencia del archivo PDF.");
    }
  };

  // Firma
  const handleFirmaConfirmada = async (firmaDataUrl) => {
    if (!datosReciboActual || !reciboSeleccionado) return;
    const base64 = firmaDataUrl.split(',')[1];
    const token = localStorage.getItem('token');

    const payload = {
      Mes: reciboSeleccionado.Mes,
      Secuencia: reciboSeleccionado.Secuencia,
      Legajo: userLegajo,
      Base64Image: base64,
    };

    try {
      const response = await fetch(`/api/Procesos/firma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al subir la firma');

      localStorage.setItem('firmaEmpleado', base64); // <-- GUARDAR FIRMA

      setMostrarFirma(false);
      setReciboSeleccionado(null);
      setDatosReciboActual(null);

      await refetchRecibos();

      window.open(datosReciboActual.pdfPath, '_blank');
    } catch (error) {
      alert("No se pudo enviar la firma.");
    }
  };



  // Validacion / Confirmacion
  const handleAceptarRecibo = async (recibo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/Procesos/valida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Mes: recibo.Mes,
          Secuencia: recibo.Secuencia,
          Legajo: userLegajo,
          Valida: 1
        }),
      });

      if (!response.ok) throw new Error('Error al validar el recibo');

      await refetchRecibos(); // asumimos que actualiza el estado de los recibos
      alert('Recibo validado correctamente');
    } catch (error) {
      alert('Error al validar el recibo');
      console.error(error);
    }
  };


  const handleReclamoSuccess = (pdfPath) => {
    console.log('Reclamo guardado en:', pdfPath);
    // window.open(pdfPath, '_blank');
  };

  const recibosFiltrados = recibos.filter((recibo) =>
    recibo.Mes.toLowerCase().includes(filtroMes.toLowerCase())
  );

  return (
    <div className="container py-4">
      <Card className="shadow-lg rounded-4 p-4">
        <h3 className="mb-4 text-center text-dark-emphasis">📄 Recibos de Sueldo</h3>

        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por mes (ej: 04/2025)"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table hover bordered className="tabla-estilizada">
            <thead className="table-encabezado text-white">
              <tr>
                <th>#</th>
                <th>Nº Sec.</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recibosFiltrados.map((recibo, index) => (
                <tr key={`${recibo.NrLiq}-${recibo.NrRecibo}`} className={index % 2 === 0 ? 'fila-celeste' : 'fila-blanca'}>
                  <td>{index + 1}</td>
                  <td>{recibo.Secuencia}</td>
                  <td>{recibo.Mes}</td>
                  <td>
                    {recibo.Firmado === 1 ? (
                      <div className="d-flex gap-2">
                        <DescargaRecibo recibo={recibo} userLegajo={userLegajo} />
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleAceptarRecibo(recibo)}
                          title="Aceptar recibo"
                        >
                          <FaCheck />
                        </Button>
                        <Button 
                          variant="warning" 
                          size="sm" 
                          onClick={() => setReciboSeleccionado(recibo)}
                          title="Reclamar diferencias"
                        >
                          <FaExclamationTriangle />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-pink"
                        className="btn-firma"
                        onClick={() => handleSeleccion(recibo)}
                        title="Firmar y descargar"
                      >
                        <FaDownload />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Modal para firma */}
      <Modal show={mostrarFirma} onHide={() => setMostrarFirma(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Firma del Recibo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {datosReciboActual && (
            <FirmaPad
              onFirmar={handleFirmaConfirmada}
              onCancelar={() => setMostrarFirma(false)}
              fileName={datosReciboActual.fileName}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para reclamo */}
      {/* {reciboSeleccionado && (
        <ReclamoForm
          show={!!reciboSeleccionado}
          onHide={() => setReciboSeleccionado(null)}
          recibo={reciboSeleccionado}
          userLegajo={userLegajo}
          userName={userName}
          onReclamoSuccess={handleReclamoSuccess}
        />
      )} */}
      {reciboSeleccionado && (
        <ReclamoForm
          show={!!reciboSeleccionado}
          onHide={() => setReciboSeleccionado(null)}
          recibo={reciboSeleccionado}
          userLegajo={userLegajo}
          userName={userName} // Asegúrate que esta prop esté llegando correctamente
          
          onReclamoSuccess={handleReclamoSuccess}
        />
      )}

    </div>
  );
};

export default Recibos;