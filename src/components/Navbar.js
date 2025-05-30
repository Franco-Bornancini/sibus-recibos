import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/logosibus.png'
import '../styles/Login.css'


function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href=""><img src={Logo}  alt="Icono Logo" className='logo_css'></img></Navbar.Brand>
          {/* <Nav className="me-auto">
            <Nav.Link href="/home">Inicio</Nav.Link>
            <Nav.Link href="#">#</Nav.Link>
            <Nav.Link href="/contactos" to="/contactos">Contactos</Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default ColorSchemesExample;