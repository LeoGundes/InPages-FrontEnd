import axios from 'axios';

// Salva favoritos do Google Books no localStorage por usuário
export function getFavoritosGoogle(email) {
  return JSON.parse(localStorage.getItem(`favoritosGoogle_${email}`)) || [];
}

export function addFavoritoGoogle(email, livro) {
  const favoritos = getFavoritosGoogle(email);
  if (!favoritos.find(f => f.id === livro.id)) {
    favoritos.push(livro);
    localStorage.setItem(`favoritosGoogle_${email}` , JSON.stringify(favoritos));
  }
}

export function removeFavoritoGoogle(email, id) {
  const favoritos = getFavoritosGoogle(email).filter(f => f.id !== id);
  localStorage.setItem(`favoritosGoogle_${email}` , JSON.stringify(favoritos));
}
