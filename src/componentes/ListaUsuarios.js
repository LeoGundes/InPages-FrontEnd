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
  background: ${props => props.seguindo ? '#e74c3c' : '#002F52'};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 12px;
  transition: all 0.2s;
  min-width: 120px;
  
  &:hover { 
    background: ${props => props.seguindo ? '#c0392b' : '#326589'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StatusSeguindo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #27ae60;
  font-size: 0.85em;
  font-weight: bold;
  
  &::before {
    content: "✓";
    background: #27ae60;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7em;
  }
`;

const InfoUsuario = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EstatisticasContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  
  .titulo {
    font-size: 1.1em;
    font-weight: bold;
    color: #002F52;
  }
  
  .stats {
    display: flex;
    gap: 24px;
    
    .stat {
      text-align: center;
      
      .numero {
        font-size: 1.2em;
        font-weight: bold;
        color: #27ae60;
      }
      
      .label {
        font-size: 0.85em;
        color: #666;
      }
    }
  }
`;

const FiltrosContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const BotaoFiltro = styled.button`
  background: ${props => props.ativo ? '#002F52' : 'transparent'};
  color: ${props => props.ativo ? '#fff' : '#002F52'};
  border: 2px solid #002F52;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.ativo ? '#326589' : '#f0f8ff'};
  }
`;

function ListaUsuarios({ usuario, onSeguirOuDeixar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [processando, setProcessando] = useState(null); // ID do usuário sendo processado
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos', 'seguindo', 'nao-seguindo'

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
    setProcessando(emailAlvo);
    
    try {
      let response;
      if (seguindo) {
        response = await axios.post('http://localhost:8000/usuarios/deixar-de-seguir', { email: usuario.email, seguirEmail: emailAlvo });
      } else {
        response = await axios.post('http://localhost:8000/usuarios/seguir', { email: usuario.email, seguirEmail: emailAlvo });
      }
      
      // Atualiza o localStorage com os dados retornados do backend
      if (response.data.usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(response.data.usuario));
      }
      
      if (onSeguirOuDeixar) onSeguirOuDeixar();
    } catch (err) {
      console.error('Erro ao seguir/deixar de seguir:', err);
      setErro('Erro ao atualizar seguidores.');
    } finally {
      setProcessando(null);
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
    })
    .filter(u => {
      const seguindo = (usuario.seguidos || []).includes(u.email);
      if (filtroStatus === 'seguindo') return seguindo;
      if (filtroStatus === 'nao-seguindo') return !seguindo;
      return true; // 'todos'
    });

  const totalSeguindo = (usuario.seguidos || []).length;
  const usuariosSeguindo = usuariosFiltrados.filter(u => (usuario.seguidos || []).includes(u.email));

  return (
    <ListaContainer>
      <EstatisticasContainer>
        <div className="titulo">Usuários</div>
        <div className="stats">
          <div className="stat">
            <div className="numero">{totalSeguindo}</div>
            <div className="label">Seguindo</div>
          </div>
          <div className="stat">
            <div className="numero">{usuariosFiltrados.length}</div>
            <div className="label">Total</div>
          </div>
        </div>
      </EstatisticasContainer>
      
      <FiltrosContainer>
        <BotaoFiltro 
          ativo={filtroStatus === 'todos'}
          onClick={() => setFiltroStatus('todos')}
        >
          Todos
        </BotaoFiltro>
        <BotaoFiltro 
          ativo={filtroStatus === 'seguindo'}
          onClick={() => setFiltroStatus('seguindo')}
        >
          Seguindo
        </BotaoFiltro>
        <BotaoFiltro 
          ativo={filtroStatus === 'nao-seguindo'}
          onClick={() => setFiltroStatus('nao-seguindo')}
        >
          Não seguindo
        </BotaoFiltro>
      </FiltrosContainer>
      
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
            const estaProcessando = processando === u.email;
            
            return (
              <UsuarioItem key={u.email}>
                <InfoUsuario>
                  <Nome>{u.nome} <span style={{color:'#888', fontWeight:'normal', fontSize:'0.95em'}}>({u.email})</span></Nome>
                  {seguindo && <StatusSeguindo>Seguindo</StatusSeguindo>}
                </InfoUsuario>
                <BotaoSeguir 
                  seguindo={seguindo}
                  disabled={estaProcessando}
                  onClick={() => handleSeguir(u.email, seguindo)}
                  style={{
                    opacity: estaProcessando ? 0.7 : 1,
                    cursor: estaProcessando ? 'not-allowed' : 'pointer'
                  }}
                >
                  {estaProcessando ? 'Processando...' : (seguindo ? 'Deixar de seguir' : 'Seguir')}
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
