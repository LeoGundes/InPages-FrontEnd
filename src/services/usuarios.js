import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

export async function cadastrarUsuario({ nome, email, senha }) {
  return api.post('/usuarios', { nome, email, senha });
}

export async function loginUsuario({ email, senha }) {
  return api.post('/usuarios/login', { email, senha });
}