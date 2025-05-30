import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from 'react-bootstrap';

const FirmaPad = ({ onFirmar, onCancelar, fileName }) => {
  const sigCanvasRef = useRef();

  const limpiar = () => {
    sigCanvasRef.current.clear();
  };

  const guardarFirma = () => {
    if (sigCanvasRef.current.isEmpty()) {
      alert("Por favor, firme antes de guardar.");
      return;
    }

    const dataUrl = sigCanvasRef.current.toDataURL("image/png");
    const base64 = dataUrl.split(',')[1];

    if (onFirmar) {
      onFirmar(dataUrl, base64);
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          ref={sigCanvasRef}
        />
      </div>
      <div className="mt-3 d-flex gap-2">
        <Button variant="secondary" onClick={limpiar}>Limpiar</Button>
        <Button variant="success" onClick={guardarFirma}>Guardar Firma</Button>
        <Button variant="danger" onClick={onCancelar}>Cancelar</Button>
      </div>
    </div>
  );
};

export default FirmaPad;