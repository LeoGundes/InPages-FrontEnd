import styled from 'styled-components';

const textoOpcoes = ['CATEGORIAS', 'FAVORITOS', 'BIBLIOTECA'];

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
`

function OpcoesHeader() {
  return (
    <OpcoesHeaderContainer>
      <ul className="opcoes">
        {textoOpcoes.map((texto, index) => (
          <li key={index} className="opcao">
            <p>{texto}</p>
          </li>
        ))}
      </ul>
    </OpcoesHeaderContainer>
  );
}

export default OpcoesHeader;