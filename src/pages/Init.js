
// import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import Recibos from './Recibos';
// import '../styles/home.css';
// import EmployeeCard from '../components/Card';

// const Init = () => {
//   const userData = JSON.parse(localStorage.getItem('user'));
//   const token = localStorage.getItem('token');

//   const [recibos, setRecibos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!userData || !token) {
//       setError('No se encontraron datos del usuario o token.');
//       return;
//     }

//     const fetchRecibos = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`/api/datos/recibos?IdLegajo=${userData.Legajo}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error al obtener recibos: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setRecibos(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecibos();
//   }, [userData, token]);


//   return (
//     <div>
//       <Navbar />
//       <div className='cuerpo_h'>
//         <div className='title_init'>
//           <h2 className='welc'>Bienvenido a </h2>
//           <h2 className='color_si'> Si</h2>
//           <h2>Bus</h2>
//         </div>
//         {userData ? (
//           <>
//             <EmployeeCard userData={userData} />
//           </>
//         ) : (
//           <p>{error}</p>
//         )}

//         <hr />
//         <Recibos recibos={recibos} userLegajo={userData?.Legajo} />
//       </div>
//     </div>
//   );
// };

// export default Init;

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Recibos from './Recibos';
import '../styles/home.css';
import EmployeeCard from '../components/Card';
import { BeatLoader } from 'react-spinners';

const Init = () => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) setUserData(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!userData || !token) {
      setError('No se encontraron datos del usuario o token.');
      setLoading(false);
      return;
    }

    const fetchRecibos = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        setLoading(true);
        setError(null);
        

        const response = await fetch(`${API_URL}/api/datos/recibos?IdLegajo=${userData.Legajo}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener recibos: ${response.statusText}`);
        }

        const data = await response.json();
        setRecibos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecibos();
  }, [userData, token]);

  if (loading) return <BeatLoader />;

  return (
    <div>
      <Navbar />
      <div className='cuerpo_h'>
        <div className='title_init'>
          <h2 className='welc'>Bienvenido a </h2>
          <h2 className='color_si'> Si</h2>
          <h2>Bus</h2>
        </div>
        
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {userData && <EmployeeCard userData={userData} />}
            <hr />
            <Recibos recibos={recibos} userLegajo={userData?.Legajo} />
          </>
        )}
      </div>
    </div>
  );
};

export default Init;