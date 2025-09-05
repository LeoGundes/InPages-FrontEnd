import perfil from '../../imagens/perfil.svg';
import Sacola from '../../imagens/sacola.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { media } from '../../styles/breakpoints';

const icones = [perfil, Sacola];

const IconesHeaderContainer = styled.ul`
  display: flex;
  cursor: pointer;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  
  ${media.tablet} {
    gap: 20px;
  }
  
  ${media.mobile} {
    gap: 15px;
  }
`;

const IconeItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    transform: scale(1.1);
  }
  
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    
    ${media.tablet} {
      width: 36px;
      height: 36px;
    }
    
    ${media.mobile} {
      width: 32px;
      height: 32px;
    }
  }
`;

function IconesHeader() {
  const navigate = useNavigate();

  function handleClick(index) {
    const usuario = localStorage.getItem('usuarioLogado');
    if (index === 0) {
      if (usuario) {
        navigate('/perfil');
      } else {
        navigate('/login');
      }
    }
    // ...outras ações para outros ícones...
  }

  return (
    <IconesHeaderContainer>
      {icones.map((icone, index) => (
        <IconeItem key={index} onClick={() => handleClick(index)}>
          <img src={icone} alt={`ícone ${index}`} />
        </IconeItem>
      ))}
    </IconesHeaderContainer>
  );
}

export default IconesHeader;
