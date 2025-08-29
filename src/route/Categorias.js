import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
  padding: 32px 0;
`;

const Titulo = styled.h1`
  color: gold;
  text-align: center;
  margin-bottom: 32px;
`;

const ListaCategorias = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding: 0;
`;

const CategoriaItem = styled.li`
  background: white;
  color: #002F52;
  border-radius: 8px;
  padding: 24px 40px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
  list-style: none;

  &:hover {
    background: #e6f0fa;
  }
`;

const categorias = [
  'Programação',
  'Design',
  'DevOps',
  'Banco de Dados',
  'Front-end',
  'Back-end',
  'Mobile',
  'Cloud'
];

function Categorias() {
  function handleCategoriaClick(categoria) {
    // Aqui você pode navegar para uma página de livros da categoria, ou filtrar livros, etc.
    alert(`Você clicou na categoria: ${categoria}`);
  }

  return (
    <AppContainer>
      <Titulo>Categorias</Titulo>
      <ListaCategorias>
        {categorias.map((categoria, idx) => (
          <CategoriaItem key={idx} onClick={() => handleCategoriaClick(categoria)}>
            {categoria}
          </CategoriaItem>
        ))}
      </ListaCategorias>
    </AppContainer>
  );
}

export default Categorias;