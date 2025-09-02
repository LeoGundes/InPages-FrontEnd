import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { deleteFavorito, getFavoritos } from '../services/favoritos';
import { getFavoritosGoogle, removeFavoritoGoogle } from '../services/favoritosGoogle';
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
    const [favoritosGoogle, setFavoritosGoogle] = useState([]);

    useEffect(() => {
        async function fetchFavoritos() {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (usuario && usuario.email) {
                const favoritosDoUsuario = await getFavoritos(usuario.email);
                setFavoritos(favoritosDoUsuario);
                setFavoritosGoogle(getFavoritosGoogle(usuario.email));
            }
        }
        fetchFavoritos();
    }, []);

    async function deletarFavorito(id) {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      await deleteFavorito(usuario.email, id);
      setFavoritos(favoritos.filter(favorito => favorito.id !== id));
    }

    return (
        <AppContainer>
            <Titulo>Meus Favoritos</Titulo>
            {favoritos.length === 0 && favoritosGoogle.length === 0 ? (
                <p style={{ color: '#1cd6aeff', textAlign: 'center', fontSize: '1.1em' }}>Você ainda não tem favoritos.</p>
            ) : (
                <>
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
                <ListaFavoritos>
                    {favoritosGoogle.map(fav => (
                        <FavoritoContainer key={fav.id}>
                            <FavoritoNome>{fav.title}</FavoritoNome>
                            {fav.thumbnail && <FavoritoImagem src={fav.thumbnail} alt={fav.title} />}
                            <FavoritoRemover onClick={() => {
                                const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
                                removeFavoritoGoogle(usuario.email, fav.id);
                                setFavoritosGoogle(getFavoritosGoogle(usuario.email));
                            }}>
                                Remover dos Favoritos
                            </FavoritoRemover>
                        </FavoritoContainer>
                    ))}
                </ListaFavoritos>
                </>
            )}
        </AppContainer>
    );
}

export default Favoritos