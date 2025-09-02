export async function buscarLivrosGoogle(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items || [];
}
