// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaLock, FaIdCard, FaArrowLeft } from 'react-icons/fa';
// import { BeatLoader } from 'react-spinners';
// import '../styles/RecuperarContrasena.css';

// const RecuperarContrasena = () => {
//     const [step, setStep] = useState(1); // 1: Ingresar DNI, 2: Nueva contraseña
//     const [dni, setDni] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmitDni = (e) => {
//         e.preventDefault();
//         setError('');
        
//         if (!dni || dni.length < 7) {
//         setError('Por favor ingrese un DNI válido');
//         return;
//         }

//         // Simulamos validación con el backend
//         setIsLoading(true);
//         setTimeout(() => {
//         setIsLoading(false);
//         setStep(2); // Pasamos al siguiente paso
//         }, 1500);
//     };

//     const handleSubmitNewPassword = (e) => {
//         e.preventDefault();
//         setError('');
        
//         if (newPassword.length < 6) {
//         setError('La contraseña debe tener al menos 6 caracteres');
//         return;
//         }

//         if (newPassword !== confirmPassword) {
//         setError('Las contraseñas no coinciden');
//         return;
//         }

//         // Simulamos el cambio de contraseña
//         setIsLoading(true);
//         setTimeout(() => {
//         setIsLoading(false);
//         setSuccess('Contraseña actualizada correctamente');
//         setTimeout(() => navigate('/'), 2000);
//         }, 2000);
//     };

//     return (
//         <div className="recover-container">
//         <div className="recover-card">
//             <button className="back-button" onClick={() => navigate(-1)}>
//             <FaArrowLeft /> Volver
//             </button>

//             <div className="recover-header">
//             <FaLock size={32} className="lock-icon" />
//             <h2>{step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}</h2>
//             </div>

//             {step === 1 ? (
//             <form onSubmit={handleSubmitDni} className="recover-form">
//                 <div className="form-group">
//                 <label htmlFor="dni">
//                     <FaIdCard className="input-icon" /> DNI Completo
//                 </label>
//                 <input
//                     id="dni"
//                     type="text"
//                     value={dni}
//                     onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
//                     placeholder="Ingrese su DNI sin puntos"
//                     maxLength="8"
//                     required
//                     disabled={isLoading}
//                 />
//                 </div>

//                 {error && <div className="error-message">{error}</div>}

//                 <button type="submit" className="submit-button" disabled={isLoading}>
//                 {isLoading ? <BeatLoader size={8} color="#fff" /> : 'Continuar'}
//                 </button>
//             </form>
//             ) : (
//             <form onSubmit={handleSubmitNewPassword} className="recover-form">
//                 <div className="form-group">
//                 <label htmlFor="newPassword">Nueva Contraseña</label>
//                 <input
//                     id="newPassword"
//                     type="password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     placeholder="Mínimo 6 caracteres"
//                     required
//                     disabled={isLoading}
//                 />
//                 </div>

//                 <div className="form-group">
//                 <label htmlFor="confirmPassword">Confirmar Contraseña</label>
//                 <input
//                     id="confirmPassword"
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     placeholder="Repita su nueva contraseña"
//                     required
//                     disabled={isLoading}
//                 />
//                 </div>

//                 {error && <div className="error-message">{error}</div>}
//                 {success && <div className="success-message">{success}</div>}

//                 <button type="submit" className="submit-button" disabled={isLoading}>
//                 {isLoading ? <BeatLoader size={8} color="#fff" /> : 'Cambiar Contraseña'}
//                 </button>
//             </form>
//             )}
//         </div>
//         </div>
//     );
// };

// export default RecuperarContrasena;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaKey, FaArrowLeft } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import '../styles/RecuperarContrasena.css';

const RecuperarContrasena = () => {
  const [step, setStep] = useState(1);
  const [legajo, setLegajo] = useState('');
  const [claveAnterior, setClaveAnterior] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const navigate = useNavigate();

  const userS = 'S18u5';
  const userkey = 'S-Bu5*wS/25';

  const obtenerToken = async () => {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: userS, clave: userkey })
    });

    if (!response.ok) throw new Error('Error al obtener token');

    const data = await response.json();
    return data.token;
  };

  const validarCredenciales = async (token) => {
    const response = await fetch('/api/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        usuario: legajo,
        clave: claveAnterior
      })
    });

    return response.ok;
  };

  const cambiarClave = async (token) => {
    const response = await fetch('/api/cambiaclave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        Legajo: legajo,
        ClaveAnterior: claveAnterior,
        ClaveNueva: nuevaClave
      })
    });

    return response.ok;
  };

  const handleSubmitCredenciales = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!legajo || !claveAnterior) {
      setError('Complete todos los campos');
      return;
    }

    if (intentosFallidos >= 3) {
      setError('Se excedieron los intentos. Contacte a RRHH.');
      return;
    }

    setIsLoading(true);
    try {
      const token = await obtenerToken();
      const ok = await validarCredenciales(token);
      if (ok) {
        setStep(2);
      } else {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);
        throw new Error(
          nuevosIntentos >= 3
            ? 'Intentos excedidos. Contacte a RRHH.'
            : `Credenciales inválidas. Intentos restantes: ${3 - nuevosIntentos}`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNuevaClave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (nuevaClave.length < 6) {
      setError('La nueva clave debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaClave !== confirmarClave) {
      setError('Las claves no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const token = await obtenerToken();
      const ok = await cambiarClave(token);
      if (!ok) throw new Error('No se pudo cambiar la contraseña');
      setSuccess('Contraseña cambiada exitosamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>

        <div className="recover-header">
          <FaLock size={32} className="lock-icon" />
          <h2>{step === 1 ? 'Verificar Credenciales' : 'Nueva Contraseña'}</h2>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmitCredenciales} className="recover-form">
            <div className="form-group">
              <label htmlFor="legajo"><FaUser className="input-icon" /> Legajo</label>
              <input
                id="legajo"
                type="text"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value.replace(/\D/g, ''))}
                placeholder="Ingrese su legajo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="claveAnterior"><FaKey className="input-icon" /> Clave Actual</label>
              <input
                id="claveAnterior"
                type="password"
                value={claveAnterior}
                onChange={(e) => setClaveAnterior(e.target.value)}
                placeholder="Ingrese su clave actual"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? <BeatLoader size={8} color="#fff" /> : 'Validar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitNuevaClave} className="recover-form">
            <div className="form-group">
              <label htmlFor="nuevaClave">Nueva Contraseña</label>
              <input
                id="nuevaClave"
                type="password"
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarClave">Confirmar Contraseña</label>
              <input
                id="confirmarClave"
                type="password"
                value={confirmarClave}
                onChange={(e) => setConfirmarClave(e.target.value)}
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

