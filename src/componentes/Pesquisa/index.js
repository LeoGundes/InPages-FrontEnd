import Input from '../Input'
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getLivros } from '../../services/livros';
import { postFavorito } from '../../services/favoritos';



const PesquisaContainer = styled.section`
    display: flex;              /* usa flexbox */
    flex-direction: column;     /* elementos em coluna (um abaixo do outro) */
    align-items: center;        /* centraliza horizontalmente */
    justify-content: center;    /* centraliza verticalmente */
    padding: 20px;              /* espaço interno */
    min-height: 400px;          /* altura mínima da seção */
    width: 100%;                /* ocupa toda a largura disponível */
    max-width: 1000px;          /* mas limita no máximo a 1000px */
    margin: 0 auto;             /* centraliza horizontalmente na tela */
`;

const Titulo = styled.h2`
    color: #FFF;                /* cor do texto branca */
    font-size: 36px;            /* tamanho da fonte grande */
    margin-bottom: 80px;        /* espaço abaixo do título */
`;

const Subtitulo = styled.h3`
    color: #FFF;                /* cor branca também */
    font-size: 18px;            /* tamanho menor que o título */
    margin-bottom: 40px;        /* espaço abaixo do subtítulo */
`;

const Resultado = styled.div`
    display: flex;              /* usa flexbox */
    flex-direction: column;     /* organiza em coluna (título em cima, conteúdo embaixo) */
    justify-content: center;    /* centraliza verticalmente os itens */
    background-color: #FFF;     /* fundo branco */
    border-radius: 30px;        /* cantos arredondados */
    padding: 16px;              /* espaço interno */
    margin-bottom: 2px;        /* espaço abaixo do card */
    width: 100%;                /* ocupa largura total do pai */
    max-width: 300px;           /* mas limita em 300px */

  .nome {
    margin-bottom: 8px;         /* espaço abaixo do título */
    font-weight: bold;          /* deixa em negrito */
    text-align: center;         /* centraliza o texto */
  }

  .conteudo {
    display: flex;              /* coloca imagem e texto lado a lado */
    align-items: flex-start;    /* alinha pelo topo */
    gap: 16px;                  /* espaço entre imagem e texto */
  }

  img {
    margin-bottom: 30px;
    max-width: 150px;           /* define largura máxima da imagem */
    height: auto;               /* altura proporcional */
    border-radius: 4px;         /* cantos levemente arredondados */
    flex-shrink: 0;             /* impede que a imagem diminua se faltar espaço */
    cursor: pointer;
  }

  .review {
    flex: 1;                    /* ocupa todo espaço restante ao lado da imagem */
    color: #333;                /* cor do texto cinza escuro */
    text-align: left;           /* texto alinhado à esquerda */
    word-break: break-word;     /* quebra palavras grandes se necessário */
  }
`;


function Pesquisa() {
    const [query, setQuery] = useState('');
    const [livrosPesquisados, setlivrosPesquisados] = useState([]);
    const [livros, setLivros] = useState([]);

    useEffect(() => {
        fetchLivros();
    }, [])

    async function fetchLivros() {
        const livrosDaAPI = await getLivros();
        setLivros(livrosDaAPI);
    }
    
    async function insertFavorito(id) {
        await postFavorito(id);
    }

    const handleSearch = () => {
    const texto = query.trim().toLowerCase();
    if (!texto) {
        setlivrosPesquisados([]);
        return;
    }
    const livrosFiltrados = livros.filter(livro =>
        livro.nome.toLowerCase().includes(texto)
    );
    setlivrosPesquisados(livrosFiltrados);
}

    return(
        <PesquisaContainer>
            <Titulo>Aqui você encontra os melhores livros de programação</Titulo>
            <Subtitulo>Pesquise pelo título, autor ou assunto</Subtitulo>
        <Input 
            placeholder="Seu livro aqui !"
            value={query}
            onChange={evento => setQuery(evento.target.value)}
            onKeyDown={evento => {
                if (evento.key === 'Enter') {
                    evento.preventDefault();
                    handleSearch();
                }
            }}
        />
        {livrosPesquisados.map(livro => (
            <Resultado onClick={() => insertFavorito(livro.id)} key={livro.id}>
                <p className="nome">{livro.nome}</p>
            <div className="conteudo">
                <a href={livro.link} target="_blank" rel="noopener noreferrer">
                    <img src={livro.src} />
                </a>
                <p className="review">{livro.Review}</p>
            </div>
            </Resultado>

        ))}
    </PesquisaContainer>
    )
}

export default Pesquisa;