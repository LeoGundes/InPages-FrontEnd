import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Home from './route/Home';
import Categorias from './route/Categorias';
import Favoritos from './route/favoritos';
import Biblioteca from './route/Biblioteca';
import Reviews from './route/Reviews';
import Login from './route/Login';
import Cadastro from './route/Cadastro';
import Perfil from './route/Perfil';
import Onboarding from './route/Onboarding';
import Header from './componentes/Header';
import RotaProtegida from './componentes/RotaProtegida';
import { NotificationProvider } from './componentes/Notification';
import { media } from './styles/breakpoints';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    ${media.mobile} {
      font-size: 14px;
    }
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  
  li {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Estilos para scroll em dispositivos móveis */
  ${media.mobile} {
    html {
      -webkit-overflow-scrolling: touch;
    }
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          {/* Rotas protegidas com Header */}
          <Route
            path="/*"
            element={
              <RotaProtegida>
                <Header />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/biblioteca" element={<Biblioteca />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);
