import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';


const StyledAppBar = styled(AppBar)({
  borderBottom: '2px solid #363636',
  paddingRight: '10%',
  paddingLeft: '10%',
});

const StyledToolBar = styled(Toolbar)({
  paddingRight: 0,
  paddingLeft: 0,
});

export const Header = () => {
  return (
    <StyledAppBar position='static'>
      <StyledToolBar>
        <Typography>Orbs</Typography>
        <LanguagesSelector />
      </StyledToolBar>
    </StyledAppBar>
  );
};
