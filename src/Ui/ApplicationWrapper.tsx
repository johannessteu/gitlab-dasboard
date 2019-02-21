import styled from 'styled-components';

const ApplicationWrapper = styled.div`
  background-color: ${props => props.theme.colors.light};
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  height: 100vh;
  font-family: 'Verdana';
  font-size: 16px;
`;

export default ApplicationWrapper;
