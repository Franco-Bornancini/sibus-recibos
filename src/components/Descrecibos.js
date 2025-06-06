import React from 'react';
import { Button } from 'react-bootstrap';
import "../styles/descrecibo.css"

const DescargaRecibo = ({ recibo, userLegajo }) => {

    const [mes, anio] = recibo.Mes.split('/');
    const legajoFormateado = userLegajo.toString().padStart(4, '0');
    const secuencia = recibo.Secuencia; 
    const fileBase = `${anio}${mes}${secuencia}O${legajoFormateado}`;
    const pdfPath = `/assets/Recibos/${fileBase}.pdf`;
    const fileName = `${fileBase}.png`;
  

  const handleDescarga = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <Button variant="success" size="sm" onClick={handleDescarga} className='DescRec'>
      Ver recibo
    </Button>
  );
};

export default DescargaRecibo;