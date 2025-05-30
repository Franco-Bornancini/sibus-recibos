import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function EmployeeCard({ userData }) {
  return (
    <Card style={{ width: '100%', maxWidth: '24rem', margin: '1rem auto' }}>
      <Card.Body>
        <Card.Title>Datos del Empleado</Card.Title>
        {userData ? (
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Nombre:</strong> {userData.Nombre}</ListGroup.Item>
            <ListGroup.Item><strong>Legajo:</strong> {userData.Legajo}</ListGroup.Item>
            <ListGroup.Item><strong>CUIL:</strong> {userData.CUIL}</ListGroup.Item>
          </ListGroup>
        ) : (
          <Card.Text>No se encontraron datos del usuario.</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default EmployeeCard;