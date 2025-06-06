

import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import Logo3 from '../assets/SIBUS.png';
import '../styles/Navbar.css';

function CustomNavbar({ userData }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="sibus-navbar">
      <Container fluid className="navbar-container">

        <Navbar.Brand href="/home" className="logo-brand">
          <img src={Logo3} alt="SiBus Logo" className="navbar-logo" />
        </Navbar.Brand>
        
        <div className="navbar-right-content">
          <Button 
            variant="link" 
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt className="logout-icon" />
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;