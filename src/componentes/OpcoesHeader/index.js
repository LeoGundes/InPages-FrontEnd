import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from '../../styles/breakpoints';

const textoOpcoes = ['CATEGORIAS', 'FAVORITOS', 'BIBLIOTECA', 'REVIEWS'];

const OpcoesHeaderContainer = styled.div`
  .opcoes {
    display: flex;
    gap: 20px;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    
    ${media.tablet} {
      gap: 15px;
    }
    
    ${media.mobile} {
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .opcao {
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    ${media.mobile} {
      padding: 6px 8px;
    }
    
    p {
      margin: 0;
      font-size: 1em;
      font-weight: 600;
      color: #002F52;
      transition: color 0.2s ease;
      
      &:hover {
        color: #326589;
      }
      
      ${media.tablet} {
        font-size: 0.9em;
      }
      
      ${media.mobile} {
        font-size: 0.8em;
      }
    }
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

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