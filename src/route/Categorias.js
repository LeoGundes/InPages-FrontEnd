import styled from 'styled-components';
import { useState } from 'react';
import { buscarLivrosPorCategoriaGoogle } from '../services/categoriasGoogle';
import { getFavoritosGoogle, addFavoritoGoogle } from '../services/favoritosGoogle';

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


const LivroCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12px;
`;
const LivroImg = styled.img`
  width: 120px;
  height: 170px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`;
const LivroNome = styled.h3`
  color: #002F52;
  font-size: 1.1em;
  margin: 0 0 8px 0;
  text-align: center;
`;
const BotaoFavoritar = styled.button`
  background: linear-gradient(90deg, #002F52 60%, #FE9900 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1em;
  font-weight: bold;
  margin-top: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #FE9900 60%, #002F52 100%);
    transform: translateY(-2px) scale(1.04);
  }
`;

function Categorias() {
  const [livrosGoogle, setLivrosGoogle] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleCategoriaClick(categoria) {
    setCategoriaSelecionada(categoria);
    setMensagem('Buscando livros...');
    const livros = await buscarLivrosPorCategoriaGoogle(categoria);
    setLivrosGoogle(livros);
    setMensagem('');
  }

  function favoritarGoogle(livro) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) {
      setMensagem('Faça login para favoritar.');
      return;
    }
    addFavoritoGoogle(usuario.email, {
      id: livro.id,
      title: livro.volumeInfo.title,
      thumbnail: livro.volumeInfo.imageLinks?.thumbnail
    });
    setMensagem('Livro adicionado aos favoritos!');
    setTimeout(() => setMensagem(''), 1200);
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
      {categoriaSelecionada && (
        <>
          <h2 style={{ color: '#002F52', margin: '32px 0 18px 0' }}>Livros de {categoriaSelecionada}</h2>
          {mensagem && <p>{mensagem}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {livrosGoogle.map(livro => (
              <LivroCard key={livro.id}>
                {livro.volumeInfo.imageLinks?.thumbnail && (
                  <LivroImg src={livro.volumeInfo.imageLinks.thumbnail} alt={livro.volumeInfo.title} />
                )}
                <LivroNome>{livro.volumeInfo.title}</LivroNome>
                <BotaoFavoritar onClick={() => favoritarGoogle(livro)}>
                  Favoritar
                </BotaoFavoritar>
              </LivroCard>
            ))}
          </div>
        </>
      )}
    </AppContainer>
  );
}

export default Categorias;