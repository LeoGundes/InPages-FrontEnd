import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';


const FeedContainer = styled.section`
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  margin: 0 auto;
  margin-bottom: 32px;
`;

const FormNovaPostagem = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;

const TextArea = styled.textarea`
  resize: none;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #cfd8dc;
  padding: 10px;
  font-size: 1em;
`;

const Botao = styled.button`
  background: #002F52;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.2s;
  &:hover {
    background: #326589;
  }
`;

const Postagem = styled.div`
  border-bottom: 1px solid #e6e6e6;
  padding: 18px 0;
  &:last-child { border-bottom: none; }
`;

const NomeUsuario = styled.span`
  color: #002F52;
  font-weight: bold;
  margin-right: 8px;
`;

const Data = styled.span`
  color: #888;
  font-size: 0.95em;
  margin-left: 8px;
`;

const Conteudo = styled.p`
  margin: 8px 0 0 0;
  color: #222;
`;


function FeedPostagens({ usuario }) {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarFeed = () => {
    if (!usuario) return;
    setLoading(true);
    axios.get(`http://localhost:8000/postagens/feed/${usuario.email}`)
      .then(res => setPostagens(res.data))
      .catch(() => setPostagens([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarFeed();
    // eslint-disable-next-line
  }, [usuario]);

  if (!usuario) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!conteudo.trim()) {
      setErro("Digite algo para postar.");
      return;
    }
    setEnviando(true);
    try {
      await axios.post("http://localhost:8000/postagens", {
        email: usuario.email,
        conteudo
      });
      setConteudo("");
      carregarFeed();
    } catch (err) {
      setErro("Erro ao postar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FeedContainer>
      <h3>Feed dos Seguidos</h3>
      <FormNovaPostagem onSubmit={handleSubmit}>
        <TextArea
          placeholder="Compartilhe algo com seus seguidores..."
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          disabled={enviando}
        />
        {erro && <div style={{color: 'red', fontSize: '0.95em'}}>{erro}</div>}
        <Botao type="submit" disabled={enviando || !conteudo.trim()}>
          {enviando ? 'Enviando...' : 'Postar'}
        </Botao>
      </FormNovaPostagem>
      {loading ? (
        <div>Carregando postagens...</div>
      ) : postagens.length === 0 ? (
        <div>Nenhuma postagem encontrada.</div>
      ) : (
        postagens.map(post => (
          <Postagem key={post.id}>
            <NomeUsuario>{post.nome}</NomeUsuario>
            <Data>{new Date(post.data).toLocaleString('pt-BR')}</Data>
            <Conteudo>{post.conteudo}</Conteudo>
          </Postagem>
        ))
      )}
    </FeedContainer>
  );
}

export default FeedPostagens;
