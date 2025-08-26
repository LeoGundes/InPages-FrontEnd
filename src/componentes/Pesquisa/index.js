import Input from '../Input'
import styled from 'styled-components';
import { useState } from 'react';


const PesquisaContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Titulo = styled.h2`
    color: #FFF;
    font-size: 24px;
    margin-bottom: 10px;
`;

const Subtitulo = styled.h3`
    color: #FFF;
    font-size: 18px;
    margin-bottom: 20px;
`;

function Pesquisa() {
    const [textoDigitado, setTextoDigitado] = useState('');

    return(
        <PesquisaContainer>
            <Titulo>Aqui você encontra os melhores livros de programação</Titulo>
            <Subtitulo>Pesquise pelo título, autor ou assunto</Subtitulo>
        <Input 
            placeholder="Seu livro aqui !"
            onBlur={evento => setTextoDigitado(evento.target.value)}
        />
        </PesquisaContainer> 
    )
}

export default Pesquisa;