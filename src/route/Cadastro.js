import styled from 'styled-components';
import React, { useState } from 'react';
import { cadastrarUsuario } from '../services/usuarios';
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

const LinkLogin = styled.a`
  color: #002F52;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
  &:hover {
    color: #326589;
    text-decoration: underline;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 12px;
  font-size: 1em;
`;

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await cadastrarUsuario({ nome, email, senha });
      setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      setMensagem(error.response?.data || 'Erro ao cadastrar');
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Cadastro</Title>
        <Input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <Button type="submit">Cadastrar</Button>
        {mensagem && <Text>{mensagem}</Text>}
        <Text>
          Já tem conta? <LinkLogin href="/login">Faça login</LinkLogin>
        </Text>
      </Form>
    </Container>
  );
}

export default Cadastro;