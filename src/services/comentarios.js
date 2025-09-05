import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Listar comentários de uma postagem
export async function listarComentarios(postagemId) {
  try {
    const response = await axios.get(`${API_BASE}/comentarios/postagem/${postagemId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar comentários:', error);
    throw error;
  }
}

// Adicionar comentário a uma postagem
export async function adicionarComentario(postagemId, emailUsuario, conteudo) {
  try {
    const response = await axios.post(`${API_BASE}/comentarios`, {
      postagemId,
      emailUsuario,
      conteudo
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw error;
  }
}

// Deletar comentário
export async function deletarComentario(comentarioId, emailUsuario) {
  try {
    const response = await axios.delete(`${API_BASE}/comentarios/${comentarioId}`, {
      data: { emailUsuario }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    throw error;
  }
}

// Editar comentário
export async function editarComentario(comentarioId, emailUsuario, novoConteudo) {
  try {
    const response = await axios.put(`${API_BASE}/comentarios/${comentarioId}`, {
      emailUsuario,
      conteudo: novoConteudo
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar comentário:', error);
    throw error;
  }
}
