import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ListaContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto 32px auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 24px 20px;
`;

const UsuarioItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
`;

const Nome = styled.span`
  color: #002F52;
  font-weight: bold;
`;

const BotaoSeguir = styled.button`
  background: #002F52;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 12px;
  transition: background 0.2s;
  &:hover { background: #326589; }
`;

function ListaUsuarios({ usuario, onSeguirOuDeixar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, []);

  if (!usuario) return null;

  const handleSeguir = async (emailAlvo, seguindo) => {
    setErro("");
    try {
      if (seguindo) {
        await axios.post('http://localhost:8000/usuarios/deixar-de-seguir', { email: usuario.email, seguirEmail: emailAlvo });
      } else {
        await axios.post('http://localhost:8000/usuarios/seguir', { email: usuario.email, seguirEmail: emailAlvo });
      }
      if (onSeguirOuDeixar) onSeguirOuDeixar();
    } catch (err) {
      setErro('Erro ao atualizar seguidores.');
    }
  };

  const usuariosFiltrados = usuarios
    .filter(u => u.email !== usuario.email)
    .filter(u => {
      if (!busca.trim()) return true;
      const termo = busca.trim().toLowerCase();
      return (
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo)
      );
    });

  return (
    <ListaContainer>
      <h3>Usuários</h3>
      <input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid #ccc', width: '100%'}}
      />
      {erro && <div style={{color:'red'}}>{erro}</div>}
      {loading ? (
        <div>Carregando usuários...</div>
      ) : (
        usuariosFiltrados.length === 0 ? (
          <div>Nenhum usuário encontrado.</div>
        ) : (
          usuariosFiltrados.map(u => {
            const seguindo = (usuario.seguidos || []).includes(u.email);
            return (
              <UsuarioItem key={u.email}>
                <Nome>{u.nome} <span style={{color:'#888', fontWeight:'normal', fontSize:'0.95em'}}>({u.email})</span></Nome>
                <BotaoSeguir onClick={() => handleSeguir(u.email, seguindo)}>
                  {seguindo ? 'Deixar de seguir' : 'Seguir'}
                </BotaoSeguir>
              </UsuarioItem>
            );
          })
        )
      )}
    </ListaContainer>
  );
}

export default ListaUsuarios;
