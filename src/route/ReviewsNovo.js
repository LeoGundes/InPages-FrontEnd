import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { listarPostagensFeed, editarPostagem } from '../services/postagens';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const Titulo = styled.h1`
  color: #002F52;
  text-align: center;
  margin-bottom: 32px;
  font-size: 2.2em;
`;

const ReviewCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
`;

const LivroInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  
  img {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  .info {
    .titulo {
      font-weight: bold;
      color: #002F52;
      font-size: 1.1em;
      margin-bottom: 4px;
    }
    
    .data {
      color: #666;
      font-size: 0.9em;
    }
  }
`;

const NotaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Estrelas = styled.div`
  font-size: 1.4em;
  color: #FE9900;
`;

const NotaTexto = styled.span`
  color: #002F52;
  font-weight: bold;
  font-size: 1.1em;
`;

const ConteudoReview = styled.div`
  color: #333;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 1em;
`;

const BotoesAcao = styled.div`
  display: flex;
  gap: 12px;
`;

const BotaoEditar = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
  
  &:hover {
    background: #2980b9;
  }
`;

const BotaoCancelar = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
  
  &:hover {
    background: #7f8c8d;
  }
`;

const BotaoSalvar = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
  
  &:hover {
    background: #229954;
  }
`;

const TextAreaEdicao = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 16px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const SeletorNota = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  .label {
    color: #002F52;
    font-weight: bold;
  }
`;

const EstrelasEdicao = styled.div`
  display: flex;
  gap: 4px;
  
  .estrela {
    font-size: 1.8em;
    cursor: pointer;
    color: ${props => props.filled ? '#FE9900' : '#ddd'};
    transition: color 0.2s;
    
    &:hover {
      color: #FE9900;
    }
  }
`;

const MensagemVazia = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  
  .icon {
    font-size: 3em;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const [notaEdicao, setNotaEdicao] = useState(5);
  const [salvando, setSalvando] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    carregarReviews();
  }, []);

  const carregarReviews = async () => {
    if (!usuario) return;
    
    try {
      setLoading(true);
      const postagens = await listarPostagensFeed(usuario.email);
      // Filtra apenas reviews do próprio usuário
      const minhasReviews = postagens.filter(p => 
        p.tipo === 'review' && p.email === usuario.email
      );
      setReviews(minhasReviews);
    } catch (error) {
      console.error('Erro ao carregar reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (review) => {
    setEditandoId(review.id);
    // Extrai apenas o texto da review (remove as partes formatadas)
    const linhas = review.conteudo.split('\n\n');
    const textoLimpo = linhas.length > 1 ? linhas[1] : review.conteudo;
    setTextoEdicao(textoLimpo);
    setNotaEdicao(review.nota);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setTextoEdicao('');
    setNotaEdicao(5);
  };

  const salvarEdicao = async (review) => {
    if (!textoEdicao.trim()) return;
    
    try {
      setSalvando(true);
      
      // Reconstrói o conteúdo da review com o novo texto e nota
      const novoConteudo = `📖 Review: "${review.livro}"\n\n${textoEdicao.trim()}\n\n⭐ Nota: ${notaEdicao}/5`;
      
      await editarPostagem(review.id, {
        email: usuario.email,
        conteudo: novoConteudo,
        nota: notaEdicao
      });
      
      // Atualiza localmente
      setReviews(reviews.map(r => r.id === review.id ? {
        ...r,
        conteudo: novoConteudo,
        nota: notaEdicao,
        dataEdicao: new Date().toISOString()
      } : r));
      
      cancelarEdicao();
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      alert('Erro ao salvar edição');
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario) {
    return (
      <Container>
        <Titulo>Minhas Reviews</Titulo>
        <MensagemVazia>
          <div className="icon">🔒</div>
          <div>Faça login para ver suas reviews</div>
        </MensagemVazia>
      </Container>
    );
  }

  return (
    <Container>
      <Titulo>Minhas Reviews</Titulo>
      
      {loading ? (
        <MensagemVazia>Carregando suas reviews...</MensagemVazia>
      ) : reviews.length === 0 ? (
        <MensagemVazia>
          <div className="icon">📚</div>
          <div>Você ainda não fez nenhuma review</div>
          <div style={{ fontSize: '0.9em', marginTop: '8px' }}>
            Vá para o Feed e publique uma review de algum livro!
          </div>
        </MensagemVazia>
      ) : (
        reviews.map(review => (
          <ReviewCard key={review.id}>
            <LivroInfo>
              {review.capaLivro && (
                <img src={review.capaLivro} alt={review.livro} />
              )}
              <div className="info">
                <div className="titulo">📖 {review.livro}</div>
                <div className="data">
                  {new Date(review.data).toLocaleDateString('pt-BR')}
                  {review.dataEdicao && (
                    <span style={{ color: '#3498db', marginLeft: '8px' }}>
                      (editado em {new Date(review.dataEdicao).toLocaleDateString('pt-BR')})
                    </span>
                  )}
                </div>
              </div>
            </LivroInfo>

            {editandoId === review.id ? (
              // Modo de edição
              <div>
                <SeletorNota>
                  <span className="label">Nota:</span>
                  <EstrelasEdicao>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className="estrela"
                        style={{ color: star <= notaEdicao ? '#FE9900' : '#ddd' }}
                        onClick={() => setNotaEdicao(star)}
                      >
                        ★
                      </span>
                    ))}
                  </EstrelasEdicao>
                  <NotaTexto>{notaEdicao}/5</NotaTexto>
                </SeletorNota>
                
                <TextAreaEdicao
                  value={textoEdicao}
                  onChange={(e) => setTextoEdicao(e.target.value)}
                  placeholder="Escreva sua opinião sobre o livro..."
                />
                
                <BotoesAcao>
                  <BotaoSalvar 
                    onClick={() => salvarEdicao(review)}
                    disabled={salvando}
                  >
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </BotaoSalvar>
                  <BotaoCancelar onClick={cancelarEdicao}>
                    Cancelar
                  </BotaoCancelar>
                </BotoesAcao>
              </div>
            ) : (
              // Modo de visualização
              <div>
                <NotaContainer>
                  <Estrelas>{'★'.repeat(review.nota)}</Estrelas>
                  <NotaTexto>{review.nota}/5</NotaTexto>
                </NotaContainer>
                
                <ConteudoReview>
                  {review.conteudo.split('\n\n')[1] || review.conteudo}
                </ConteudoReview>
                
                <BotoesAcao>
                  <BotaoEditar onClick={() => iniciarEdicao(review)}>
                    ✏️ Editar Review
                  </BotaoEditar>
                </BotoesAcao>
              </div>
            )}
          </ReviewCard>
        ))
      )}
    </Container>
  );
}

export default Reviews;
