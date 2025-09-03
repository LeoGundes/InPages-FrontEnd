import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLivros } from '../services/livros';
import { getFavoritos } from '../services/favoritos';
import { addFavoritoGoogle } from '../services/favoritosGoogle';
import { adicionarLivroLido } from '../services/livrosLidos';

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

  useEffect(() => {
    carregarBiblioteca();
  }, []);

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
    const livroLido = {
      id: livro.id,
      title: livro.title,
      authors: livro.authors,
      thumbnail: livro.thumbnail,
      usuario: usuario.email
    };
    
    try {
      await adicionarLivroLido(livroLido);
      // Atualiza o status do livro na biblioteca
      const bibliotecaKey = `biblioteca_${usuario.email}`;
      const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
      const bibliotecaAtualizada = biblioteca.map(l => 
        l.id === livro.id ? { ...l, lido: true } : l
      );
      localStorage.setItem(bibliotecaKey, JSON.stringify(bibliotecaAtualizada));
      setBibliotecaLivros(bibliotecaAtualizada);
      alert(`"${livro.title}" marcado como lido!`);
    } catch (error) {
      if (error.message === 'Este livro já está marcado como lido!') {
        alert('Este livro já está marcado como lido!');
      } else {
        alert('Erro ao marcar livro como lido. Tente novamente.');
        console.error('Erro:', error);
      }
    }
  };

  const favoritarLivro = (livro) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const livroFavorito = {
      id: livro.id,
      title: livro.title,
      authors: livro.authors,
      thumbnail: livro.thumbnail,
      usuario: usuario.email
    };
    
    try {
      addFavoritoGoogle(usuario.email, livroFavorito);
      alert(`"${livro.title}" adicionado aos favoritos!`);
    } catch (error) {
      alert('Erro ao adicionar favorito. Tente novamente.');
      console.error('Erro:', error);
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
          {livrosNaoLidos.map(livro => (
            <LivroCard key={livro.id}>
              {livro.thumbnail && <LivroImg src={livro.thumbnail} alt={livro.title} />}
              <LivroNome>{livro.title}</LivroNome>
              <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', margin: '4px 0' }}>
                {livro.authors?.join(', ') || 'Autor não informado'}
              </p>
              <AcoesContainer>
                <BotaoAcao className="lido" onClick={() => marcarComoLido(livro)}>
                  ✓ Marcar como lido
                </BotaoAcao>
                <BotaoAcao className="favorito" onClick={() => favoritarLivro(livro)}>
                  ❤️ Favoritar
                </BotaoAcao>
                <BotaoAcao className="remover" onClick={() => removerDaBiblioteca(livro.id)}>
                  🗑️ Remover
                </BotaoAcao>
              </AcoesContainer>
            </LivroCard>
          ))}
        </LivrosGrid>
        
        <SessaoTitulo>Livros lidos ({livrosLidos.length})</SessaoTitulo>
        <LivrosGrid>
          {livrosLidos.length === 0 && <p>Nenhum livro lido ainda.</p>}
          {livrosLidos.map(livro => (
            <LivroCard key={livro.id}>
              {livro.thumbnail && <LivroImg src={livro.thumbnail} alt={livro.title} />}
              <LivroNome>{livro.title}</LivroNome>
              <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', margin: '4px 0' }}>
                {livro.authors?.join(', ') || 'Autor não informado'}
              </p>
              <AcoesContainer>
                <BotaoAcao className="favorito" onClick={() => favoritarLivro(livro)}>
                  ❤️ Favoritar
                </BotaoAcao>
                <BotaoAcao className="remover" onClick={() => removerDaBiblioteca(livro.id)}>
                  🗑️ Remover
                </BotaoAcao>
              </AcoesContainer>
            </LivroCard>
          ))}
        </LivrosGrid>
      </Dashboard>
    </Container>
  );
}

export default Biblioteca;
