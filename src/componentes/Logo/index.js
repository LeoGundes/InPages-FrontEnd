import logo from '../../imagens/logo.svg';
import styled from 'styled-components';
import { media } from '../../styles/breakpoints';

const LogoContainer = styled.div`
  cursor: pointer;
  max-height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 300px;
    height: auto;
    
    ${media.desktop} {
      width: 250px;
    }
    
    ${media.tablet} {
      width: 200px;
    }
    
    ${media.mobile} {
      width: 150px;
    }
  }
`;

function Logo() {
    return (
    <LogoContainer >
      <img src={logo} alt='logo InPages' />
    </LogoContainer>
    )
}

export default Logo;