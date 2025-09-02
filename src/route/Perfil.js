import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #002F52 40%, #326589 100%);
`;

const Form = styled.form`
  background: #fff;
  padding: 40px 32px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 340px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.12);
  align-items: center;
`;

const Title = styled.h2`
  color: #002F52;
  margin-bottom: 8px;
  font-size: 2em;
  font-weight: bold;
  letter-spacing: 1px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #b0b0b0;
  width: 100%;
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
  padding: 12px 0;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
  margin-top: 8px;
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
  padding: 10px 24px;
  font-weight: bold;
  font-size: 1em;
  margin-top: 24px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #c0392b;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 12px;
  font-size: 1em;
`;

function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('usuarioLogado', JSON.stringify({ nome, email }));
    setMensagem('Perfil atualizado com sucesso!');
  }

  function handleSair() {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Meu Perfil</Title>
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
        <Button type="submit">Salvar</Button>
        {mensagem && <Text>{mensagem}</Text>}
        <SairButton type="button" onClick={handleSair}>
          Sair
        </SairButton>
      </Form>
    </Container>
  );
}

export default Perfil;