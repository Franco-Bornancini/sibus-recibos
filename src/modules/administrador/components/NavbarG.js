// import React, { useState } from 'react';
// import { Navbar, Container, Nav, Offcanvas, Button } from 'react-bootstrap';
// import { FaSignOutAlt } from 'react-icons/fa';
// import Logo from '../../../assets/SIBUS.png';
// import { useNavigate } from 'react-router-dom';
// import '../styles/navbarG.css';

// function GerenciaNavbar() {
//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   return (
//     <Navbar expand="lg" className="gerencia-navbar">
//       <Container fluid>

//         <Navbar.Brand href="/gerencia" className="mx-auto mx-lg-0">
//           <img src={Logo} alt="SiBus Logo" className="navbar-logo" />
//         </Navbar.Brand>

//         <Navbar.Toggle 
//           aria-controls="offcanvasNavbar" 
//           className="d-lg-none hamburger-btn"
//           onClick={() => setShowMenu(true)}
//         />

//         <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
//           <Nav className="ms-auto align-items-center">
//             <Nav.Link href="#gerencia" className="nav-link">Opción 1</Nav.Link>
//             <Nav.Link href="#gerencia" className="nav-link">Opción 2</Nav.Link>
//             <Nav.Link href="#gerencia" className="nav-link">Opción 3</Nav.Link>
            
//             <Button 
//               variant="link" 
//               className="logout-btn"
//               onClick={handleLogout}
//             >
//               <FaSignOutAlt className="me-2" />
//               Cerrar sesión
//             </Button>
//           </Nav>
//         </Navbar.Collapse>

//         <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end" className="gerencia-offcanvas">
//           <Offcanvas.Header closeButton>
//             <Offcanvas.Title>Menú</Offcanvas.Title>
//           </Offcanvas.Header>
//           <Offcanvas.Body>
//             <Nav className="flex-column">
//               <Nav.Link href="#opcion1" className="nav-link" onClick={() => setShowMenu(false)}>Opción 1</Nav.Link>
//               <Nav.Link href="#opcion2" className="nav-link" onClick={() => setShowMenu(false)}>Opción 2</Nav.Link>
//               <Nav.Link href="#opcion3" className="nav-link" onClick={() => setShowMenu(false)}>Opción 3</Nav.Link>
              
//               <div className="mt-3 pt-3 border-top">
//                 <Button 
//                   variant="outline-light" 
//                   className="w-100 logout-btn-mobile"
//                   onClick={() => {
//                     handleLogout();
//                     setShowMenu(false);
//                   }}
//                 >
//                   <FaSignOutAlt className="me-2" />
//                   Cerrar sesión
//                 </Button>
//               </div>
//             </Nav>
//           </Offcanvas.Body>
//         </Offcanvas>
//       </Container>
//     </Navbar>
//   );
// }

// export default GerenciaNavbar;

import React, { useState } from 'react';
import { Navbar, Container, Nav, Offcanvas, Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import Logo from '../../../assets/SIBUS.png';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbarG.css';

function GerenciaNavbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="gerencia-navbar">
      <Container fluid>

        <Navbar.Brand as={Link} to="/administrador" className="mx-auto mx-lg-0">
          <img src={Logo} alt="SiBus Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="offcanvasNavbar" 
          className="d-lg-none hamburger-btn"
          onClick={() => setShowMenu(true)}
        />

        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/administrador" className="nav-link">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/administrador/descargas" className="nav-link">
              Descargas
            </Nav.Link>
            <Nav.Link as={Link} to="/administrador/administrar_usuarios" className="nav-link">
              Usuarios
            </Nav.Link>
            <Nav.Link as={Link} to="/administrador/reclamos" className="nav-link">
              Reclamos
            </Nav.Link>

            <Button 
              variant="link" 
              className="logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2 logout-n" />
            </Button>
          </Nav>
        </Navbar.Collapse>

        <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end" className="gerencia-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/administrador" className="nav-link" onClick={() => setShowMenu(false)}>
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/administrador/descargas" className="nav-link" onClick={() => setShowMenu(false)}>
                Descargas
              </Nav.Link>
              <Nav.Link as={Link} to="/administrador/administrar_usuarios" className="nav-link" onClick={() => setShowMenu(false)}>
                Usuarios
              </Nav.Link>
              <Nav.Link as={Link} to="/administrador/reclamos" className="nav-link" onClick={() => setShowMenu(false)}>
                Reclamos
              </Nav.Link>

              <div className="mt-3 pt-3 border-top">
                <Button 
                  variant="outline-light" 
                  className="w-100 logout-btn-mobile"
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar sesión
                </Button>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default GerenciaNavbar;
