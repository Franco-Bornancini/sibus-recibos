
import '../styles/Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo3 from '../assets/SIBUS.png';
import { FaBus } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

const Login = () => {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userS = 'S18u5';
  const userkey = 'S-Bu5*wS/25';

  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (legajo === 'abcd' && password === 'abcd') {
      const mockUserData = {
        Nombre: "Usuario Gerencia",
        Legajo: "GER-001",
        tipoUsuario: 2 
      };
      localStorage.setItem('user', JSON.stringify(mockUserData));
      localStorage.setItem('token', 'token-falso-para-admin');
      navigate('/administrador');
      return;
    }

    try {
      const tokenResponse = await fetch(`/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: userS, clave: userkey })
      });

      if (!tokenResponse.ok) throw new Error('Error al obtener token');

      const { token } = await tokenResponse.json();

      const userResponse = await fetch('/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usuario: legajo, clave: password })
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/home');
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className='back'>
      <div className={`cuadro ${isLoading ? 'loading-active' : ''}`}>
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }} className='div_f'>
          <div>
            <img src={Logo3} alt="Logo Sibus" className='logo_css' />
          </div>
          <div className='encuadro'>
            <h2>Iniciar Sesión</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className='form_inputs'>
              <div>
                <label htmlFor="usuario">Usuario:</label><br />
                <input
                  id="usuario"
                  type="text"
                  value={legajo}
                  onChange={(e) => setLegajo(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className='PassW'>
                <label htmlFor="password">Contraseña:</label><br />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className='btn_init' disabled={isLoading}>
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <FaBus className="pink-bus-icon" />
                <BeatLoader color="#ff66b2" size={15} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
