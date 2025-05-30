import '../styles/Login.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logosibus.png'

const Login = () => {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();

      const tokenResponse = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: 'string', clave: 'string' })
      });

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
      }
    };

  return (
    <div className='back'>
        <div className='cuadro'>
            <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }} className='div_f'>
            <div>
                <img src={Logo} className='logo_css'/>
            </div>
            <div className='encuadro'>
              <h2>Iniciar Sesión</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleSubmit} className='form_inputs'>
                  <div>
                  <label>Usuario:</label><br />
                  <input
                    type="text"
                    value={legajo}
                    onChange={(e) => setLegajo(e.target.value)}
                    required
                  />
                  </div>
                  <div style={{  }} className='PassW'>
                  <label>Contraseña:</label><br />
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  </div>
                  <button type="submit" style={{ marginTop: '1rem' }} className='btn_init'>Ingresar</button>
              </form>
            </div>
            </div>
        </div>
    </div>
  );
};

export default Login;
