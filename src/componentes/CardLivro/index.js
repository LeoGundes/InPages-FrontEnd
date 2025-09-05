import styled from 'styled-components'
import { media } from '../../styles/breakpoints';

const Card = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 12px;
    background-color: #fff;
    width: 250px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    img {
        max-width: 100%;
        border-radius: 4px;
    }

    h3 {
        font-size: 18px;
        margin: 8px 0;
    }

    p {
        font-size: 14px;
        color: #666;
    }

    a {
        display: inline-block;
        margin-top: 8px;
        color: #007bff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
    
    ${media.tablet} {
        width: 220px;
        padding: 10px;
    }
    
    ${media.mobile} {
        width: 100%;
        max-width: 280px;
        padding: 16px;
        
        &:hover {
            transform: translateY(-2px);
        }
    }
`;

const Titulo = styled.h3`
    font-size: 18px;
    margin: 8px 0;
    color: ${props => props.cor || 'black'};
`;

const Botao = styled.button`
    display: flex;
    align-items: flex-start;
    margin-left: 75px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: darken(#007bff, 10%);
    }
    
    ${media.tablet} {
        margin-left: 50px;
        padding: 8px 10px;
        font-size: 0.9em;
    }
    
    ${media.mobile} {
        margin-left: auto;
        margin-right: auto;
        padding: 12px 16px;
        font-size: 1em;
        justify-content: center;
    }
`;

const Descricao = styled.p`
color: #002F52;
    font-size: 14px;
    color: #666;
`;

const Subtitulo = styled.h4`
color: #002F52;
    font-size: 16px;
    margin: 8px 0;
`;

const ImgLivro = styled.img`
    max-width: 100%;
    border-radius: 4px;
`;

function CardLivro({titulo, subtitulo, descricao, img}) {
    return (
        <Card>
            <div>
            <Titulo cor='#FE9900'>{titulo}</Titulo>
            <Subtitulo>{subtitulo}</Subtitulo>
            <Descricao>{descricao}</Descricao>
            </div>
            <div>
            <ImgLivro src={img} />
            <Botao>Adquira Aqui</Botao>
            </div>
        </Card>
    );
}

export default CardLivro;