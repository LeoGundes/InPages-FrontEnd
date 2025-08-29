import logo from '../../imagens/logo.svg';
import styled from 'styled-components';

const LogoContainer = styled.div`
  cursor: pointer;
  max-height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

function Logo() {
    return (
    <LogoContainer >
      <img src={logo} alt='logo InPages' style={{ width: '300px', height: 'auto' }} />
    </LogoContainer>
    )
}

export default Logo;