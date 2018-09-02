import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const StyledAvatar = styled.img`
  border-radius: 50%;
  min-width: ${props => props.width};
`;

class Avatar extends PureComponent {
  render() {
    const { url, width, height } = this.props;

    return <StyledAvatar src={url} width={width} height={height} />;
  }
}

Avatar.propTypes = {
  url: PropTypes.string.isRequired,
  height: PropTypes.string,
  width: PropTypes.string
};

Avatar.defaultProps = {
  height: '50px',
  width: '50px'
};

export default Avatar;
