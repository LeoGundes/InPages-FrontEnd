import axios from 'axios';

const seguidoresAPI = axios.create({ baseURL: 'http://localhost:8000/usuarios' });

export async function getSeguidores(email) {
  const response = await seguidoresAPI.get(`/${email}/seguidores`);
  return response.data;
}

export async function getSeguidos(email) {
  const response = await seguidoresAPI.get(`/${email}/seguidos`);
  return response.data;
}

export async function seguirUsuario(email, seguirEmail) {
  const response = await seguidoresAPI.post('/seguir', { email, seguirEmail });
  
  // Atualiza o localStorage se houver dados do usuário na resposta
  if (response.data.usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(response.data.usuario));
  }
  
  return response;
}

export async function deixarDeSeguirUsuario(email, seguirEmail) {
  const response = await seguidoresAPI.post('/deixar-de-seguir', { email, seguirEmail });
  
  // Atualiza o localStorage se houver dados do usuário na resposta
  if (response.data.usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(response.data.usuario));
  }
  
  return response;
}
