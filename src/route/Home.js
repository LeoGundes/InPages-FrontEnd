import styled from 'styled-components';
import Pesquisa from '../componentes/Pesquisa';
import TopTres from '../componentes/TopTres';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
`;

function Home() {
  return (
    <AppContainer>
      <Pesquisa />
      <TopTres />
    </AppContainer>
  );
}

export default Home;