import axios from 'axios';

const favoritosAPI = axios.create({ baseURL: 'http://localhost:8000/usuarios' });

export async function getFavoritos(email) {
  const response = await favoritosAPI.get(`/${email}/favoritos`);
  return response.data;
}

export async function postFavorito(email, id) {
  return favoritosAPI.post(`/${email}/favoritos/${id}`);
}
export async function deleteFavorito(email, id) {
  return favoritosAPI.delete(`/${email}/favoritos/${id}`);
}


