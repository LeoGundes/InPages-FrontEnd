import perfil from '../../imagens/perfil.svg';
import Sacola from '../../imagens/sacola.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const icones = [perfil, Sacola];

const IconesHeaderContainer = styled.ul`
  display: flex;
  cursor: pointer;
  gap: 30px;
  margin-left: 50px;
  margin-right: 160px;
  width: 80px;
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
        <li key={index} className="icone" onClick={() => handleClick(index)}>
          <img src={icone} alt={`ícone ${index}`} />
        </li>
      ))}
    </IconesHeaderContainer>
  );
}

export default IconesHeader;
