import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLivros } from '../services/livros';
import { getFavoritos } from '../services/favoritos';

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

const BotaoLido = styled.button`
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

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [lidos, setLidos] = useState([]);
  const [naoLidos, setNaoLidos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      const todosLivros = await getLivros();
      let livrosLidos = JSON.parse(localStorage.getItem(`lidos_${usuario?.email}`)) || [];
      setLidos(todosLivros.filter(l => livrosLidos.includes(l.id)));
      setNaoLidos(todosLivros.filter(l => !livrosLidos.includes(l.id)));
      setLivros(todosLivros);
    }
    fetchData();
  }, []);

  function marcarComoLido(id) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    let livrosLidos = JSON.parse(localStorage.getItem(`lidos_${usuario?.email}`)) || [];
    if (!livrosLidos.includes(id)) {
      livrosLidos.push(id);
      localStorage.setItem(`lidos_${usuario.email}`, JSON.stringify(livrosLidos));
      setLidos(livros.filter(l => livrosLidos.includes(l.id)));
      setNaoLidos(livros.filter(l => !livrosLidos.includes(l.id)));
    }
  }

  return (
    <Container>
      <Dashboard>
        <Titulo>Minha Biblioteca</Titulo>
        <SessaoTitulo>Livros não lidos</SessaoTitulo>
        <LivrosGrid>
          {naoLidos.length === 0 && <p>Você já leu todos os livros!</p>}
          {naoLidos.map(livro => (
            <LivroCard key={livro.id}>
              {livro.src && <LivroImg src={livro.src} alt={livro.nome} />}
              <LivroNome>{livro.nome}</LivroNome>
              <BotaoLido onClick={() => marcarComoLido(livro.id)}>Marcar como lido</BotaoLido>
            </LivroCard>
          ))}
        </LivrosGrid>
        <SessaoTitulo>Livros lidos</SessaoTitulo>
        <LivrosGrid>
          {lidos.length === 0 && <p>Nenhum livro lido ainda.</p>}
          {lidos.map(livro => (
            <LivroCard key={livro.id}>
              {livro.src && <LivroImg src={livro.src} alt={livro.nome} />}
              <LivroNome>{livro.nome}</LivroNome>
            </LivroCard>
          ))}
        </LivrosGrid>
      </Dashboard>
    </Container>
  );
}

export default Biblioteca;
