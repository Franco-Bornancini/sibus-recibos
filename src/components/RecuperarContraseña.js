import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaIdCard, FaArrowLeft } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import '../styles/RecuperarContrasena.css';

const RecuperarContrasena = () => {
    const [step, setStep] = useState(1); // 1: Ingresar DNI, 2: Nueva contraseña
    const [dni, setDni] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmitDni = (e) => {
        e.preventDefault();
        setError('');
        
        if (!dni || dni.length < 7) {
        setError('Por favor ingrese un DNI válido');
        return;
        }

        // Simulamos validación con el backend
        setIsLoading(true);
        setTimeout(() => {
        setIsLoading(false);
        setStep(2); // Pasamos al siguiente paso
        }, 1500);
    };

    const handleSubmitNewPassword = (e) => {
        e.preventDefault();
        setError('');
        
        if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
        }

        if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
        }

        // Simulamos el cambio de contraseña
        setIsLoading(true);
        setTimeout(() => {
        setIsLoading(false);
        setSuccess('Contraseña actualizada correctamente');
        setTimeout(() => navigate('/'), 2000);
        }, 2000);
    };

    return (
        <div className="recover-container">
        <div className="recover-card">
            <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Volver
            </button>

            <div className="recover-header">
            <FaLock size={32} className="lock-icon" />
            <h2>{step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}</h2>
            </div>

            {step === 1 ? (
            <form onSubmit={handleSubmitDni} className="recover-form">
                <div className="form-group">
                <label htmlFor="dni">
                    <FaIdCard className="input-icon" /> DNI Completo
                </label>
                <input
                    id="dni"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ingrese su DNI sin puntos"
                    maxLength="8"
                    required
                    disabled={isLoading}
                />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? <BeatLoader size={8} color="#fff" /> : 'Continuar'}
                </button>
            </form>
            ) : (
            <form onSubmit={handleSubmitNewPassword} className="recover-form">
                <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={isLoading}
                />
                </div>

                <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita su nueva contraseña"
                    required
                    disabled={isLoading}
                />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? <BeatLoader size={8} color="#fff" /> : 'Cambiar Contraseña'}
                </button>
            </form>
            )}
        </div>
        </div>
    );
};

export default RecuperarContrasena;