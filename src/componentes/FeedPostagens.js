import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { getLivros } from '../services/livros';
import { postReview } from '../services/Reviews';
import { buscarLivrosGoogle } from '../services/googleBooks';
import { 
  listarPostagensFeed, 
  curtirPostagem, 
  descurtirPostagem, 
  usuarioCurtiu, 
  obterNumeroCurtidas,
  deletarPostagem
} from '../services/postagens';
import { 
  listarComentarios, 
  adicionarComentario, 
  deletarComentario, 
  editarComentario 
} from '../services/comentarios';
import Modal from './Modal';
import { media } from '../styles/breakpoints';

// Spinner animado
const Spinner = styled.div`
  border: 3px solid #e0e0e0;
  border-top: 3px solid #1cd6ae;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
  margin-left: 10px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


const FeedContainer = styled.section`
  width: 100%;
  max-width: 700px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 32px 24px;
  margin: 0 auto;
  
  ${media.tablet} {
    max-width: 95%;
    padding: 24px 16px;
    border-radius: 12px;
  }
  
  ${media.mobile} {
    max-width: 100%;
    padding: 16px 12px;
    border-radius: 8px;
    margin: 0 10px;
  }
  margin: 0 auto;
  margin-bottom: 32px;
`;

const FormNovaPostagem = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  
  ${media.mobile} {
    gap: 8px;
    margin-bottom: 20px;
  }
`;

const TextArea = styled.textarea`
  resize: none;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #cfd8dc;
  padding: 10px;
  font-size: 1em;
  
  ${media.mobile} {
    min-height: 50px;
    padding: 8px;
    font-size: 0.95em;
  }
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
  
  ${media.mobile} {
    padding: 10px 16px;
    font-size: 0.95em;
    align-self: stretch;
  }
`;

const Postagem = styled.div`
  border-bottom: 1px solid #e6e6e6;
  padding: 18px 0;
  &:last-child { border-bottom: none; }
  
  ${media.tablet} {
    padding: 16px 0;
  }
  
  ${media.mobile} {
    padding: 14px 0;
  }
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

const AcoesPostagem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 8px;
  
  ${media.mobile} {
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 6px;
  }
`;

