const API = 'http://localhost:8000';

export async function adicionarLivroLido(livroLido) {
    try {
        const response = await fetch(`${API}/livros-lidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livroLido)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao marcar livro como lido');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function buscarLivrosLidos(usuario) {
    try {
        const response = await fetch(`${API}/livros-lidos/${encodeURIComponent(usuario)}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao buscar livros lidos');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function removerLivroLido(id, usuario) {
    try {
        const response = await fetch(`${API}/livros-lidos/${encodeURIComponent(id)}/${encodeURIComponent(usuario)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao remover livro da lista de lidos');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
