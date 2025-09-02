import styled from 'styled-components';
import Pesquisa from '../componentes/Pesquisa';
// import TopTres from '../componentes/TopTres';
import FeedPostagens from '../componentes/FeedPostagens';
import ListaUsuarios from '../componentes/ListaUsuarios';
import { useEffect, useState } from 'react';
import CardLivro from '../componentes/CardLivro';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #002F52 40%, #326589 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;

const Dashboard = styled.div`
  width: 100%;
  max-width: 1100px;
  background: #f7f9fb; // cor clara, suave e contrastante
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  padding: 48px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
`;

const Saudacao = styled.h2`
  color: #002F52;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0;
  text-align: center;
  letter-spacing: 1px;
`;


const DestaqueSection = styled.section`
  color: #326589;
  width: 100%;
  margin-top: 24px;
`;

const DestaqueTitulo = styled.h3`
  color: #002F52;
  font-size: 1.3em;
  margin-bottom: 18px;
  font-weight: bold;
`;

const LivrosGrid = styled.div`
  color: #326589;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const NomeDourado = styled.span`
  color: gold;
  font-weight: bold;
  text-shadow:
    1px 1px 2px #002F52,
    -1px -1px 2px #002F52,
    1px -1px 2px #002F52,
    -1px 1px 2px #002F52;
`;
function Home() {
  const [usuario, setUsuario] = useState(null);
  const [livrosDestaque, setLivrosDestaque] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuario(user);
    setLivrosDestaque([
      {
        id: '1',
        nome: 'Cracking the Coding Interview',
        src: '/imagens/LivroCrackCode.jpg',
        autor: 'Gayle Laakmann McDowell'
      },
      {
        id: '2',
        nome: 'Domain-Driven Design',
        src: '/imagens/LivroDDD.jpg',
        autor: 'Eric Evans'
      },
      {
        id: '3',
        nome: 'O Programador Pragmático',
        src: '/imagens/livroProgPragm.jpg',
        autor: 'Andrew Hunt, David Thomas'
      }
    ]);
  }, []);

  // Atualiza usuário logado do localStorage após seguir/deixar de seguir
  const atualizarUsuario = () => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuario(user);
  };

  return (
    <AppContainer>
      <Dashboard>
        <Saudacao>
          {usuario
            ? <>Bem-vindo(a), <NomeDourado>{usuario.nome}</NomeDourado>!</>
            : 'Bem-vindo ao InPages!'}
        </Saudacao>
        <Pesquisa />
        <ListaUsuarios usuario={usuario} onSeguirOuDeixar={atualizarUsuario} />
        <FeedPostagens usuario={usuario} />
      </Dashboard>
    </AppContainer>
  );
}

export default Home;