const BotaoCurtir = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${props => props.curtido ? '#e74c3c' : '#666'};
  font-size: 0.9em;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.curtido ? '#fdf2f2' : '#f8f9fa'};
    color: ${props => props.curtido ? '#c0392b' : '#002F52'};
    transform: scale(1.05);
  }
  
  ${media.mobile} {
    font-size: 0.8em;
    padding: 5px 10px;
    gap: 4px;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .icon {
    font-size: 1.1em;
    transition: transform 0.2s;
  }
  
  &:hover .icon {
    transform: scale(1.2);
  }
`;

const ContadorCurtidas = styled.span`
  color: #666;
  font-size: 0.85em;
  margin-left: 4px;
`;

const BotaoDeletar = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #dc3545;
  font-size: 0.85em;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s;
  margin-left: auto;
  
  &:hover {
    background: #f8d7da;
    color: #721c24;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .icon {
    font-size: 1em;
  }
  
  ${media.mobile} {
    font-size: 0.8em;
    padding: 5px 10px;
    gap: 4px;
    margin-left: 8px;
  }
`;

const PostagemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoUsuario = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 16px;
  
  ${media.mobile} {
    margin-bottom: 12px;
  }
`;

const Tab = styled.button`
  background: ${props => props.active ? '#002F52' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#002F52'};
  border: none;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s;
  flex: 1;
  
  &:hover {
    background: ${props => props.active ? '#002F52' : '#f0f0f0'};
  }
  
  ${media.mobile} {
    padding: 10px 16px;
    font-size: 0.9em;
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  
  ${media.mobile} {
    gap: 10px;
    margin-bottom: 12px;
  }
`;

const LivroInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LivroInput = styled.input`
  border: 1px solid #cfd8dc;
  border-radius: 8px;
  padding: 10px;
  font-size: 1em;
  flex: 1;
`;

const LivroSelecionado = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f8ff;
  border: 2px solid #002F52;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  
  .livro-capa {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .livro-info {
    flex: 1;
    
    .livro-titulo {
      font-weight: bold;
      color: #002F52;
      margin-bottom: 4px;
    }
    
    .livro-autor {
      color: #666;
      font-size: 0.9em;
    }
  }
  
  .remover-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.8em;
    
    &:hover {
      background: #cc0000;
    }
  }
`;

const StarRatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Star = styled.span`
  font-size: 1.5em;
  color: ${props => props.filled ? '#FE9900' : '#ccc'};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #FE9900;
  }
`;

const ReviewPostagem = styled.div`
  border-bottom: 1px solid #e6e6e6;
  padding: 18px 0;
  &:last-child { border-bottom: none; }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
  
  .livro-info {
    background: #f0f8ff;
    border-left: 4px solid #002F52;
    padding: 8px 12px;
    margin: 8px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    ${media.tablet} {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    ${media.mobile} {
      padding: 6px 10px;
      gap: 6px;
    }
  }
  
  .livro-nome {
    font-weight: bold;
    color: #002F52;
  }
  
  .livro-capa {
    width: 60px;
    height: 90px;
    border-radius: 6px;
    object-fit: cover;
    
    ${media.tablet} {
      width: 50px;
      height: 75px;
    }
    
    ${media.mobile} {
      width: 40px;
      height: 60px;
      align-self: center;
    }
  }
  
  ${media.tablet} {
    padding: 16px 0;
  }
  
  ${media.mobile} {
    padding: 14px 0;
  }
  
  .rating {
    color: #FE9900;
    font-size: 1.1em;
  }
`;

// Styled components para comentários
const BotaoComentar = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #666;
  font-size: 0.9em;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    color: #002F52;
    transform: scale(1.05);
  }
  
  ${media.mobile} {
    font-size: 0.8em;
    padding: 5px 10px;
    gap: 4px;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .icon {
    font-size: 1.1em;
  }
`;

const SecaoComentarios = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const FormComentario = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  
  ${media.mobile} {
    flex-direction: column;
    gap: 6px;
  }
`;

const InputComentario = styled.input`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9em;
  outline: none;
  
  &:focus {
    border-color: #002F52;
    box-shadow: 0 0 0 2px rgba(0, 47, 82, 0.1);
  }
  
  ${media.mobile} {
    padding: 6px 12px;
    font-size: 0.85em;
  }
`;

const BotaoEnviarComentario = styled.button`
  background: #002F52;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.85em;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #326589;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  ${media.mobile} {
    padding: 6px 12px;
    font-size: 0.8em;
  }
`;

const ListaComentarios = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Comentario = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
  
  ${media.mobile} {
    padding: 8px 10px;
  }
`;

const HeaderComentario = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  
  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

const NomeComentario = styled.span`
  font-weight: bold;
  color: #002F52;
  font-size: 0.85em;
`;

const DataComentario = styled.span`
  color: #666;
  font-size: 0.75em;
`;

const ConteudoComentario = styled.p`
  margin: 0;
  color: #333;
  font-size: 0.85em;
  line-height: 1.4;
`;

const AcoesComentario = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

const BotaoAcaoComentario = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.75em;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    color: ${props => props.danger ? '#dc3545' : '#002F52'};
  }
  
  ${media.mobile} {
    font-size: 0.7em;
    padding: 1px 4px;
  }
`;

const InputEdicao = styled.input`
  width: 100%;
  border: 1px solid #002F52;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.85em;
  outline: none;
  margin-top: 4px;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 47, 82, 0.1);
  }
`;


function FeedPostagens({ usuario }) {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  
  // Estados para review
  const [tabAtiva, setTabAtiva] = useState('postagem'); // 'postagem' ou 'review'
  const [livros, setLivros] = useState([]);
  const [livroNome, setLivroNome] = useState('');
  const [livrosSugeridos, setLivrosSugeridos] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [buscandoLivro, setBuscandoLivro] = useState(false);
  const [reviewTexto, setReviewTexto] = useState('');
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState(undefined);

  // Estados para modal de confirmação
  const [modalAberto, setModalAberto] = useState(false);
  const [postagemParaDeletar, setPostagemParaDeletar] = useState(null);

  // Estados para comentários
  const [comentarios, setComentarios] = useState({});
  const [comentariosVisiveis, setComentariosVisiveis] = useState({});
  const [novoComentario, setNovoComentario] = useState({});
  const [editandoComentario, setEditandoComentario] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState({});

  const carregarFeed = () => {
    if (!usuario) return;
    setLoading(true);
    axios.get(`http://localhost:8000/postagens/feed/${usuario.email}`)
      .then(res => setPostagens(res.data))
      .catch(err => {
        console.error('Erro ao carregar feed:', err);
        setPostagens([]);
      })
      .finally(() => setLoading(false));
  };

  const carregarLivros = async () => {
    try {
      const livrosAPI = await getLivros();
      setLivros(livrosAPI);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  };

  // Função para curtir/descurtir postagem
  const handleCurtir = async (postagemId) => {
    if (!usuario) return;
    
    try {
      const postagem = postagens.find(p => p.id === postagemId);
      const jaCurtiu = usuarioCurtiu(postagem, usuario.email);
      
      console.log('Handle curtir - ID:', postagemId, 'Já curtiu:', jaCurtiu, 'Email:', usuario.email);
      
      if (jaCurtiu) {
        console.log('Tentando descurtir...');
        await descurtirPostagem(postagemId, usuario.email);
        console.log('Descurtiu com sucesso');
      } else {
        console.log('Tentando curtir...');
        await curtirPostagem(postagemId, usuario.email);
        console.log('Curtiu com sucesso');
      }
      
      // Atualizar o estado local
      setPostagens(postagens.map(p => {
        if (p.id === postagemId) {
          const novasCurtidas = p.curtidas || [];
          if (jaCurtiu) {
            return { ...p, curtidas: novasCurtidas.filter(email => email !== usuario.email) };
          } else {
            return { ...p, curtidas: [...novasCurtidas, usuario.email] };
          }
        }
        return p;
      }));
      
    } catch (error) {
      console.error('Erro detalhado ao curtir/descurtir:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setErro('Erro ao processar curtida');
      
      // Exibe notificação de erro
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao processar curtida. Tente novamente.'
        });
      }
    }
  };

  useEffect(() => {
    carregarFeed();
    carregarLivros();
    // eslint-disable-next-line
  }, [usuario]);

  // Função para filtrar livros conforme o usuário digita
  useEffect(() => {
    const buscarLivros = async () => {
      if (livroNome.length > 2 && !livroSelecionado) {
        setBuscandoLivro(true);
        try {
          // Busca primeiro nos livros locais
          const sugestoesLocais = livros.filter(livro => 
            livro.nome.toLowerCase().includes(livroNome.toLowerCase())
          ).slice(0, 3);

          // Busca no Google Books
          const googleResults = await buscarLivrosGoogle({ termo: livroNome });
          const sugestoesGoogle = googleResults.slice(0, 3).map(item => ({
            id: item.id,
            nome: item.volumeInfo.title,
            autor: item.volumeInfo.authors?.join(', ') || 'Autor não informado',
            capa: item.volumeInfo.imageLinks?.thumbnail,
            fonte: 'google'
          }));

          // Combina sugestões locais e do Google
          const todasSugestoes = [
            ...sugestoesLocais.map(livro => ({ ...livro, fonte: 'local' })),
            ...sugestoesGoogle
          ];

          setLivrosSugeridos(todasSugestoes);
        } catch (error) {
          console.error('Erro ao buscar livros:', error);
          // Fallback para busca local apenas
          const sugestoesLocais = livros.filter(livro => 
            livro.nome.toLowerCase().includes(livroNome.toLowerCase())
          ).slice(0, 5);
          setLivrosSugeridos(sugestoesLocais.map(livro => ({ ...livro, fonte: 'local' })));
        } finally {
          setBuscandoLivro(false);
        }
      } else {
        setLivrosSugeridos([]);
        setBuscandoLivro(false);
      }
    };

    const timeoutId = setTimeout(buscarLivros, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [livroNome, livros, livroSelecionado]);

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
      
      // Exibe notificação de sucesso
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Post publicado com sucesso!'
        });
      }
    } catch (err) {
      setErro("Erro ao postar. Tente novamente.");
      
      // Exibe notificação de erro
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao publicar post. Tente novamente.'
        });
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!livroSelecionado || !reviewTexto.trim()) {
      setErro("Escolha um livro e escreva sua review.");
      return;
    }
    setEnviando(true);
    try {
      let livroParaReview;
      
      if (livroSelecionado.fonte === 'local') {
        // Livro local - usa o ID existente
        livroParaReview = livroSelecionado;
        await postReview({ 
          livroId: livroSelecionado.id, 
          usuario: usuario.email, 
          texto: reviewTexto, 
          nota: nota 
        });
      } else {
        // Livro do Google Books - cria um ID único
        const livroId = `google_${livroSelecionado.id}`;
        livroParaReview = { ...livroSelecionado, id: livroId };
        await postReview({ 
          livroId: livroId, 
          usuario: usuario.email, 
          texto: reviewTexto, 
          nota: nota 
        });
      }
      
      // Cria uma postagem no feed sobre a review
      const conteudoReview = `📖 Review: "${livroSelecionado.nome}"\n\n${reviewTexto}\n\n⭐ Nota: ${nota}/5`;
      await axios.post("http://localhost:8000/postagens", {
        email: usuario.email,
        conteudo: conteudoReview,
        tipo: 'review',
        livro: livroSelecionado.nome,
        nota: nota,
        capaLivro: livroSelecionado.capa
      });
      
      // Limpa o formulário
      setLivroNome('');
      setLivroSelecionado(null);
      setReviewTexto('');
      setNota(5);
      setTabAtiva('postagem');
      carregarFeed();
      
      // Exibe notificação de sucesso
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: `Review de "${livroSelecionado.nome}" publicada com sucesso!`
        });
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      setErro(`Erro ao enviar review: ${err.response?.data || err.message || 'Tente novamente.'}`);
      
      // Exibe notificação de erro
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao publicar review. Tente novamente.'
        });
      }
    } finally {
      setEnviando(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(estrela => (
      <Star
        key={estrela}
        filled={estrela <= (hoverNota ?? nota)}
        onClick={() => setNota(estrela)}
        onMouseEnter={() => setHoverNota(estrela)}
        onMouseLeave={() => setHoverNota(undefined)}
      >
        ★
      </Star>
    ));
  };

  const selecionarLivro = (livro) => {
    setLivroSelecionado(livro);
    setLivroNome(livro.nome);
    setLivrosSugeridos([]);
  };

  const removerLivroSelecionado = () => {
    setLivroSelecionado(null);
    setLivroNome('');
  };

  const handleDeletar = (postagemId) => {
    setPostagemParaDeletar(postagemId);
    setModalAberto(true);
  };

  const confirmarDeletar = async () => {
    try {
      // Usa o usuário que já vem como prop do componente
      if (!usuario || !usuario.email) {
        throw new Error('Usuário não está logado ou dados são inválidos');
      }
      
      console.log('Tentando deletar postagem:', postagemParaDeletar, 'do usuário:', usuario.email);
      
      await deletarPostagem(postagemParaDeletar, usuario.email);
      
      // Remove a postagem da lista local
      setPostagens(postagens.filter(postagem => postagem.id !== postagemParaDeletar));
      
      // Exibe notificação de sucesso
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Postagem deletada com sucesso!'
        });
      }
    } catch (error) {
      console.error('Erro completo ao deletar postagem:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      // Exibe notificação de erro com detalhes
      if (window.showNotification) {
        const errorMessage = error.response?.data || error.message || 'Erro ao deletar postagem. Tente novamente.';
        window.showNotification({
          type: 'error',
          message: errorMessage
        });
      }
    } finally {
      setModalAberto(false);
      setPostagemParaDeletar(null);
    }
  };

  const cancelarDeletar = () => {
    setModalAberto(false);
    setPostagemParaDeletar(null);
  };

  // Funções para gerenciar comentários
  const carregarComentarios = async (postagemId) => {
    try {
      const comentariosPostagem = await listarComentarios(postagemId);
      setComentarios(prev => ({
        ...prev,
        [postagemId]: comentariosPostagem
      }));
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const toggleComentarios = async (postagemId) => {
    const estaoVisiveis = comentariosVisiveis[postagemId];
    
    if (!estaoVisiveis) {
      // Se não estão visíveis, carrega e mostra
      await carregarComentarios(postagemId);
      setComentariosVisiveis(prev => ({
        ...prev,
        [postagemId]: true
      }));
    } else {
      // Se estão visíveis, esconde
      setComentariosVisiveis(prev => ({
        ...prev,
        [postagemId]: false
      }));
    }
  };

  const handleEnviarComentario = async (e, postagemId) => {
    e.preventDefault();
    const conteudo = novoComentario[postagemId]?.trim();
    
    if (!conteudo || !usuario) return;
    
    setEnviandoComentario(prev => ({ ...prev, [postagemId]: true }));
    
    try {
      await adicionarComentario(postagemId, usuario.email, conteudo);
      
      // Limpa o input
      setNovoComentario(prev => ({
        ...prev,
        [postagemId]: ''
      }));
      
      // Recarrega os comentários
      await carregarComentarios(postagemId);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Comentário adicionado com sucesso!'
        });
      }
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao enviar comentário. Tente novamente.'
        });
      }
    } finally {
      setEnviandoComentario(prev => ({ ...prev, [postagemId]: false }));
    }
  };

  const handleDeletarComentario = async (comentarioId, postagemId) => {
    try {
      await deletarComentario(comentarioId, usuario.email);
      await carregarComentarios(postagemId);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Comentário deletado com sucesso!'
        });
      }
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao deletar comentário. Tente novamente.'
        });
      }
    }
  };

  const iniciarEdicao = (comentario) => {
    setEditandoComentario(comentario.id);
    setTextoEdicao(comentario.conteudo);
  };

  const cancelarEdicao = () => {
    setEditandoComentario(null);
    setTextoEdicao('');
  };

  const salvarEdicao = async (comentarioId, postagemId) => {
    if (!textoEdicao.trim()) return;
    
    try {
      await editarComentario(comentarioId, usuario.email, textoEdicao);
      await carregarComentarios(postagemId);
      setEditandoComentario(null);
      setTextoEdicao('');
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Comentário editado com sucesso!'
        });
      }
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Erro ao editar comentário. Tente novamente.'
        });
      }
    }
  };

  const renderComentarios = (postagemId) => {
    const comentariosPostagem = comentarios[postagemId] || [];
    const visivel = comentariosVisiveis[postagemId];
    
    if (!visivel) return null;
    
    return (
      <SecaoComentarios>
        <FormComentario onSubmit={(e) => handleEnviarComentario(e, postagemId)}>
          <InputComentario
            placeholder="Adicione um comentário..."
            value={novoComentario[postagemId] || ''}
            onChange={(e) => setNovoComentario(prev => ({
              ...prev,
              [postagemId]: e.target.value
            }))}
            disabled={enviandoComentario[postagemId]}
          />
          <BotaoEnviarComentario 
            type="submit" 
            disabled={enviandoComentario[postagemId] || !novoComentario[postagemId]?.trim()}
          >
            {enviandoComentario[postagemId] ? '...' : 'Enviar'}
          </BotaoEnviarComentario>
        </FormComentario>
        
        <ListaComentarios>
          {comentariosPostagem.map(comentario => (
            <Comentario key={comentario.id}>
              <HeaderComentario>
                <NomeComentario>{comentario.nomeUsuario}</NomeComentario>
                <DataComentario>
                  {new Date(comentario.data).toLocaleString('pt-BR')}
                  {comentario.dataEdicao && ' (editado)'}
                </DataComentario>
              </HeaderComentario>
              
              {editandoComentario === comentario.id ? (
                <div>
                  <InputEdicao
                    value={textoEdicao}
                    onChange={(e) => setTextoEdicao(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        salvarEdicao(comentario.id, postagemId);
                      } else if (e.key === 'Escape') {
                        cancelarEdicao();
                      }
                    }}
                    autoFocus
                  />
                  <AcoesComentario>
                    <BotaoAcaoComentario onClick={() => salvarEdicao(comentario.id, postagemId)}>
                      ✓ Salvar
                    </BotaoAcaoComentario>
                    <BotaoAcaoComentario onClick={cancelarEdicao}>
                      ✕ Cancelar
                    </BotaoAcaoComentario>
                  </AcoesComentario>
                </div>
              ) : (
                <div>
                  <ConteudoComentario>{comentario.conteudo}</ConteudoComentario>
                  {comentario.emailUsuario === usuario.email && (
                    <AcoesComentario>
                      <BotaoAcaoComentario onClick={() => iniciarEdicao(comentario)}>
                        ✏️ Editar
                      </BotaoAcaoComentario>
                      <BotaoAcaoComentario 
                        danger 
                        onClick={() => handleDeletarComentario(comentario.id, postagemId)}
                      >
                        🗑️ Deletar
                      </BotaoAcaoComentario>
                    </AcoesComentario>
                  )}
                </div>
              )}
            </Comentario>
          ))}
        </ListaComentarios>
      </SecaoComentarios>
    );
  };

  return (
    <FeedContainer>
      <h3>Feed dos Seguidos</h3>
      
      <TabContainer>
        <Tab 
          active={tabAtiva === 'postagem'} 
          onClick={() => setTabAtiva('postagem')}
        >
          💬 Post
        </Tab>
        <Tab 
          active={tabAtiva === 'review'} 
          onClick={() => setTabAtiva('review')}
        >
          📖 Review
        </Tab>
      </TabContainer>

      {tabAtiva === 'postagem' ? (
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
      ) : (
        <FormNovaPostagem onSubmit={handleReviewSubmit}>
          <ReviewContainer>
            {livroSelecionado ? (
              <LivroSelecionado>
                {livroSelecionado.capa && (
                  <img 
                    src={livroSelecionado.capa} 
                    alt={livroSelecionado.nome}
                    className="livro-capa"
                  />
                )}
                <div className="livro-info">
                  <div className="livro-titulo">{livroSelecionado.nome}</div>
                  <div className="livro-autor">{livroSelecionado.autor || 'Autor não informado'}</div>
                </div>
                <button 
                  type="button"
                  className="remover-btn"
                  onClick={removerLivroSelecionado}
                >
                  ✕
                </button>
              </LivroSelecionado>
            ) : (
              <LivroInputContainer>
                <LivroInput
                  placeholder="Digite o nome do livro..."
                  value={livroNome}
                  onChange={e => setLivroNome(e.target.value)}
                  disabled={enviando}
                />
                {buscandoLivro && <Spinner />}
                {livrosSugeridos.length > 0 && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    background: '#fff', 
                    border: '1px solid #cfd8dc', 
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    {livrosSugeridos.map((livro, index) => (
                      <div
                        key={`${livro.fonte}_${livro.id || index}`}
                        style={{ 
                          padding: '12px', 
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                        onClick={() => selecionarLivro(livro)}
                        onMouseEnter={e => e.target.style.background = '#f0f8ff'}
                        onMouseLeave={e => e.target.style.background = '#fff'}
                      >
                        {livro.capa && (
                          <img 
                            src={livro.capa} 
                            alt={livro.nome}
                            style={{ 
                              width: '40px', 
                              height: '50px', 
                              objectFit: 'cover',
                              borderRadius: '4px',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            {livro.nome}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.85em' }}>
                            {livro.autor || 'Autor não informado'}
                          </div>
                          <div style={{ color: '#999', fontSize: '0.75em' }}>
                            {livro.fonte === 'google' ? 'Google Books' : 'Biblioteca Local'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </LivroInputContainer>
            )}
            
            <StarRatingWrapper>
              <span style={{ marginRight: '8px', fontWeight: 'bold' }}>Nota:</span>
              {renderStars()}
              <span style={{ marginLeft: '8px', color: '#666' }}>({nota}/5)</span>
            </StarRatingWrapper>
            
            <TextArea
              placeholder="Escreva sua review do livro..."
              value={reviewTexto}
              onChange={e => setReviewTexto(e.target.value)}
              disabled={enviando}
              style={{ minHeight: '80px' }}
            />
          </ReviewContainer>
          
          {erro && <div style={{color: 'red', fontSize: '0.95em'}}>{erro}</div>}
          <Botao type="submit" disabled={enviando || !livroSelecionado || !reviewTexto.trim()}>
            {enviando ? 'Enviando...' : 'Publicar Review'}
          </Botao>
        </FormNovaPostagem>
      )}

      {loading ? (
        <div>Carregando postagens...</div>
      ) : postagens.length === 0 ? (
        <div>Nenhuma postagem encontrada.</div>
      ) : (
        postagens.map(post => (
          post.tipo === 'review' ? (
            <ReviewPostagem key={post.id}>
              <div className="review-header">
                <NomeUsuario>{post.nome}</NomeUsuario>
                <Data>{new Date(post.data).toLocaleString('pt-BR')}</Data>
              </div>
              <div className="livro-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {post.capaLivro && (
                    <img 
                      src={post.capaLivro} 
                      alt={post.livro}
                      style={{ 
                        width: '50px', 
                        height: '70px', 
                        objectFit: 'cover',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    />
                  )}
                  <div>
                    <div className="livro-nome">📖 {post.livro}</div>
                    <div className="rating">
                      {'⭐'.repeat(post.nota)} ({post.nota}/5)
                    </div>
                  </div>
                </div>
              </div>
              <Conteudo>{post.conteudo.split('\n\n')[1]}</Conteudo>
              <AcoesPostagem>
                <BotaoCurtir 
                  curtido={usuarioCurtiu(post, usuario.email)}
                  onClick={() => handleCurtir(post.id)}
                >
                  <span className="icon">
                    {usuarioCurtiu(post, usuario.email) ? '❤️' : '🤍'}
                  </span>
                  {usuarioCurtiu(post, usuario.email) ? 'Curtido' : 'Curtir'}
                  <ContadorCurtidas>
                    {obterNumeroCurtidas(post) > 0 && `(${obterNumeroCurtidas(post)})`}
                  </ContadorCurtidas>
                </BotaoCurtir>
                
                <BotaoComentar onClick={() => toggleComentarios(post.id)}>
                  <span className="icon">💬</span>
                  {comentariosVisiveis[post.id] ? 'Ocultar' : 'Comentar'}
                  {comentarios[post.id]?.length > 0 && (
                    <ContadorCurtidas>({comentarios[post.id].length})</ContadorCurtidas>
                  )}
                </BotaoComentar>
                
                {post.email === usuario.email && (
                  <BotaoDeletar onClick={() => handleDeletar(post.id)}>
                    <span className="icon">🗑️</span>
                    Deletar
                  </BotaoDeletar>
                )}
              </AcoesPostagem>
              {renderComentarios(post.id)}
            </ReviewPostagem>
          ) : (
            <Postagem key={post.id}>
              <NomeUsuario>{post.nome}</NomeUsuario>
              <Data>{new Date(post.data).toLocaleString('pt-BR')}</Data>
              <Conteudo>{post.conteudo}</Conteudo>
              <AcoesPostagem>
                <BotaoCurtir 
                  curtido={usuarioCurtiu(post, usuario.email)}
                  onClick={() => handleCurtir(post.id)}
                >
                  <span className="icon">
                    {usuarioCurtiu(post, usuario.email) ? '❤️' : '🤍'}
                  </span>
                  {usuarioCurtiu(post, usuario.email) ? 'Curtido' : 'Curtir'}
                  <ContadorCurtidas>
                    {obterNumeroCurtidas(post) > 0 && `(${obterNumeroCurtidas(post)})`}
                  </ContadorCurtidas>
                </BotaoCurtir>
                
                <BotaoComentar onClick={() => toggleComentarios(post.id)}>
                  <span className="icon">💬</span>
                  {comentariosVisiveis[post.id] ? 'Ocultar' : 'Comentar'}
                  {comentarios[post.id]?.length > 0 && (
                    <ContadorCurtidas>({comentarios[post.id].length})</ContadorCurtidas>
                  )}
                </BotaoComentar>
                
                {post.email === usuario.email && (
                  <BotaoDeletar onClick={() => handleDeletar(post.id)}>
                    <span className="icon">🗑️</span>
                    Deletar
                  </BotaoDeletar>
                )}
              </AcoesPostagem>
              {renderComentarios(post.id)}
            </Postagem>
          )
        ))
      )}

      <Modal
        isOpen={modalAberto}
        onClose={cancelarDeletar}
        title="Deletar Postagem"
        message="Tem certeza que deseja deletar esta postagem? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={confirmarDeletar}
        type="danger"
      />
    </FeedContainer>
  );
}

export default FeedPostagens;
