import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledGrid = styled(Grid)({
  marginTop: '1em',
  marginBottom: '1em',
});

export const Section: React.FC = props => {
  const { children } = props;

  return (
    <StyledGrid item>
      {children}
    </StyledGrid>
  );
};
