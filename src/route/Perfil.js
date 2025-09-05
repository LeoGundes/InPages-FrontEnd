import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getSeguidores, getSeguidos, deixarDeSeguirUsuario } from '../services/seguidores';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #002F52 40%, #326589 100%);
  padding: 20px;
`;

const PerfilContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.12);
  width: 100%;
  max-width: 800px;
  overflow: hidden;
`;

const Tab = styled.button`
  background: ${props => props.active ? '#002F52' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#002F52'};
  border: none;
  padding: 16px 24px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#002F52' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  padding: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const Title = styled.h2`
  color: #002F52;
  margin-bottom: 8px;
  font-size: 2em;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
`;

const SubTitle = styled.h3`
  color: #002F52;
  margin-bottom: 16px;
  font-size: 1.5em;
  text-align: center;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  width: 100%;
  max-width: 340px;
  font-size: 1em;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #002F52;
    outline: none;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #002F52 60%, #326589 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #326589 60%, #002F52 100%);
  }
`;

const SairButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
  transition: background 0.2s;
  &:hover {
    background: #c0392b;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const PerfilHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const Text = styled.p`
  text-align: center;
  margin-top: 12px;
  font-size: 1em;
`;

const ListaUsuarios = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

const UsuarioCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
  
  .usuario-info {
    flex: 1;
    
    .nome {
      font-weight: bold;
      color: #002F52;
      margin-bottom: 4px;
    }
    
    .email {
      color: #666;
      font-size: 0.9em;
    }
  }
`;

const BotaoAcao = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background 0.2s;
  
  &:hover {
    background: #c82333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  
  .icon {
    font-size: 3em;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
  
  .stat {
    text-align: center;
    
    .number {
      font-size: 2em;
      font-weight: bold;
      color: #002F52;
    }
    
    .label {
      color: #666;
      font-size: 0.9em;
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 24px;
`;

function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [carregandoSeguidores, setCarregandoSeguidores] = useState(false);
  const [carregandoSeguidos, setCarregandoSeguidos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, []);

  useEffect(() => {
    if (abaAtiva === 'seguidores' && email) {
      carregarSeguidores();
    } else if (abaAtiva === 'seguidos' && email) {
      carregarSeguidos();
    }
  }, [abaAtiva, email]);

  async function carregarSeguidores() {
    try {
      setCarregandoSeguidores(true);
      const dados = await getSeguidores(email);
      setSeguidores(dados);
    } catch (error) {
      console.error('Erro ao carregar seguidores:', error);
    } finally {
      setCarregandoSeguidores(false);
    }
  }

  async function carregarSeguidos() {
    try {
      setCarregandoSeguidos(true);
      const dados = await getSeguidos(email);
      setSeguidos(dados);
    } catch (error) {
      console.error('Erro ao carregar seguidos:', error);
    } finally {
      setCarregandoSeguidos(false);
    }
  }

  async function handleDeixarDeSeguir(emailUsuario) {
    try {
      await deixarDeSeguirUsuario(email, emailUsuario);
      setSeguidos(seguidos.filter(u => u.email !== emailUsuario));
    } catch (error) {
      console.error('Erro ao deixar de seguir:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('usuarioLogado', JSON.stringify({ nome, email }));
    setMensagem('Perfil atualizado com sucesso!');
  }

  function handleSair() {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  }

  function renderConteudoAba() {
    switch (abaAtiva) {
      case 'perfil':
        return (
          <div>
            <PerfilHeader>
              <h3 style={{ margin: 0, color: '#002F52' }}>Dados do Perfil</h3>
            </PerfilHeader>
            
            <FormContainer>
              <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <Input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled
                />
                <ButtonContainer>
                  <Button type="submit">Salvar</Button>
                  <SairButton type="button" onClick={handleSair}>
                    Sair
                  </SairButton>
                </ButtonContainer>
                {mensagem && <Text>{mensagem}</Text>}
              </form>
            </FormContainer>
          </div>
        );

      case 'seguidores':
        return (
          <div>
            <StatsContainer>
              <div className="stat">
                <div className="number">{seguidores.length}</div>
                <div className="label">Seguidores</div>
              </div>
            </StatsContainer>
            
            {carregandoSeguidores ? (
              <Text>Carregando seguidores...</Text>
            ) : seguidores.length === 0 ? (
              <EmptyState>
                <div className="icon">👥</div>
                <div>Você ainda não tem seguidores</div>
              </EmptyState>
            ) : (
              <ListaUsuarios>
                {seguidores.map(seguidor => (
                  <UsuarioCard key={seguidor.email}>
                    <div className="usuario-info">
                      <div className="nome">{seguidor.nome}</div>
                      <div className="email">{seguidor.email}</div>
                    </div>
                  </UsuarioCard>
                ))}
              </ListaUsuarios>
            )}
          </div>
        );

      case 'seguidos':
        return (
          <div>
            <StatsContainer>
              <div className="stat">
                <div className="number">{seguidos.length}</div>
                <div className="label">Seguindo</div>
              </div>
            </StatsContainer>
            
            {carregandoSeguidos ? (
              <Text>Carregando seguidos...</Text>
            ) : seguidos.length === 0 ? (
              <EmptyState>
                <div className="icon">👤</div>
                <div>Você ainda não segue ninguém</div>
              </EmptyState>
            ) : (
              <ListaUsuarios>
                {seguidos.map(seguido => (
                  <UsuarioCard key={seguido.email}>
                    <div className="usuario-info">
                      <div className="nome">{seguido.nome}</div>
                      <div className="email">{seguido.email}</div>
                    </div>
                    <BotaoAcao 
                      onClick={() => handleDeixarDeSeguir(seguido.email)}
                    >
                      Deixar de seguir
                    </BotaoAcao>
                  </UsuarioCard>
                ))}
              </ListaUsuarios>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <Container>
      <PerfilContainer>
        <Title>Meu Perfil</Title>
        
        <TabsContainer>
          <Tab 
            active={abaAtiva === 'perfil'} 
            onClick={() => setAbaAtiva('perfil')}
          >
            Perfil
          </Tab>
          <Tab 
            active={abaAtiva === 'seguidores'} 
            onClick={() => setAbaAtiva('seguidores')}
          >
            Seguidores
          </Tab>
          <Tab 
            active={abaAtiva === 'seguidos'} 
            onClick={() => setAbaAtiva('seguidos')}
          >
            Seguindo
          </Tab>
        </TabsContainer>

        <TabContent>
          {renderConteudoAba()}
        </TabContent>
      </PerfilContainer>
    </Container>
  );
}

export default Perfil;