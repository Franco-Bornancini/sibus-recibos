import React from 'react';
import { Button } from 'react-bootstrap';
import "../styles/descrecibo.css"

const DescargaRecibo = ({ recibo, userLegajo }) => {
  const [mes, anio] = recibo.Mes.split('/');
  const fileBase = `Leg${userLegajo}-${mes}-${anio}`;
  const pdfPath = `/assets/Cprueba/${fileBase}.pdf`;
  

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