import { buscarLivrosGoogle } from './googleBooks';



export async function buscarLivrosPorCategoriaGoogle(categoria) {
  // Busca livros do Google Books por categoria (subject) e filtra resultados irrelevantes
  // Para categorias especiais, busca também por palavras-chave relacionadas
  const irrelevantes = [
    'magazine', 'revista', 'summary', 'resumo', 'abstract', 'article', 'artigo', 'journal', 'periodico', 'periodical', 'guide', 'guia', 'manual', 'handbook', 'handbuch', 'workbook', 'notebook', 'apostila', 'collection', 'coleção', 'test', 'exame', 'exercício', 'exercises', 'questions', 'questões', 'study guide', 'trabalho', 'paper', 'proceedings', 'conference', 'congresso', 'encontro', 'meeting', 'volume', 'vol.', 'vol ', 'mag', 'mag.', 'edição', 'edition', 'edicao', 'ed.'
  ];
  function filtrarLivros(items) {
    return (items || []).filter(item => {
      const info = item.volumeInfo;
      if (!info) return false;
      if (!info.title || !info.authors || !info.imageLinks?.thumbnail || !info.description) return false;
      const title = info.title.toLowerCase();
      // Remove títulos genéricos ou de artigos/revistas
      if (irrelevantes.some(palavra => title.includes(palavra))) return false;
      // Remove livros com menos de 40 caracteres de descrição
      if (info.description.length < 40) return false;
      // Remove livros sem autor real
      if (info.authors.length === 0 || info.authors[0].toLowerCase().includes('editor') || info.authors[0].toLowerCase().includes('magazine')) return false;
      // Remove livros com menos de 80 páginas
      if (info.pageCount && info.pageCount < 80) return false;
      // Remove livros publicados antes de 1990
      if (info.publishedDate && parseInt(info.publishedDate) < 1990) return false;
      return true;
    });
  }

  // Palavras-chave extras para categorias específicas
  const palavrasChavePorCategoria = {
    'Design': [
      'Figma', 'UI', 'UX', 'Web Design', 'Graphic Design', 'User Experience', 'User Interface', 'Product Design', 'Interaction Design', 'Adobe XD', 'Sketch', 'Prototyping', 'Design Thinking', 'Branding', 'Interface Design'
    ]
    // Adicione outras categorias e palavras-chave se desejar
  };

  let resultados = [];
  let vistos = new Set();

  // 1. Busca por subject
  let url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(categoria)}&printType=books&langRestrict=pt&maxResults=20`;
  let res = await fetch(url);
  let data = await res.json();
  let filtrados = filtrarLivros(data.items);
  filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });

  // 2. Se não houver resultados, busca por palavra-chave
  if (resultados.length < 5) {
    url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(categoria)}&printType=books&langRestrict=pt&maxResults=20`;
    res = await fetch(url);
    data = await res.json();
    filtrados = filtrarLivros(data.items);
    filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });
  }

  // 3. Busca por palavras-chave extras se houver para a categoria
  if (palavrasChavePorCategoria[categoria]) {
    for (const palavra of palavrasChavePorCategoria[categoria]) {
      url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(palavra)}&printType=books&langRestrict=pt&maxResults=10`;
      res = await fetch(url);
      data = await res.json();
      filtrados = filtrarLivros(data.items);
      filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });
      // Se já tiver 10 resultados bons, para de buscar
      if (resultados.length >= 10) break;
    }
  }

  // 4. Se ainda for pouco, busca em inglês
  if (resultados.length < 5) {
    url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(categoria)}&printType=books&langRestrict=en&maxResults=20`;
    res = await fetch(url);
    data = await res.json();
    filtrados = filtrarLivros(data.items);
    filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });
  }

  return resultados;
}
