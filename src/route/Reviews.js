import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getReviews, postReview } from '../services/Reviews';
import { getLivros } from '../services/livros';

const EnviarButton = styled.button`
  background: linear-gradient(90deg, #002F52 60%, #FE9900 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #FE9900 60%, #002F52 100%);
    transform: translateY(-2px) scale(1.04);
  }
`;


const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0;
`;

const Titulo = styled.h1`
  color: #002F52;
  text-align: center;
  margin-bottom: 24px;
`;

const LivroSelect = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const ReviewForm = styled.form`
  background: #f7f9fb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  padding: 8px;
`;


const StarRatingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const StarWrapper = styled.span`
  display: inline-block;
  position: relative;
  width: 1.2em;
  height: 2em;
  margin-right: 2px;
`;

const Star = styled.span`
  font-size: 2em;
  color: ${props => props.filled ? '#FE9900' : '#ccc'};
  cursor: pointer;
  transition: color 0.2s;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const StarHalf = styled.span`
  font-size: 2em;
  color: ${props => props.filled ? '#FE9900' : '#ccc'};
  cursor: pointer;
  transition: color 0.2s;
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

const ReviewList = styled.div`
  margin-top: 24px;
`;

const ReviewCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  margin-bottom: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Usuario = styled.span`
  color: #326589;
  font-weight: bold;
`;

const Nota = styled.span`
  color: #FE9900;
  font-weight: bold;
`;

function Reviews() {
  const [livros, setLivros] = useState([]);
  const [livroId, setLivroId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [texto, setTexto] = useState('');
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState(undefined);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    getLivros().then(setLivros);
  }, []);

  useEffect(() => {
    if (livroId) {
      getReviews(livroId).then(setReviews);
    } else {
      setReviews([]);
    }
  }, [livroId]);

  async function handleSubmit(e) {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) {
      setMensagem('Faça login para enviar uma review.');
      return;
    }
    try {
      await postReview({ livroId, usuario: usuario.nome, texto, nota });
      setMensagem('Review enviada!');
      setTexto('');
      setNota(5);
      getReviews(livroId).then(setReviews);
    } catch {
      setMensagem('Erro ao enviar review.');
    }
  }

  return (
    <Container>
      <Titulo>Reviews de Livros</Titulo>
      <LivroSelect value={livroId} onChange={e => setLivroId(e.target.value)}>
        <option value="">Selecione um livro</option>
        {livros.map(livro => (
          <option key={livro.id} value={livro.id}>{livro.nome}</option>
        ))}
      </LivroSelect>
      {livroId && (
        <ReviewForm onSubmit={handleSubmit}>
          <TextArea
            placeholder="Escreva sua review..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            required
          />
          <label style={{ display: 'block', marginBottom: 10 }}>
            Nota:
            <StarRatingWrapper>
              {[1,2,3,4,5].map(star => {
                const isFull = (hoverNota || nota) >= star;
                const isHalf = (hoverNota || nota) >= (star-0.5) && (hoverNota || nota) < star;
                return (
                  <StarWrapper key={star}>
                    {/* Metade esquerda (0.5) */}
                    <span
                      style={{ position: 'absolute', left: 0, width: '50%', height: '100%', cursor: 'pointer', zIndex: 3, display: 'inline-block' }}
                      onMouseEnter={() => setHoverNota(star-0.5)}
                      onMouseLeave={() => setHoverNota(undefined)}
                      onClick={e => { e.stopPropagation(); setNota(star-0.5); }}
                    />
                    {/* Metade direita (1.0) */}
                    <span
                      style={{ position: 'absolute', left: '50%', width: '50%', height: '100%', cursor: 'pointer', zIndex: 3, display: 'inline-block' }}
                      onMouseEnter={() => setHoverNota(star)}
                      onMouseLeave={() => setHoverNota(undefined)}
                      onClick={e => { e.stopPropagation(); setNota(star); }}
                    />
                    <StarHalf filled={isHalf}>★</StarHalf>
                    <Star filled={isFull}>★</Star>
                  </StarWrapper>
                );
              })}
              <span style={{ marginLeft: 12, fontSize: '1.1em', color: '#002F52' }}>{nota.toFixed(1)} / 5</span>
            </StarRatingWrapper>
          </label>
          <EnviarButton type="submit">Enviar Review</EnviarButton>
          {mensagem && <p>{mensagem}</p>}
        </ReviewForm>
      )}
      <ReviewList>
        {reviews.length === 0 && livroId && <p>Sem reviews para este livro.</p>}
        {reviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <Usuario>{review.usuario}</Usuario>
              <Nota>{'★'.repeat(review.nota)}</Nota>
              <span style={{ fontSize: '0.9em', color: '#888' }}>{new Date(review.data).toLocaleDateString()}</span>
            </ReviewHeader>
            <div>{review.texto}</div>
          </ReviewCard>
        ))}
      </ReviewList>
    </Container>
  );
}

export default Reviews;
