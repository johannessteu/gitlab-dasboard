import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${props => props.theme.colors.light};
`;

class LoadingScreen extends PureComponent {
  render() {
    return (
      <Wrapper>
        <FontAwesomeIcon icon="cog" transform="grow-16" spin />
      </Wrapper>
    );
  }
}

export default LoadingScreen;
