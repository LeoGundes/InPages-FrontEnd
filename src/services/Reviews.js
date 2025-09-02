import axios from 'axios';

const reviewsAPI = axios.create({ baseURL: 'http://localhost:8000/reviews' });

export async function getReviews(livroId) {
  const response = await reviewsAPI.get('/', { params: livroId ? { livroId } : {} });
  return response.data;
}

export async function postReview({ livroId, usuario, texto, nota }) {
  return reviewsAPI.post('/', { livroId, usuario, texto, nota });
}
