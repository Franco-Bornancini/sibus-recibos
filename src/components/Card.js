
import Card from 'react-bootstrap/Card';
import { FaIdCard, FaUser, FaIdCardAlt } from 'react-icons/fa';
import '../styles/card.css';

function EmployeeCard({ userData }) {
  return (
    <Card className="employee-card">
      <Card.Body>
        <Card.Title className="card-title">
          <FaUser className="title-icon" /> Información del Empleado
        </Card.Title>
        <div className="employee-details">
          <div className="detail-item">
            <FaUser className="detail-icon" />
            <div>
              <span className="detail-label">Nombre:</span>
              <span className="detail-value">{userData?.Nombre || 'No disponible'}</span>
            </div>
          </div>
          <div className="detail-item">
            <FaIdCardAlt className="detail-icon" />
            <div>
              <span className="detail-label">Legajo:</span>
              <span className="detail-value">{userData?.Legajo || 'No disponible'}</span>
            </div>
          </div>
          <div className="detail-item">
            <FaIdCard className="detail-icon"/>
            <div>
              <span className="detail-label">CUIL:</span>
              <span className="detail-value">{userData?.CUIL || 'No disponible'}</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default EmployeeCard;