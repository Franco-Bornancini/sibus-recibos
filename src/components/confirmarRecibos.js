
import React , {useState} from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';

const ConfirmarRecibo = ({ recibo, userLegajo, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
        await onConfirm(recibo);
        } finally {
        setLoading(false);
        }
    };

    return (
        <Button 
        variant="success" 
        size="sm" 
        onClick={handleConfirm}
        disabled={loading}
        title="Confirmar que el recibo está correcto"
        >
        <FaCheck />
        {loading ? ' Confirmando...' : ''}
        </Button>
    );
};

export default ConfirmarRecibo;