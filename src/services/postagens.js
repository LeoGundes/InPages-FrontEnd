import axios from 'axios';

const API_URL = 'http://localhost:8000/postagens';

// Criar nova postagem
export async function criarPostagem(dadosPostagem) {
  try {
    const response = await axios.post(API_URL, dadosPostagem);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    throw error;
  }
}

// Listar todas as postagens
export async function listarPostagens() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar postagens:', error);
    throw error;
  }
}

// Listar postagens do feed (seguidos)
export async function listarPostagensFeed(email) {
  try {
    const response = await axios.get(`${API_URL}/feed/${email}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar feed:', error);
    throw error;
  }
}

// Deletar postagem
export async function deletarPostagem(id, email) {
  try {
    const response = await axios.delete(`${API_URL}/${id}/${email}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar postagem:', error);
    throw error;
  }
}

// Curtir postagem
export async function curtirPostagem(id, email) {
  try {
    const response = await axios.post(`${API_URL}/${id}/curtir`, { email });
    return response.data;
  } catch (error) {
    console.error('Erro ao curtir postagem:', error);
    throw error;
  }
}

// Descurtir postagem
export async function descurtirPostagem(id, email) {
  try {
    // Tenta primeiro com body, se falhar usa query parameter
    const response = await axios.delete(`${API_URL}/${id}/curtir?email=${encodeURIComponent(email)}`, { 
      data: { email },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao descurtir postagem:', error);
    throw error;
  }
}

// Editar postagem
export async function editarPostagem(id, dadosPostagem) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, dadosPostagem);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar postagem:', error);
    throw error;
  }
}

// Verificar se usuário curtiu postagem
export function usuarioCurtiu(postagem, emailUsuario) {
  return postagem.curtidas && postagem.curtidas.includes(emailUsuario);
}

// Obter número de curtidas
export function obterNumeroCurtidas(postagem) {
  return postagem.curtidas ? postagem.curtidas.length : 0;
}
