import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLivros } from '../services/livros';
import { getFavoritos, postFavorito } from '../services/favoritos';
import { addFavoritoGoogle, getFavoritosGoogle } from '../services/favoritosGoogle';
import { buscarLivrosLidos, removerLivroLido, adicionarLivroLido } from '../services/livrosLidos';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(120deg, #002F52 40%, #326589 100%);
  padding: 32px 0;
`;

const Dashboard = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: #f7f9fb;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  padding: 48px 40px 40px 40px;
`;

const Titulo = styled.h1`
  color: #002F52;
  text-align: center;
  margin-bottom: 32px;
`;

const SessaoTitulo = styled.h2`
  color: #FE9900;
  margin-top: 32px;
  margin-bottom: 18px;
`;

const BadgeLido = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LivrosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: flex-start;
`;

const LivroCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const BadgeFavorito = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: #ff6b6b;
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

const BotaoAcao = styled.button`
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85em;
  cursor: pointer;
  margin: 2px;
  transition: all 0.2s;
  
  &.lido {
    background: #4CAF50;
    color: #fff;
    &:hover { background: #45a049; }
  }
  
  &.favorito {
    background: #1cd6ae;
    color: #fff;
    &:hover { background: #16b397; }
  }
  
  &.remover {
    background: #f44336;
    color: #fff;
    &:hover { background: #d32f2f; }
  }
`;

const AcoesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

function Biblioteca() {
  const [bibliotecaLivros, setBibliotecaLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritosLocais, setFavoritosLocais] = useState(new Set());
  const [favoritosGoogle, setFavoritosGoogle] = useState(new Set());
  const [livrosJaLidos, setLivrosJaLidos] = useState(new Set());

  useEffect(() => {
    carregarBiblioteca();
    carregarFavoritos();
    carregarLivrosLidos();
  }, []);

  const carregarLivrosLidos = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      try {
        const livrosLidosData = await buscarLivrosLidos(usuario.email);
        const idsLivrosLidos = new Set(livrosLidosData.map(livro => livro.id));
        setLivrosJaLidos(idsLivrosLidos);
      } catch (error) {
        console.error('Erro ao carregar livros lidos:', error);
      }
    }
  };

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

  const carregarBiblioteca = () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      setBibliotecaLivros(biblioteca);
    }
    setLoading(false);
  };

  const marcarComoLido = async (livro) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se o livro já está marcado como lido no backend
    if (livrosJaLidos.has(livro.id)) {
      // Se já está lido no backend, apenas sincroniza a biblioteca local
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      const bibliotecaAtualizada = biblioteca.map(l => 
        l.id === livro.id ? { ...l, lido: true } : l
      );
      localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
      setBibliotecaLivros(bibliotecaAtualizada);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `Status sincronizado! "${livro.title}" já estava marcado como lido.`
        });
      }
      return;
    }
    
    const livroLido = {
      id: livro.id,
      title: livro.title,
      authors: livro.authors,
      thumbnail: livro.thumbnail,
      usuario: usuario.email
    };
    
    try {
      await adicionarLivroLido(livroLido);
      
      // Atualiza o estado dos livros já lidos
      setLivrosJaLidos(prev => new Set([...prev, livro.id]));
      
      // Atualiza o status do livro na biblioteca local
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      const bibliotecaAtualizada = biblioteca.map(l => 
        l.id === livro.id ? { ...l, lido: true } : l
      );
      localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
      setBibliotecaLivros(bibliotecaAtualizada);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `"${livro.title}" marcado como lido!`
        });
      }
    } catch (error) {
      if (error.message === 'Este livro já está marcado como lido!') {
        // Se recebeu erro do backend mas não estava no estado local, sincroniza
        setLivrosJaLidos(prev => new Set([...prev, livro.id]));
        
        const bibliotecaKey = `biblioteca_${usuario.email}`;
        const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
        const bibliotecaAtualizada = biblioteca.map(l => 
          l.id === livro.id ? { ...l, lido: true } : l
        );
        localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
        setBibliotecaLivros(bibliotecaAtualizada);
        
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `Status sincronizado! "${livro.title}" já estava marcado como lido.`
          });
        }
      } else {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Erro ao marcar livro como lido. Tente novamente.'
          });
        }
        console.error('Erro:', error);
      }
    }
  };

  const favoritarLivro = async (livro) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se já está favoritado
    if (favoritosLocais.has(livro.id) || favoritosGoogle.has(livro.id)) {
      if (window.showNotification) {
        window.showNotification({
          type: 'warning',
          message: 'Este livro já está nos seus favoritos!'
        });
      }
      return;
    }
    
    try {
      // Tenta primeiro adicionar aos favoritos locais
      await postFavorito(usuario.email, livro.id);
      
      // Atualiza o estado local
      setFavoritosLocais(prev => new Set([...prev, livro.id]));
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `"${livro.title}" adicionado aos favoritos!`
        });
      }
    } catch (error) {
      // Se falhar nos favoritos locais, tenta nos favoritos do Google
      try {
        const livroFavorito = {
          id: livro.id,
          title: livro.title,
          authors: livro.authors,
          thumbnail: livro.thumbnail,
          usuario: usuario.email
        };
        
        addFavoritoGoogle(usuario.email, livroFavorito);
        
        // Atualiza o estado local
        setFavoritosGoogle(prev => new Set([...prev, livro.id]));
        
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `"${livro.title}" adicionado aos favoritos!`
          });
        }
      } catch (googleError) {
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Erro ao adicionar favorito. Tente novamente.'
          });
        }
        console.error('Erro:', googleError);
      }
    }
  };

  const removerDaBiblioteca = (livroId) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const bibliotecaKey = `biblioteca_${usuario.email}`;
    const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
    const bibliotecaAtualizada = biblioteca.filter(l => l.id !== livroId);
    localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
    setBibliotecaLivros(bibliotecaAtualizada);
  };

  const removerDosLivrosLidos = async (livro) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      
      // Remove do backend
      await removerLivroLido(livro.id, usuario.email);
      
      // Remove do localStorage também
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      const bibliotecaAtualizada = biblioteca.filter(l => l.id !== livro.id);
      localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
      setBibliotecaLivros(bibliotecaAtualizada);
      
      // Atualiza a lista de livros já lidos
      setLivrosJaLidos(prev => {
        const novoSet = new Set(prev);
        novoSet.delete(livro.id);
        return novoSet;
      });
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Livro removido da lista de lidos!'
        });
      }
    } catch (error) {
      console.error('Erro ao remover livro dos lidos:', error);
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao remover livro dos lidos. Tente novamente.'
        });
      }
    }
  };

  const livrosNaoLidos = bibliotecaLivros.filter(livro => !livro.lido);
  const livrosLidos = bibliotecaLivros.filter(livro => livro.lido);

  if (loading) {
    return <Container><Dashboard><p>Carregando biblioteca...</p></Dashboard></Container>;
  }

  return (
    <Container>
      <Dashboard>
        <Titulo>Minha Biblioteca</Titulo>
        
        <SessaoTitulo>Livros não lidos ({livrosNaoLidos.length})</SessaoTitulo>
        <LivrosGrid>
          {livrosNaoLidos.length === 0 && <p>Nenhum livro não lido na biblioteca.</p>}
          {livrosNaoLidos.map(livro => {
            const jaFavoritado = favoritosLocais.has(livro.id) || favoritosGoogle.has(livro.id);
            const jaLidoNoBackend = livrosJaLidos.has(livro.id);
            return (
              <LivroCard key={livro.id}>
                {jaFavoritado && (
                  <BadgeFavorito title="Livro já está nos favoritos">
                    ❤️ Favoritado
                  </BadgeFavorito>
                )}
                {jaLidoNoBackend && (
                  <BadgeLido title="Livro já está marcado como lido - clique para sincronizar">
                    ✓ Lido
                  </BadgeLido>
                )}
                {livro.thumbnail && <LivroImg src={livro.thumbnail} alt={livro.title} />}
                <LivroNome>{livro.title}</LivroNome>
                <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', margin: '4px 0' }}>
                  {livro.authors?.join(', ') || 'Autor não informado'}
                </p>
                <AcoesContainer>
                  <BotaoAcao 
                    className="lido" 
                    onClick={() => marcarComoLido(livro)}
                    style={{
                      background: jaLidoNoBackend ? '#4CAF50' : '#4CAF50',
                      opacity: jaLidoNoBackend ? 0.8 : 1
                    }}
                  >
                    {jaLidoNoBackend ? '↻ Sincronizar' : '✓ Marcar como lido'}
                  </BotaoAcao>
                  <BotaoAcao 
                    className="favorito" 
                    onClick={() => !jaFavoritado && favoritarLivro(livro)}
                    style={{ 
                      background: jaFavoritado ? '#9E9E9E' : '#1cd6ae',
                      cursor: jaFavoritado ? 'not-allowed' : 'pointer',
                      opacity: jaFavoritado ? 0.7 : 1
                    }}
                    disabled={jaFavoritado}
                  >
                    {jaFavoritado ? '❤️ Favoritado' : '❤️ Favoritar'}
                  </BotaoAcao>
                  <BotaoAcao className="remover" onClick={() => removerDaBiblioteca(livro.id)}>
                    🗑️ Remover
                  </BotaoAcao>
                </AcoesContainer>
              </LivroCard>
            );
          })}
        </LivrosGrid>
        
        <SessaoTitulo>Livros lidos ({livrosLidos.length})</SessaoTitulo>
        <LivrosGrid>
          {livrosLidos.length === 0 && <p>Nenhum livro lido ainda.</p>}
          {livrosLidos.map(livro => {
            const jaFavoritado = favoritosLocais.has(livro.id) || favoritosGoogle.has(livro.id);
            return (
              <LivroCard key={livro.id}>
                {jaFavoritado && (
                  <BadgeFavorito title="Livro já está nos favoritos">
                    ❤️ Favoritado
                  </BadgeFavorito>
                )}
                {livro.thumbnail && <LivroImg src={livro.thumbnail} alt={livro.title} />}
                <LivroNome>{livro.title}</LivroNome>
                <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', margin: '4px 0' }}>
                  {livro.authors?.join(', ') || 'Autor não informado'}
                </p>
                <AcoesContainer>
                  <BotaoAcao 
                    className="favorito" 
                    onClick={() => !jaFavoritado && favoritarLivro(livro)}
                    style={{ 
                      background: jaFavoritado ? '#9E9E9E' : '#1cd6ae',
                      cursor: jaFavoritado ? 'not-allowed' : 'pointer',
                      opacity: jaFavoritado ? 0.7 : 1
                    }}
                    disabled={jaFavoritado}
                  >
                    {jaFavoritado ? '❤️ Favoritado' : '❤️ Favoritar'}
                  </BotaoAcao>
                  <BotaoAcao className="remover" onClick={() => removerDosLivrosLidos(livro)}>
                    🗑️ Remover dos lidos
                  </BotaoAcao>
                </AcoesContainer>
              </LivroCard>
            );
          })}
        </LivrosGrid>
      </Dashboard>
    </Container>
  );
}

export default Biblioteca;
