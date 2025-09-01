import { useEffect, useState } from 'react';
import styled from 'styled-components'
import { deleteFavorito, getFavoritos } from '../services/favoritos';
import livroCrackCode from '../imagens/LivroCrackCode.jpg'

  const AppContainer = styled.div `
        width: 100vw;
        height: 100vh;
        background-image: linear-gradient(90deg,#002f52 35%,#326589 165%);
    `

    const Titulo = styled.h1 `
        text-align: center;
        color: gold;
        font-size: 2em;
        margin: 16px 0;
    `
    const ListaFavoritos = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
`;

const FavoritoContainer = styled.div`
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding: 6px;
    margin: 12px 8px;
    width: 300px;         // tamanho fixo
    min-height: 300px;    // altura mínima para uniformizar
    gap: 8px;
`;

const FavoritoImagem = styled.img`
    width: 210px;         // largura fixa
    height: 260px;        // altura fixa  
    border-radius: 8px;
`;

    const FavoritoNome = styled.h3 `
        margin: 0;
        font-size: 1.2em;
    `
    const FavoritoRemover = styled.button `
        background: transparent;
        border: none;
        color: #ff0000;
        cursor: pointer;
        font-size: 1em;
        margin-top: 8px;

        &:hover {
            text-decoration: underline;
        }
    `

  function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);

    async function fetchFavoritos() {
        const favoritosDaApi = await getFavoritos();
        setFavoritos(favoritosDaApi);
    }

    async function deletarFavorito(id) {
        await deleteFavorito(id);
        setFavoritos(favoritos.filter(favorito => favorito.id !== id));
    }

    useEffect(() => {
        fetchFavoritos();
    }, []);

    return (
        <AppContainer>
            <Titulo>Meus Favoritos</Titulo>
            <ListaFavoritos>
                {favoritos.map(favorito => (
                    <FavoritoContainer key={favorito.id}>
                        <FavoritoNome>{favorito.nome}</FavoritoNome>
                        <FavoritoImagem src={favorito.src} alt={favorito.nome} />
                        <FavoritoRemover onClick={() => deletarFavorito(favorito.id)}>
                            Remover dos Favoritos
                        </FavoritoRemover>
                    </FavoritoContainer>
                ))}
            </ListaFavoritos>
        </AppContainer>
    );
}

export default Favoritos