
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import FirmaPad from '../components/FirmasPad';
import DescargaRecibo from '../components/Descrecibos';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/recibos.css';

const Recibos = ({ recibos, userLegajo, refetchRecibos }) => {
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [datosReciboActual, setDatosReciboActual] = useState(null);
  const [filtroMes, setFiltroMes] = useState('');

  const handleSeleccion = async (recibo) => {

    const [mes, anio] = recibo.Mes.split('/');
    const legajoFormateado = userLegajo.toString().padStart(4, '0');
    const secuencia = recibo.Secuencia;
    const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
    const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
    const fileName = `${fileBase}.png`;

    console.log("PDF rute",pdfPath)

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

  const handleFirmaConfirmada = async (firmaDataUrl) => {
    if (!datosReciboActual || !reciboSeleccionado) return;
    const base64 = firmaDataUrl.split(',')[1];
    const token = localStorage.getItem('token');

    const payload = {
      Mes: reciboSeleccionado.Mes,           // ej: "04/2025"
      Secuencia: reciboSeleccionado.Secuencia, // sin ceros a la izquierda
      Legajo: userLegajo,                      // tal como fue ingresado
      Base64Image: base64,                     // solo la parte base64
    };

    try {
      const response = await fetch(`/api/Firma/firma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al subir la firma');

      setMostrarFirma(false);
      setReciboSeleccionado(null);
      setDatosReciboActual(null);

      await refetchRecibos();

      window.open(payload.pdfPath || datosReciboActual.pdfPath, '_blank'); // abrir PDF
    } catch (error) {
      alert("No se pudo enviar la firma.");
    }
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
                <th>Acción</th>
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
                      <DescargaRecibo recibo={recibo} userLegajo={userLegajo} />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-pink"
                        className="btn-firma"
                        onClick={() => handleSeleccion(recibo)}
                      >
                        Firmar y Ver
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

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
    </div>
  );
};

export default Recibos;