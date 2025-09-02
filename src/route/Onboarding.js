import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoInPages from '../imagens/logo.svg';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #002F52 40%, #326589 100%);
  animation: ${fadeIn} 1s;
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 32px;
  animation: ${fadeIn} 3.0s;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.10));
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05) rotate(-3deg);
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.97);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  padding: 48px 36px 36px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 340px;
  max-width: 90vw;
  animation: ${fadeIn} 3.0s;
`;

const Title = styled.h1`
  color: #002F52;
  font-size: 2.3em;
  margin-bottom: 12px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  color: #326589;
  font-size: 1.18em;
  margin-bottom: 36px;
  text-align: center;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 24px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #002F52 60%, #326589 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 38px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #326589 60%, #002F52 100%);
    transform: translateY(-2px) scale(1.04);
  }
`;

function Onboarding() {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo src={logoInPages} alt="Logo InPages" />
      <Card>
        <Title>Bem-vindo ao InPages!</Title>
        <Subtitle>
          Sua biblioteca digital de livros de tecnologia.<br />
          Faça login ou cadastre-se para começar.
        </Subtitle>
        <ButtonGroup>
          <Button onClick={() => navigate('/login')}>Entrar</Button>
          <Button onClick={() => navigate('/cadastro')}>Cadastrar</Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
}

export default Onboarding;