import Logo from '../Logo';
import OpcoesHeader from '../OpcoesHeader';
import IconesHeader from '../IconesHeader';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  // Busca o usuário logado no localStorage
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  return (
    <HeaderContainer>
      <Link to="/">
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