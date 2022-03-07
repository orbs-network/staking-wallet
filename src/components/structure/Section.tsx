import Grid, { GridProps } from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const StyledGrid = styled(Grid)({
  marginBottom: '3em',

  // DEV_NOTE : These are to negate the 'spacing' sideways margin
  marginRight: 0,
  marginLeft: 0,
  width: '100%',
  maxWidth: '100%',
});

export const Section: React.FC<GridProps> = ({ children, ...otherProps }) => {
  return (
    <StyledGrid item container direction={'column'} {...otherProps}>
      {children}
    </StyledGrid>
  );
};
