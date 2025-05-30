import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import FirmaPad from '../components/FirmasPad';
import DescargaRecibo from '../components/Descrecibos';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/recibos.css';

const Recibos = ({ recibos, userLegajo }) => {
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [datosReciboActual, setDatosReciboActual] = useState(null);

  const handleSeleccion = async (recibo) => {
    const [mes, anio] = recibo.Mes.split('/');
    const fileBase = `Leg${userLegajo}-${mes}-${anio}`;
    const pdfPath = `/assets/Cprueba/${fileBase}.pdf`;
    const fileName = `${fileBase}.png`;

    try {
      const res = await fetch(pdfPath, { method: 'HEAD' });

      if (!res.ok) {
        alert("El archivo PDF del recibo no está disponible.");
        return;
      }

      setReciboSeleccionado(recibo);
      setDatosReciboActual({ fileName, pdfPath });
      setMostrarFirma(true);

    } catch (error) {
      console.error("Error al verificar PDF:", error);
      alert("No se pudo verificar la existencia del archivo PDF.");
    }
  };


  const handleFirmaConfirmada = async (firmaDataUrl) => {
    if (!datosReciboActual || !reciboSeleccionado) return;

    const base64 = firmaDataUrl.split(',')[1];
    const token = localStorage.getItem('token');

    const payload = {
      NrLiq: reciboSeleccionado.NrLiq,
      Legajo: userLegajo,
      NrRecibo: reciboSeleccionado.NrRecibo,
      Base64Image: base64,
    };

    try {
      const response = await fetch('https://wsempleados.sibus.com.ar/api/Firma/firma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al subir la firma');
      }

      window.open(datosReciboActual.pdfPath, '_blank');
      setMostrarFirma(false);
    } catch (error) {
      console.error('Error al enviar firma:', error);
      alert("No se pudo enviar la firma.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Recibos de Sueldo</h3>
      <Table striped="rows">
        <thead className='table_enc'>
          <tr>
            <th>#</th>
            <th>Nº Liquidación</th>
            <th>Fecha</th>
            <th>Descargar</th>
          </tr>
        </thead>
        <tbody>
          {recibos.map((recibo, index) => (
            <tr key={`${recibo.NrLiq}-${recibo.NrRecibo}`} className={index % 2 === 0 ? 'fila-celeste' : 'fila-blanca'}>
              <td>{index + 1}</td>
              <td>{recibo.NrLiq}</td>
              <td>{recibo.Mes}</td>
              <td>
                {recibo.Firmado === 1 ? (
                  <DescargaRecibo
                    recibo={recibo}
                    userLegajo={userLegajo}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
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

      <Modal show={mostrarFirma} onHide={() => setMostrarFirma(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Firma del recibo</Modal.Title>
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