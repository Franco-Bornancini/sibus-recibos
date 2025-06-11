// modules/gerente/components/GerenciaLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import GerenciaNavbar from '../components/NavbarG';

const GerenciaLayout = () => {
    return (
        <div className="gerencia-layout">
        <GerenciaNavbar />
        <Outlet />
        </div>
    );
};

export default GerenciaLayout;
