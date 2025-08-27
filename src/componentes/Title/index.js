import styled from 'styled-components';

export const Title = styled.h2`
  justify-content: center;
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
  margin-top: 20px;
  color: ${props => props.cor || '#000'};
`;