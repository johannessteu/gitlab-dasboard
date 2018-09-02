import styled from 'styled-components';

const Card = styled.div`
  margin: 10px;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.white};
  width: 30%;
`;

export default Card;
