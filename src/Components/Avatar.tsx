import React, { PureComponent } from 'react';
import PropTypes, { number } from 'prop-types';

import styled from 'styled-components';

interface StyledAvatarProps {
  height: string;
  width: string;
}

const StyledAvatar = styled.img`
  border-radius: 50%;
  min-width: ${(props: StyledAvatarProps) => props.width};
`;

interface AvatarProps extends StyledAvatarProps {
  url: string;
}

const Avatar = ({ url, height, width }: AvatarProps) => {
  return <StyledAvatar src={url} width={width} height={height} />;
};

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
