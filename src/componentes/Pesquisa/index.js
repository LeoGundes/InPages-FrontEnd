import styled, { keyframes } from 'styled-components';
import Input from '../Input';
import { useEffect, useState } from 'react';
import { getLivros } from '../../services/livros';
import { buscarLivrosGoogle } from '../../services/googleBooks';
import { postFavorito } from '../../services/favoritos';


// Animação de check
const checkPop = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const CheckAnimado = styled.div`
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  background: #1cd6ae;
  color: #fff;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  animation: ${checkPop} 0.7s cubic-bezier(.68,-0.55,.27,1.55);
`;

const Titulo = styled.h2`
  color: #002F52;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
  margin-top: 0;
`;

const Subtitulo = styled.p`
  color: #326589;
  font-size: 1.1em;
  text-align: center;
  margin-bottom: 18px;
  margin-top: 0;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  margin-top: 70px;
`;

const IconeBusca = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3em;
  color: #326589;
  pointer-events: none;
`;

const PesquisaContainer = styled.section`
  color: #326589;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 0 0 0;
  min-height: 400px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const Resultado = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFF;
  border-radius: 16px;
  padding: 12px 12px 8px 12px;
  margin-bottom: 14px;
  width: 260px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.02);
    background: #f7f9fb;
  }

  .imagem-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 6px;
  }

  .nome {
    color: #002F52;
    font-weight: bold;
    font-size: 1.1em;
    text-align: center;
    margin-bottom: 8px;
    margin-top: 0;
  }

  img {
    width: 180px;
    height: 260px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    background: #e9eef4;
    display: block;
    margin: 0 auto;
  }

  .conteudo {
    width: 100%;
    margin-top: 4px;
    display: flex;
    justify-content: center;
  }

  .review {
    color: #326589;
    text-align: center;
    word-break: break-word;
    font-size: 1em;
    margin-top: 0;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;


function Pesquisa() {
  const [query, setQuery] = useState('');
  const [livrosPesquisados, setlivrosPesquisados] = useState([]);
  const [livros, setLivros] = useState([]);
  const [googleLivros, setGoogleLivros] = useState([]);
  const [adicionado, setAdicionado] = useState(null); // id do livro adicionado

  useEffect(() => {
    fetchLivros();
  }, []);

  async function fetchLivros() {
    const livrosDaAPI = await getLivros();
    setLivros(livrosDaAPI);
  }


  async function insertFavorito(id) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    try {
      await postFavorito(usuario.email, id);
      setAdicionado(id);
      setTimeout(() => setAdicionado(null), 1200);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setAdicionado(id);
        setTimeout(() => setAdicionado(null), 1200);
        // alert('Este livro já está nos seus favoritos!');
      } else {
        alert('Erro ao adicionar favorito');
      }
    }
  }

  const handleSearch = async () => {
    const texto = query.trim().toLowerCase();
    if (!texto) {
      setlivrosPesquisados([]);
      setGoogleLivros([]);
      return;
    }
    const livrosFiltrados = livros.filter(livro =>
      livro.nome.toLowerCase().includes(texto)
    );
    setlivrosPesquisados(livrosFiltrados);
    // Busca Google Books
    const googleResults = await buscarLivrosGoogle(texto);
    setGoogleLivros(googleResults);
  };

  return (
    <PesquisaContainer>
      <Titulo>Encontre os melhores livros de tecnologia</Titulo>
      <Subtitulo>Pesquise pelo livro que você deseja</Subtitulo>
      <InputWrapper>
        <IconeBusca>
          <span role="img" aria-label="Buscar">🔍</span>
        </IconeBusca>
        <Input
          placeholder="Digite o nome do livro..."
          value={query}
          onChange={evento => setQuery(evento.target.value)}
          onKeyDown={evento => {
            if (evento.key === 'Enter') {
              evento.preventDefault();
              handleSearch();
            }
          }}
          style={{ paddingLeft: 40 }}
        />
      </InputWrapper>
      {/* Resultados locais */}
      {livrosPesquisados.map(livro => (
        <div key={livro.id} style={{ position: 'relative', width: 260 }}>
          {adicionado === livro.id && (
            <CheckAnimado title="Adicionado aos favoritos">✔</CheckAnimado>
          )}
          <Resultado onClick={() => insertFavorito(livro.id)}>
            <div className="imagem-container">
              <span className="nome">{livro.nome}</span>
              <a href={livro.link} target="_blank" rel="noopener noreferrer">
                <img src={livro.src} alt={livro.nome} />
              </a>
            </div>
            <div className="conteudo">
              <p className="review">{livro.Review}</p>
            </div>
          </Resultado>
        </div>
      ))}
      {/* Resultados Google Books */}
      {googleLivros.map(item => {
        const info = item.volumeInfo;
        return (
          <div key={item.id} style={{ position: 'relative', width: 260 }}>
            <Resultado as="a" href={info.infoLink} target="_blank" rel="noopener noreferrer">
              <div className="imagem-container">
                <span className="nome">{info.title}</span>
                {info.imageLinks?.thumbnail && (
                  <img src={info.imageLinks.thumbnail} alt={info.title} />
                )}
              </div>
              <div className="conteudo">
                <p className="review">{info.authors?.join(', ') || ''}</p>
              </div>
            </Resultado>
          </div>
        );
      })}
    </PesquisaContainer>
  );
}

export default Pesquisa;