import { livros } from './dadosTopTres';
import styled from 'styled-components';
import { Title } from '../Title';
import  CardLivro  from '../CardLivro';
import LogoAngular from '../../imagens/livro2.png';
import LogoReact from '../../imagens/logo192.png'

const Section = styled.section`
  padding: 20px;
  background-color: #f9f9f9;
`;


/* Novo container para alinhar os cards */
const BookList = styled.div`
    display: flex;              /* coloca os cards lado a lado */
    justify-content: center;    /* centraliza horizontalmente */
    gap: 20px;                  /* espaço entre os cards */
    flex-wrap: wrap;            /* permite quebrar linha em telas pequenas */
    margin-top: 20px;
`;

const BookCard = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 12px;
    background-color: #fff;
    width: 250px;               /* define largura fixa p/ todos os cards */
    text-align: center;         /* centraliza conteúdo dentro do card */
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    img {
        max-width: 100%;
        border-radius: 4px;
    }

    h3 {
        font-size: 18px;          /* corrigi o font-size que estava vazio */
        margin: 8px 0;
    }

    p {
        font-size: 14px;
        color: #666;
    }

    a {
        display: inline-block;
        margin-top: 8px;
        color: #007bff;
        text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function TopTres() {
  return (
    <Section>
      <Title>TOP 3 LIVROS</Title>
      <BookList>
        {livros.map((livro) => (
          <BookCard key={livro.id}>
            <h3>{livro.nome}</h3>
            <img src={livro.src} alt={livro.nome} />
            <p>{livro.Review}</p>
            <a
              href={livro.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Adquira Aqui
            </a>
          </BookCard>
        ))}
      </BookList>
      <BookList>
      <CardLivro
        titulo="Talvez você se interesse:"
        subtitulo="Angular - De Novato a Ninja"
        descricao="Um guia completo para dominar o framework Angular e construir aplicações web robustas."
        img={LogoAngular}
      />
        <CardLivro
        titulo="Talvez você se interesse:"
        subtitulo="React - Aprendendo do Zero"
        descricao="Aprendendo React do básico ao avançado para construir aplicações web interativas."
        img={LogoReact}
      />
      </BookList>
    </Section>
  );
}

export default TopTres;
