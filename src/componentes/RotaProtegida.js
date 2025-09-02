import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children }) {
  const usuario = localStorage.getItem('usuarioLogado');
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default RotaProtegida;