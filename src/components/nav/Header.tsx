import { Container, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)({
  borderBottom: '2px solid #363636',
});

const StyledToolBar = styled(Toolbar)({
  paddingRight: 0,
  paddingLeft: 0,
});

export const Header = () => {
  return (
      <StyledAppBar position='static'>
        <Container maxWidth={'xl'}>
        <StyledToolBar>
          <Typography>ORBS</Typography>
          <LanguagesSelector />
        </StyledToolBar>
        </Container>
      </StyledAppBar>
  );
};
