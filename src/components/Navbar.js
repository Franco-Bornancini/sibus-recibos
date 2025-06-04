// import Container from 'react-bootstrap/Container';
// // import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Logo from '../assets/logosibus.png'
// import Logo2 from '../assets/LogoChico.png'
// import Logo3 from '../assets/SIBUS.png'
// import '../styles/Login.css'


// function ColorSchemesExample() {
//   return (
//     <>
//       <Navbar bg="dark" data-bs-theme="dark" >
//         <Container className='Nav_f'>
//           <Navbar.Brand href=""><img src={Logo}  alt="Icono Logo" className='logo_css'></img></Navbar.Brand>
//           {/* <Nav className="me-auto">
//             <Nav.Link href="/home">Inicio</Nav.Link>
//             <Nav.Link href="#">#</Nav.Link>
//             <Nav.Link href="/contactos" to="/contactos">Contactos</Nav.Link>
//           </Nav> */}
//         </Container>
//       </Navbar>
//       <br />
//     </>
//   );
// }

// export default ColorSchemesExample;

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo3 from '../assets/SIBUS.png'
import '../styles/Navbar.css';

function CustomNavbar({ userData }) {
  return (
    <Navbar expand="lg" className="sibus-navbar">
      <Container className="center">
        <Navbar.Brand href="/home" className="d-flex justify-content-center">
          <img src={Logo3} alt="SiBus Logo" className="navbar-logo" />
          {/* <span className="navbar-brand-text">SiBus</span> */}
        </Navbar.Brand>
        {/* <div className="user-info ms-auto">
          <FaUserCircle className="user-icon" />
          <span className="user-name">{userData?.Nombre || 'Usuario'}</span>
        </div> */}
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;