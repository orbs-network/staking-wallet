import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const StyledGrid = styled(Grid)({
  marginTop: '1em',
  marginBottom: '1em',
});

export const Section: React.FC = ({ children, ...otherProps }) => {
  return (
    <StyledGrid item {...otherProps}>
      {children}
    </StyledGrid>
  );
};
