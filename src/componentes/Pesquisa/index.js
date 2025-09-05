import styled, { keyframes } from 'styled-components';
import Input from '../Input';
import { useEffect, useState } from 'react';
import { getLivros } from '../../services/livros';
import { buscarLivrosGoogle } from '../../services/googleBooks';
import { postFavorito, getFavoritos } from '../../services/favoritos';
import { adicionarLivroLido } from '../../services/livrosLidos';
import { addFavoritoGoogle, getFavoritosGoogle } from '../../services/favoritosGoogle';

// Spinner animado
const Spinner = styled.div`
  border: 3px solid #e0e0e0;
  border-top: 3px solid #1cd6ae;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  animation: spin 0.8s linear infinite;
  margin-left: 10px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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

const BadgeBiblioteca = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  background: #4CAF50;
  color: #fff;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.75em;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 2px;
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
  const [loading, setLoading] = useState(false);
  const [livrosNaBiblioteca, setLivrosNaBiblioteca] = useState(new Set());
  const [favoritosLocais, setFavoritosLocais] = useState(new Set());
  const [favoritosGoogle, setFavoritosGoogle] = useState(new Set());

  // Função para verificar se um livro está na biblioteca
  const verificarSeEstaNaBiblioteca = () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      const idsNaBiblioteca = new Set(biblioteca.map(livro => livro.id));
      setLivrosNaBiblioteca(idsNaBiblioteca);
    }
  };

  // Função para carregar favoritos locais e do Google
  const carregarFavoritos = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      try {
        // Carregar favoritos locais
        const favoritosLocaisData = await getFavoritos(usuario.email);
        const idsFavoritosLocais = new Set(favoritosLocaisData.map(fav => fav.id));
        setFavoritosLocais(idsFavoritosLocais);

        // Carregar favoritos do Google
        const favoritosGoogleData = getFavoritosGoogle(usuario.email);
        const idsFavoritosGoogle = new Set(favoritosGoogleData.map(fav => fav.id));
        setFavoritosGoogle(idsFavoritosGoogle);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  };

  // Handler para favoritar livro do Google Books
  const handleFavoritarGoogle = async (item) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se já está favoritado
    if (favoritosGoogle.has(item.id)) {
      if (window.showNotification) {
        window.showNotification({
          type: 'warning',
          message: 'Este livro já está nos seus favoritos!'
        });
      }
      return;
    }
    
    const livroFavorito = {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      usuario: usuario.email
    };
    
    try {
      addFavoritoGoogle(usuario.email, livroFavorito);
      
      // Atualiza o estado local
      setFavoritosGoogle(prev => new Set([...prev, item.id]));
      
      setAdicionado(item.id);
      setTimeout(() => setAdicionado(null), 1200);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `"${item.volumeInfo.title}" adicionado aos favoritos!`
        });
      }
    } catch (error) {
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao adicionar favorito. Tente novamente.'
        });
      }
      console.error('Erro:', error);
    }
  };

  // Handler para review de livro do Google Books
  const handleReviewLivro = (info) => {
    localStorage.setItem('livroParaReview', JSON.stringify({
      id: info.industryIdentifiers?.[0]?.identifier || info.title,
      title: info.title,
      authors: info.authors,
      thumbnail: info.imageLinks?.thumbnail
    }));
    window.location.href = '/reviews';
  };

  // Handler para salvar livro na biblioteca (não lido)
  const handleSalvarNaBiblioteca = async (info, livroId) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const livroParaSalvar = {
      id: livroId, // Usa o mesmo ID que é usado para verificar o estado
      title: info.title,
      authors: info.authors,
      thumbnail: info.imageLinks?.thumbnail,
      usuario: usuario.email,
      lido: false // Marca como não lido inicialmente
    };
    
    try {
      // Salva na biblioteca do usuário no localStorage
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      
      // Verifica se o livro já está na biblioteca
      if (biblioteca.find(livro => livro.id === livroParaSalvar.id)) {
        if (window.showNotification) {
          window.showNotification({
            type: 'warning',
            message: 'Este livro já está na sua biblioteca!'
          });
        }
        return;
      }
      
      biblioteca.push(livroParaSalvar);
      localStorage.setItem(bibliotecaKey, JSON.stringify(biblioteca));
      
      // Atualiza o estado para mostrar que o livro está na biblioteca
      setLivrosNaBiblioteca(prev => new Set([...prev, livroParaSalvar.id]));
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `"${info.title}" salvo na biblioteca!`
        });
      }
    } catch (error) {
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao salvar livro na biblioteca. Tente novamente.'
        });
      }
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    fetchLivros();
    verificarSeEstaNaBiblioteca();
    carregarFavoritos();
  }, []);

  useEffect(() => {
    // Verifica novamente a biblioteca quando os resultados do Google mudam
    verificarSeEstaNaBiblioteca();
  }, [googleLivros]);

  async function fetchLivros() {
    const livrosDaAPI = await getLivros();
    setLivros(livrosDaAPI);
  }


  async function insertFavorito(id) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se já está favoritado
    if (favoritosLocais.has(id)) {
      if (window.showNotification) {
        window.showNotification({
          type: 'warning',
          message: 'Este livro já está nos seus favoritos!'
        });
      }
      return;
    }
    
    try {
      await postFavorito(usuario.email, id);
      
      // Atualiza o estado local
      setFavoritosLocais(prev => new Set([...prev, id]));
      
      setAdicionado(id);
      setTimeout(() => setAdicionado(null), 1200);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Livro adicionado aos favoritos!'
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Se o backend retornou que já existe, atualiza o estado local
        setFavoritosLocais(prev => new Set([...prev, id]));
        setAdicionado(id);
        setTimeout(() => setAdicionado(null), 1200);
        
        if (window.showNotification) {
          window.showNotification({
            type: 'warning',
            message: 'Este livro já está nos seus favoritos!'
          });
        }
      } else {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Erro ao adicionar favorito'
          });
        }
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
    setLoading(true);
    try {
      const livrosFiltrados = livros.filter(livro =>
        livro.nome.toLowerCase().includes(texto)
      );
      setlivrosPesquisados(livrosFiltrados);
      // Busca Google Books
      const googleResults = await buscarLivrosGoogle({ termo: texto });
      setGoogleLivros(googleResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PesquisaContainer>
      <Titulo>Descubra seu próximo livro favorito</Titulo>
        <Subtitulo>Explore, pesquise e encontre livros incríveis</Subtitulo>
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
        {loading && <Spinner title="Procurando..." />}
      </InputWrapper>
          {/* Resultados locais */}
          {livrosPesquisados.map(livro => {
            const jaFavoritado = favoritosLocais.has(livro.id);
            return (
              <div key={livro.id} style={{ position: 'relative', width: 260 }}>
                {adicionado === livro.id && (
                  <CheckAnimado title="Adicionado aos favoritos">✔</CheckAnimado>
                )}
                <Resultado 
                  onClick={() => !jaFavoritado && insertFavorito(livro.id)}
                  style={{ cursor: jaFavoritado ? 'default' : 'pointer', opacity: jaFavoritado ? 0.7 : 1 }}
                >
                  <div className="imagem-container">
                    <span className="nome">{livro.nome}</span>
                    <a href={livro.link} target="_blank" rel="noopener noreferrer">
                      <img src={livro.src} alt={livro.nome} />
                    </a>
                    {jaFavoritado && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        background: '#ff6b6b', 
                        color: '#fff', 
                        borderRadius: '12px', 
                        padding: '4px 8px', 
                        fontSize: '0.75em',
                        fontWeight: 'bold'
                      }}>
                        ❤️ Favoritado
                      </div>
                    )}
                  </div>
                  <div className="conteudo">
                    <p className="review">{livro.Review}</p>
                  </div>
                </Resultado>
              </div>
            );
          })}
          {/* Resultados Google Books */}
          {googleLivros.map(item => {
            const info = item.volumeInfo;
            const livroId = item.id;
            const estaNaBiblioteca = livrosNaBiblioteca.has(livroId);
            const jaFavoritado = favoritosGoogle.has(livroId);
            
            return (
              <div key={item.id} style={{ position: 'relative', width: 260 }}>
                {adicionado === item.id && (
                  <CheckAnimado title="Adicionado aos favoritos">✔</CheckAnimado>
                )}
                {estaNaBiblioteca && (
                  <BadgeBiblioteca title="Livro salvo na biblioteca">
                    📚 Na biblioteca
                  </BadgeBiblioteca>
                )}
                <Resultado>
                  <div className="imagem-container">
                    <span className="nome">{info.title}</span>
                    {info.imageLinks?.thumbnail && (
                      <img src={info.imageLinks.thumbnail} alt={info.title} />
                    )}
                  </div>
                  <div className="conteudo">
                    <p className="review">{info.authors?.join(', ') || ''}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => !jaFavoritado && handleFavoritarGoogle(item)} 
                      style={{ 
                        background: jaFavoritado ? '#ff6b6b' : '#1cd6ae', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        padding: '3px 8px', 
                        cursor: jaFavoritado ? 'not-allowed' : 'pointer', 
                        fontSize: '0.85em',
                        opacity: jaFavoritado ? 0.7 : 1
                      }}
                      disabled={jaFavoritado}
                    >
                      {jaFavoritado ? '❤️ Favoritado' : '❤️ Favoritar'}
                    </button>
                    <button 
                      onClick={() => handleSalvarNaBiblioteca(info, livroId)} 
                      style={{ 
                        background: estaNaBiblioteca ? '#9E9E9E' : '#4CAF50', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        padding: '3px 8px', 
                        cursor: estaNaBiblioteca ? 'not-allowed' : 'pointer', 
                        fontSize: '0.85em' 
                      }}
                      disabled={estaNaBiblioteca}
                    >
                      📚 {estaNaBiblioteca ? 'Salvo' : 'Salvar'}
                    </button>
                    <button onClick={() => handleReviewLivro(info)} style={{ background: '#326589', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: '0.85em' }}>✍️ Review</button>
                  </div>
                </Resultado>
              </div>
            );
          })}
        </PesquisaContainer>
  );
}

export default Pesquisa;