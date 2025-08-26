import perfil from '../../imagens/perfil.svg';
import Sacola from '../../imagens/sacola.svg';
import styled from 'styled-components';

const icones = [perfil, Sacola];

const IconesHeaderContainer = styled.ul`
  display: flex;
  cursor: pointer;
  gap: 30px;
  margin-left: 50px;
  margin-right: 50px;
  width: 80px;
`;

function IconesHeader() {
  return (
    <IconesHeaderContainer>
      {icones.map((icone, index) => (
        <li key={index} className="icone">
          <img src={icone} alt={`ícone ${index}`} />
        </li>
      ))}
    </IconesHeaderContainer>
  );
}

export default IconesHeader;
