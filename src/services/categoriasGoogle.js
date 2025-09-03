import { buscarLivrosGoogle } from './googleBooks';



export async function buscarLivrosPorCategoriaGoogle(categoria) {
  // Busca livros do Google Books por categoria (subject) e filtra resultados irrelevantes
  // Para categorias especiais, busca também por palavras-chave relacionadas
  const irrelevantes = [
    // Palavras negativas para remover páginas, cadernos, planners, etc
    'page', 'página', 'notebook', 'workbook', 'caderno', 'folha', 'sheet', 'planner', 'agenda', 'diário', 'diary', 'logbook',
    'blank', 'lined', 'graph', 'dot', 'grid', 'composition', 'sketchbook', 'drawing', 'coloring', 'activity', 'copybook', 'exercise book',
    'journal', 'bullet', 'organizer', 'calendar', 'schedule', 'address book', 'guest book', 'password book', 'recipe book', 'ledger',
    'register', 'record', 'tracker', 'log', 'notes', 'memo', 'pad', 'paper', 'scrapbook', 'scrap',
    // Palavras negativas já existentes
    'magazine', 'revista', 'summary', 'resumo', 'abstract', 'article', 'artigo', 'periodico', 'periodical', 'guide', 
    'guia', 'manual', 'handbook', 'handbuch', 'apostila', 'collection', 'coleção', 'test', 'exame', 'exercício', 
    'exercises', 'questions', 'questões', 'study guide', 'trabalho', 'proceedings', 'conference', 'congresso', 'encontro', 
    'meeting', 'volume', 'vol.', 'vol ', 'mag', 'mag.', 'edição', 'edition', 'edicao', 'ed.'
  ];

  // Palavras positivas para pontuar relevância
  const positivas = [
    'figma', 'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
    'typescript', 'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
    'ui', 'ux', 'design', 'algoritmo', 'algorithms', 'database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'devops', 'mobile', 'android', 'ios', 'flutter', 'xamarin', 'prototyping', 'branding', 'interface', 'microservices', 'serverless', 'tailwind', 'bootstrap', 'sass', 'webpack', 'fastapi', 'spring', 'rails', 'laravel', 'asp.net', 'firebase', 'graphql', 'api', 'rest', 'testes', 'testing', 'ci/cd', 'terraform', 'ansible', 'redis', 'elasticsearch', 'security', 'segurança', 'clean code', 'ddd', 'tdd', 'refatoração', 'refactoring', 'patterns', 'padrões', 'arquitetura', 'architecture', 'scrum', 'agile', 'kanban', 'product', 'user experience', 'user interface', 'web design', 'graphic design', 'adobe', 'sketch', 'xd', 'product design', 'interaction design', 'cloud computing', 'cloud storage', 'cloud security', 'cloud migration'
  ];

  function filtrarLivrosAvancado(items, categoria) {
    return (items || [])
      .map(item => {
        let score = 0;
        const info = item.volumeInfo;
        if (!info) return null;
        if (!info.title || !info.authors || !info.imageLinks?.thumbnail || !info.description) return null;
        const title = info.title.toLowerCase();
        const desc = info.description.toLowerCase();

        // Palavras negativas
        if (irrelevantes.some(p => title.includes(p) || desc.includes(p))) return null;

  // Apenas livros em português (pt, pt-BR ou por)
  if (!['pt', 'pt-BR', 'por'].includes(info.language)) return null;

        // Título muito grande (provavelmente irrelevante)
        if (info.title.length > 90) return null;

        // Palavras positivas
        let temPalavraPositiva = positivas.some(p => title.includes(p) || desc.includes(p));
        if (temPalavraPositiva) score += 2;

        // Categoria no título/descrição
        let temCategoria = title.includes(categoria.toLowerCase()) || desc.includes(categoria.toLowerCase());
        if (temCategoria) score += 1;

        // Descrição longa
        if (info.description.length > 80) score += 1;

        // Autor conhecido
        if (info.authors.length > 0) score += 1;

        // Ano de publicação
        if (info.publishedDate && parseInt(info.publishedDate) >= 2000) score += 1;

        // Número de páginas
        if (info.pageCount && info.pageCount > 100) score += 1;

        // Só retorna livros com score mínimo E que tenham relação com a categoria ou palavra positiva
        if (score >= 4 && (temCategoria || temPalavraPositiva)) {
          return { ...item, _score: score };
        }
        return null;
      })
      .filter(Boolean);
  }

  // Palavras-chave extras para categorias específicas
  const palavrasChavePorCategoria = {
    'Programação': [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 
      'TypeScript', 'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask'
    ],
    'Design': [
      'Figma', 'UI', 'UX', 'Web Design', 'Graphic Design', 'User Experience', 'User Interface', 'Product Design', 
      'Interaction Design', 'Adobe XD', 'Sketch', 'Prototyping', 'Design Thinking', 'Branding', 'Interface Design'
    ],
    'DevOps': [
      'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Ansible', 'Terraform', 'AWS', 'Azure', 'Google Cloud', 'DevSecOps'
    ],
    'Banco de Dados': [
      'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'Microsoft SQL Server', 'SQLite', 'Redis', 'Elasticsearch'
    ],
    'Front-end': [
      'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Webpack'
    ],
    'Back-end': [
      'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Ruby on Rails', 'ASP.NET', 'Laravel', 'FastAPI', 'Koa'
    ],
    'Mobile': [
      'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin', 'Swift', 'Kotlin', 'Mobile Development', 'Cross-Platform', 'App Design'
    ],
    'Cloud': [
      'AWS', 'Azure', 'Google Cloud', 'Cloud Computing', 'Serverless', 'Microservices', 'Cloud Storage', 'Cloud Security', 'Cloud Migration', 'Kubernetes'
    ]
  };

  let resultados = [];
  let vistos = new Set();

  // 1. Busca por subject
  let url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(categoria)}&printType=books&langRestrict=pt&maxResults=20`;
  let res = await fetch(url);
  let data = await res.json();
  let filtrados = filtrarLivrosAvancado(data.items, categoria);
  filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });

  // 2. Se não houver resultados, busca por palavra-chave
  if (resultados.length < 5) {
    url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(categoria)}&printType=books&langRestrict=pt&maxResults=20`;
    res = await fetch(url);
    data = await res.json();
  filtrados = filtrarLivrosAvancado(data.items, categoria);
    filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });
  }

  // 3. Busca por palavras-chave extras se houver para a categoria
  if (palavrasChavePorCategoria[categoria]) {
    for (const palavra of palavrasChavePorCategoria[categoria]) {
      url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(palavra)}&printType=books&langRestrict=pt&maxResults=10`;
      res = await fetch(url);
      data = await res.json();
  filtrados = filtrarLivrosAvancado(data.items, categoria);
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
  filtrados = filtrarLivrosAvancado(data.items, categoria);
    filtrados.forEach(livro => { if (!vistos.has(livro.id)) { resultados.push(livro); vistos.add(livro.id); } });
  }

  return resultados;
}
