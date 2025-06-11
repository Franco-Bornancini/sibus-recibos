import React from 'react';
import { Card, Table } from 'react-bootstrap';
import '../styles/downloadsReport.css';

const DownloadsReport = () => {
    const data = [
        { mes: "Mayo 2025", total: 438 },
        { mes: "Abril 2025", total: 401 },
        { mes: "Marzo 2025", total: 390 },
        { mes: "Febrero 2025", total: 376 }
    ];

    return (
        <Card className="main-card">
        <Card.Header>
            <h5>Informes de Descargas</h5>
        </Card.Header>
        <Card.Body>
            <Table hover responsive>
            <thead>
                <tr>
                <th>Mes</th>
                <th>Cantidad de Descargas</th>
                </tr>
            </thead>
            <tbody>
                {data.map((fila, i) => (
                <tr key={i}>
                    <td>{fila.mes}</td>
                    <td>{fila.total}</td>
                </tr>
                ))}
            </tbody>
            </Table>
        </Card.Body>
        </Card>
    );
};

export default DownloadsReport;
