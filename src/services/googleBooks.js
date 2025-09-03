const API = 'https://www.googleapis.com/books/v1/volumes';

function montarQuery({ termo = '', autor = '', assunto = '', titulo = '' }) {
  let q = [];
  if (titulo) q.push(`intitle:"${titulo}"`);
  if (autor) q.push(`inauthor:"${autor}"`);
  if (assunto) q.push(`subject:"${assunto}"`);
  if (termo) q.push(termo);
  return q.join(' ');
}



export async function buscarLivrosGoogle({
  termo = '',
  idioma = 'pt',
  apenasLivros = true,
  ebooks = false, // 'ebooks' | 'free-ebooks' | 'paid-ebooks' | false
  ordenar = 'relevance',
  max = 20,
  start = 0,
  autor = '',
  assunto = '',
  titulo = '',
} = {}) {
  // Função auxiliar para buscar e filtrar
  async function fetchAndFilter(paramsObj, termoBusca, opts = {}) {
    const params = new URLSearchParams(paramsObj);
    const url = `${API}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const palavrasBusca = termoBusca.split(/\s+/).filter(Boolean);
    return (data.items ?? []).filter(item => {
      const info = item.volumeInfo;
      if (!info || !info.title || !info.authors || !info.imageLinks?.thumbnail) return false;
      if (info.language && !['pt', 'pt-BR', 'por'].includes(info.language)) return false;
      if (info.title.length > 90) return false;
      if (!info.description || info.description.length < 40) return false;
      if (info.pageCount && info.pageCount < 80) return false;
      // Filtro por categoria (opcional, pode ajustar)
      if (!opts.relaxCategory && info.categories && !info.categories.some(cat =>
        /comput|tech|program|software|informática|engenharia|ciência|matemática|mathematics|logic|algorithm|database|web|mobile|cloud|data|network|hardware|devops|design|user/i.test(cat)
      )) return false;
      // Busca por prefixo: pelo menos uma palavra do termo deve ser prefixo de alguma palavra do título/categoria
      if (!opts.relaxPrefix && palavrasBusca.length > 0) {
        const tituloArr = info.title.toLowerCase().split(/\s+/);
        const categoriasArr = (info.categories || []).join(' ').toLowerCase().split(/\s+/);
        const tudoArr = [...tituloArr, ...categoriasArr];
        const match = palavrasBusca.some(palavra =>
          tudoArr.some(word => word.startsWith(palavra))
        );
        if (!match) return false;
      }
      return true;
    });
  }

  // Estratégia progressiva: tenta do mais restrito ao mais amplo
  const termoBusca = (termo || titulo || assunto || '').toLowerCase().trim();
  const paramsBase = {};
  paramsBase['q'] = montarQuery({ termo, autor, assunto, titulo });
  if (idioma) paramsBase['langRestrict'] = idioma;
  if (apenasLivros) paramsBase['printType'] = 'books';
  if (ebooks) paramsBase['filter'] = ebooks;
  paramsBase['orderBy'] = 'relevance';
  paramsBase['maxResults'] = String(Math.min(Math.max(max, 1), 40));
  paramsBase['startIndex'] = String(Math.max(start, 0));

  // 1. Busca com operadores, filtro completo
  let resultados = await fetchAndFilter(paramsBase, termoBusca);
  if (resultados.length > 0) {
    resultados.sort(ordenaPopularidade);
    return resultados;
  }

  // 2. Só termo puro, filtro completo
  const paramsPuro = { ...paramsBase, q: termoBusca };
  resultados = await fetchAndFilter(paramsPuro, termoBusca);
  if (resultados.length > 0) {
    resultados.sort(ordenaPopularidade);
    return resultados;
  }

  // 3. Só termo puro, relaxa categoria
  resultados = await fetchAndFilter(paramsPuro, termoBusca, { relaxCategory: true });
  if (resultados.length > 0) {
    resultados.sort(ordenaPopularidade);
    return resultados;
  }

  // 4. Só termo puro, relaxa prefixo e categoria
  resultados = await fetchAndFilter(paramsPuro, termoBusca, { relaxCategory: true, relaxPrefix: true });
  if (resultados.length > 0) {
    resultados.sort(ordenaPopularidade);
    return resultados;
  }

  // 5. Se ainda assim nada, retorna tudo que vier da API sem filtro
  const paramsSemFiltro = { ...paramsPuro };
  const res = await fetch(`${API}?${new URLSearchParams(paramsSemFiltro).toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const items = data.items ?? [];
  items.sort(ordenaPopularidade);
  return items;
}

// Ordena por popularidade: mais avaliações e melhor nota primeiro
function ordenaPopularidade(a, b) {
  const ia = a.volumeInfo;
  const ib = b.volumeInfo;
  const ra = ia.ratingsCount || 0;
  const rb = ib.ratingsCount || 0;
  if (rb !== ra) return rb - ra;
  const ava = ia.averageRating || 0;
  const avb = ib.averageRating || 0;
  return avb - ava;
}
