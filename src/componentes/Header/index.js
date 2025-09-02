import Logo from '../Logo';
import OpcoesHeader from '../OpcoesHeader';
import IconesHeader from '../IconesHeader';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 100px;
  padding: 0 300px;
`;

const UsuarioLogado = styled.div`
  color: #002F52;
  font-weight: bold;
  margin-right: 24px;
  font-size: 1.1em;
`;



function Header() {
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
  });

  useEffect(() => {
    function atualizarUsuario() {
      setUsuario(JSON.parse(localStorage.getItem('usuarioLogado')));
    }
    window.addEventListener('storage', atualizarUsuario);
    return () => window.removeEventListener('storage', atualizarUsuario);
  }, []);

  // Também atualiza ao voltar do perfil (navegação SPA)
  useEffect(() => {
    const interval = setInterval(() => {
      const atual = JSON.parse(localStorage.getItem('usuarioLogado'));
      setUsuario(prev => {
        if (!prev || !atual || prev.nome !== atual.nome) return atual;
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <Link to="/home">
        <Logo />
      </Link>
      <OpcoesHeader />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {usuario && (
          <UsuarioLogado>
            Olá, {usuario.nome}!
          </UsuarioLogado>
        )}
        <IconesHeader />
      </div>
    </HeaderContainer>
  );
}

export default Header;