import React, { useState } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaSearch, FaCheck, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import FirmaPad from '../components/FirmasPad';
import DescargaRecibo from '../components/Descrecibos';
import ReclamoForm from '../components/reclamoRecibo';
import ResolucionModal from '../components/ResolucionModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/recibos.css';

const Recibos = ({ recibos, userLegajo, userName, refetchRecibos }) => {
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [datosReciboActual, setDatosReciboActual] = useState(null);
  const [filtroMes, setFiltroMes] = useState('');
  const [mostrarResolucion, setMostrarResolucion] = useState(false);
  const [resolucionActual, setResolucionActual] = useState(null);

  const handleSeleccion = async (recibo) => {
    const [mes, anio] = recibo.Mes.split('/');
    const legajoFormateado = userLegajo.toString().padStart(4, '0');
    const secuencia = recibo.Secuencia;
    const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
    const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
    const fileName = `${fileBase}.png`;

    try {
      const res = await fetch(pdfPath);
      if (!res.ok) return alert("El archivo PDF del recibo no está disponible.");
      setReciboSeleccionado(recibo);
      setDatosReciboActual({ fileName, pdfPath });
      setMostrarFirma(true);
    } catch {
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

      localStorage.setItem('firmaEmpleado', base64);

      setMostrarFirma(false);
      setReciboSeleccionado(null);
      setDatosReciboActual(null);

      await refetchRecibos();
      window.open(datosReciboActual.pdfPath, '_blank');
    } catch {
      alert("No se pudo enviar la firma.");
    }
  };

  // Validar recibo
  const handleAceptarRecibo = async (recibo) => {
    try {
      const token = localStorage.getItem('token');
      
      const validationResponse = await fetch(`/api/Procesos/valida`, {
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

      if (!validationResponse.ok) throw new Error('Error al validar el recibo');

      const protestaResponse = await fetch(`/api/Procesos/protesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Mes: recibo.Mes,
          Secuencia: recibo.Secuencia,
          Legajo: userLegajo,
          Protesta: 0,
          ObsProt: recibo.ObsProt || ''
        }),
      });

      if (!protestaResponse.ok) throw new Error('Error al actualizar estado de protesta');

      // 3. Actualizamos la lista de recibos
      await refetchRecibos();
      alert('Recibo validado correctamente');
      
    } catch (error) {
      alert('Error al procesar la validación');
      console.error('Error completo:', error);
    }
  };

  // Reclamo de recibo
  const handleReclamoSuccess = async () => {
    await refetchRecibos();
  };

  // Resolucion del recibo
  const handleVerResolucion = (recibo) => {
    setResolucionActual(recibo);
    setMostrarResolucion(true);
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
                <tr key={`${recibo.Mes}-${recibo.Secuencia}`} className={index % 2 === 0 ? 'fila-celeste' : 'fila-blanca'}>
                  <td>{index + 1}</td>
                  <td>{recibo.Secuencia}</td>
                  <td>{recibo.Mes}</td>
                  <td>
                    {recibo.Firmado === 1 ? (
                      <div className="d-flex flex-wrap gap-2">
                        <DescargaRecibo recibo={recibo} userLegajo={userLegajo} />
                        {recibo.Valida !== 1 && ( // cambiar validado por valida
                          <>
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
                            {recibo.Resuelto === 1 && (
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleVerResolucion(recibo)}
                                title="Ver resolución del reclamo"
                              >
                                <FaEye className="me-1" />
                              </Button>
                            )}
                          </>
                        )}
                        
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
      {reciboSeleccionado && (
        <ReclamoForm
          show={!!reciboSeleccionado}
          onHide={() => setReciboSeleccionado(null)}
          recibo={reciboSeleccionado}
          userLegajo={userLegajo}
          userName={userName}
          onReclamoSuccess={handleReclamoSuccess}
        />
      )}

      {/* Modal para resolución */}
      <ResolucionModal
        show={mostrarResolucion}
        onHide={() => setMostrarResolucion(false)}
        resolucion={resolucionActual}
      />
    </div>
  );
};

export default Recibos;
