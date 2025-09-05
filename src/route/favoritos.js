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
    position: relative;   // Para posicionar o badge
`;

const BadgeBiblioteca = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    background: #4CAF50;
    color: #fff;
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 0.75em;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 2px;
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
    const FavoritoAcao = styled.button `
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.85em;
        cursor: pointer;
        margin: 2px;
        transition: all 0.2s;
        
        &.salvar {
            background: #4CAF50;
            color: #fff;
            &:hover { background: #45a049; }
        }
        
        &.remover {
            background: #f44336;
            color: #fff;
            &:hover { background: #d32f2f; }
        }
    `

    const AcoesContainer = styled.div`
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-top: 8px;
        flex-wrap: wrap;
    `

  function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [favoritosGoogle, setFavoritosGoogle] = useState([]);
    const [livrosNaBiblioteca, setLivrosNaBiblioteca] = useState(new Set());

    useEffect(() => {
        async function fetchFavoritos() {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (usuario && usuario.email) {
                const favoritosDoUsuario = await getFavoritos(usuario.email);
                setFavoritos(favoritosDoUsuario);
                setFavoritosGoogle(getFavoritosGoogle(usuario.email));
                
                // Verifica quais livros estão na biblioteca
                const bibliotecaKey = `biblioteca_${usuario.email}`;
                const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
                const idsNaBiblioteca = new Set(biblioteca.map(livro => livro.id));
                setLivrosNaBiblioteca(idsNaBiblioteca);
            }
        }
        fetchFavoritos();
    }, []);

    async function deletarFavorito(id) {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
      try {
        await deleteFavorito(usuario.email, id);
        setFavoritos(favoritos.filter(favorito => favorito.id !== id));
        
        if (window.showNotification) {
            window.showNotification({
                type: 'success',
                message: 'Livro removido dos favoritos!'
            });
        }
      } catch (error) {
        console.error('Erro ao remover favorito:', error);
        if (window.showNotification) {
            window.showNotification({
                type: 'error',
                message: 'Erro ao remover favorito. Tente novamente.'
            });
        }
      }
    }

    function salvarNaBiblioteca(livro, isGoogle = false) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        const bibliotecaKey = `biblioteca_${usuario.email}`;
        const biblioteca = JSON.parse(localStorage.getItem(bibliotecaKey)) || [];
        
        // Adapta o formato do livro conforme a origem
        const livroParaSalvar = isGoogle ? {
            id: livro.id,
            title: livro.title,
            authors: livro.authors,
            thumbnail: livro.thumbnail,
            usuario: usuario.email,
            lido: false
        } : {
            id: livro.id,
            title: livro.nome,
            authors: ['Autor não informado'],
            thumbnail: livro.src,
            usuario: usuario.email,
            lido: false
        };
        
        // Verifica se o livro já está na biblioteca
        if (biblioteca.find(l => l.id === livroParaSalvar.id)) {
            if (window.showNotification) {
                window.showNotification({
                    type: 'warning',
                    message: 'Este livro já está na sua biblioteca!'
                });
            }
            return;
        }
        
        biblioteca.push(livroParaSalvar);
        localStorage.setItem(bibliotecaKey, JSON.stringify(biblioteca));
        
        // Atualiza o estado para mostrar que o livro está na biblioteca
        setLivrosNaBiblioteca(prev => new Set([...prev, livroParaSalvar.id]));
        
        if (window.showNotification) {
            window.showNotification({
                type: 'success',
                message: `"${livroParaSalvar.title}" salvo na biblioteca!`
            });
        }
    }

    function removerFavoritoGoogle(id) {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            removeFavoritoGoogle(usuario.email, id);
            setFavoritosGoogle(getFavoritosGoogle(usuario.email));
            
            if (window.showNotification) {
                window.showNotification({
                    type: 'success',
                    message: 'Livro removido dos favoritos!'
                });
            }
        } catch (error) {
            console.error('Erro ao remover favorito do Google:', error);
            if (window.showNotification) {
                window.showNotification({
                    type: 'error',
                    message: 'Erro ao remover favorito. Tente novamente.'
                });
            }
        }
    }

    return (
        <AppContainer>
            <Titulo>Meus Favoritos</Titulo>
            {favoritos.length === 0 && favoritosGoogle.length === 0 ? (
                <p style={{ color: '#1cd6aeff', textAlign: 'center', fontSize: '1.1em' }}>Você ainda não tem favoritos.</p>
            ) : (
                <>
                <ListaFavoritos>
                    {favoritos.map(favorito => {
                        const estaNaBiblioteca = livrosNaBiblioteca.has(favorito.id);
                        return (
                            <FavoritoContainer key={favorito.id}>
                                {estaNaBiblioteca && (
                                    <BadgeBiblioteca title="Livro salvo na biblioteca">
                                        📚 Na biblioteca
                                    </BadgeBiblioteca>
                                )}
                                <FavoritoNome>{favorito.nome}</FavoritoNome>
                                <FavoritoImagem src={favorito.src} alt={favorito.nome} />
                                <AcoesContainer>
                                    <FavoritoAcao 
                                        className="salvar" 
                                        onClick={() => salvarNaBiblioteca(favorito, false)}
                                        style={{ 
                                            background: estaNaBiblioteca ? '#9E9E9E' : '#4CAF50',
                                            cursor: estaNaBiblioteca ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={estaNaBiblioteca}
                                    >
                                        📚 {estaNaBiblioteca ? 'Salvo' : 'Salvar na Biblioteca'}
                                    </FavoritoAcao>
                                    <FavoritoAcao 
                                        className="remover" 
                                        onClick={() => deletarFavorito(favorito.id)}
                                    >
                                        🗑️ Remover
                                    </FavoritoAcao>
                                </AcoesContainer>
                            </FavoritoContainer>
                        );
                    })}
                </ListaFavoritos>
                <ListaFavoritos>
                    {favoritosGoogle.map(fav => {
                        const estaNaBiblioteca = livrosNaBiblioteca.has(fav.id);
                        return (
                            <FavoritoContainer key={fav.id}>
                                {estaNaBiblioteca && (
                                    <BadgeBiblioteca title="Livro salvo na biblioteca">
                                        📚 Na biblioteca
                                    </BadgeBiblioteca>
                                )}
                                <FavoritoNome>{fav.title}</FavoritoNome>
                                {fav.thumbnail && <FavoritoImagem src={fav.thumbnail} alt={fav.title} />}
                                <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', margin: '4px 0' }}>
                                    {fav.authors?.join(', ') || 'Autor não informado'}
                                </p>
                                <AcoesContainer>
                                    <FavoritoAcao 
                                        className="salvar" 
                                        onClick={() => salvarNaBiblioteca(fav, true)}
                                        style={{ 
                                            background: estaNaBiblioteca ? '#9E9E9E' : '#4CAF50',
                                            cursor: estaNaBiblioteca ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={estaNaBiblioteca}
                                    >
                                        📚 {estaNaBiblioteca ? 'Salvo' : 'Salvar na Biblioteca'}
                                    </FavoritoAcao>
                                    <FavoritoAcao 
                                        className="remover" 
                                        onClick={() => removerFavoritoGoogle(fav.id)}
                                    >
                                        🗑️ Remover
                                    </FavoritoAcao>
                                </AcoesContainer>
                            </FavoritoContainer>
                        );
                    })}
                </ListaFavoritos>
                </>
            )}
        </AppContainer>
    );
}

export default Favoritos