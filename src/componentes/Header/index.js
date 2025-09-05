import Logo from '../Logo';
import OpcoesHeader from '../OpcoesHeader';
import IconesHeader from '../IconesHeader';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { media } from '../../styles/breakpoints';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 100px;
  padding: 0 300px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  
  ${media.desktop} {
    padding: 0 100px;
  }
  
  ${media.tablet} {
    padding: 0 40px;
    height: 80px;
    flex-direction: row;
    justify-content: space-between;
  }
  
  ${media.mobile} {
    padding: 0 20px;
    height: auto;
    min-height: 70px;
    flex-direction: column;
    gap: 15px;
    padding-top: 15px;
    padding-bottom: 15px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  
  ${media.tablet} {
    flex: 0 0 auto;
  }
  
  ${media.mobile} {
    flex: none;
    justify-content: center;
    width: 100%;
  }
`;

const CenterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 2;
  
  ${media.tablet} {
    flex: 1;
    margin: 0 20px;
  }
  
  ${media.mobile} {
    flex: none;
    width: 100%;
    order: 2;
    margin: 0;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  flex: 1;
  
  ${media.tablet} {
    flex: 0 0 auto;
    gap: 15px;
  }
  
  ${media.mobile} {
    flex: none;
    gap: 15px;
    justify-content: center;
    width: 100%;
    order: 3;
  }
`;

const UsuarioLogado = styled.div`
  color: #002F52;
  font-weight: bold;
  margin-right: 24px;
  font-size: 1.1em;
  white-space: nowrap;
  
  ${media.tablet} {
    margin-right: 16px;
    font-size: 1em;
  }
  
  ${media.mobile} {
    margin-right: 8px;
    font-size: 0.9em;
    text-align: center;
  }
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
      <LeftSection>
        <Link to="/home">
          <Logo />
        </Link>
      </LeftSection>
      
      <CenterSection>
        <OpcoesHeader />
      </CenterSection>
      
      <RightSection>
        {usuario && (
          <UsuarioLogado>
            Olá, {usuario.nome}!
          </UsuarioLogado>
        )}
        <IconesHeader />
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;