import styled from "styled-components";

const InputEstilizado = styled.input`
  padding: 14px 18px;
  border-radius: 8px;
  border: 1.5px solid #326589;
  font-size: 1.1em;
  width: 100%;
  max-width: 400px;
  color: #002f52;
  background: #f7f9fb;
  margin-bottom: 2px;
  transition: border 0.2s;

  &::placeholder {
    color: #326589; // azul médio, visível no fundo claro
    opacity: 1;
    font-style: italic;
  }

  &:focus {
    border: 2px solid #002f52;
    outline: none;
    background: #fff;
  }
`;

function Input(props) {
  return <InputEstilizado {...props} />;
}

export default Input;
