import styled from 'styled-components';
import { Link } from 'react-router-dom';

const textoOpcoes = ['CATEGORIAS', 'FAVORITOS', 'BIBLIOTECA', 'REVIEWS'];

const OpcoesHeaderContainer = styled.div`
  .opcoes {
    display: flex;
    gap: 20px;
  }

  .opcao {
    cursor: pointer;
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;   // remove o sublinhado
    color: inherit;          // herda a cor do pai, ou defina uma cor fixa (ex: color: #fff;)
  }
`

function OpcoesHeader() {
  return (
    <OpcoesHeaderContainer>
      <ul className="opcoes">
        {textoOpcoes.map((texto, index) => (
          <li key={index} className="opcao">
            <Link to={`/${texto.toLowerCase()}`}><p>{texto}</p></Link>
          </li>
        ))}
      </ul>
    </OpcoesHeaderContainer>
  );
}

export default OpcoesHeader;