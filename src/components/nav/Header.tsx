import { AppBarProps, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import { ReactComponent as OrbsLogoAndIconSvg } from '../../../assets/logos/orbs_logo_with_icon.svg';
import { ReactComponent as TetraLogoSvg } from '../../../assets/logos/tetra_logo.svg';
import { ReactComponent as TetraIconSvg } from '../../../assets/logos/tetra_icon.svg';

const StyledAppBar = styled(AppBar)<AppBarProps>({
  borderBottom: '2px solid #363636',
});

const StyledToolBar = styled(Toolbar)<ToolbarProps>({
  // DEV_NOTE : Padding 0 keeps the Toolbar aligned with the body (via 'ContentContainer')
  paddingRight: 0,
  paddingLeft: 0,
});

const HoverableLogoAndIcon = styled(OrbsLogoAndIconSvg)(({ theme }) => ({
  ':hover': {
    opacity: 0.8,
  },
  height: '1.75em',
  [theme.breakpoints.down('md')]: {
    height: '2.0em',
  },
}));

const HoverableTetraLogo = styled(TetraLogoSvg)(({ theme }) => ({
  ':hover': {
    // opacity: 0.8,
  },
  height: '1.75em',
  [theme.breakpoints.down('md')]: {
    height: '2.0em',
  },
}));

const HoverableTetraIcon = styled(TetraIconSvg)(({ theme }) => ({
  ':hover': {
    // opacity: 0.8,
  },
  height: '1.75em',
  [theme.breakpoints.down('md')]: {
    height: '2.0em',
  },
}));

// TODO : C.F.H : Make sure the responsivness of the logo and languages is kept.

export const Header = () => {
  return (
    <>
      <StyledAppBar position='fixed'>
        <ContentContainer>
          <StyledToolBar>
            <Grid container spacing={2} direction={'row'} alignItems={'center'}>
              <Grid item>
                <HoverableTetraIcon />
              </Grid>
              <Grid item>
                <HoverableTetraLogo />
              </Grid>
              <Grid item alignItems={'center'}>
                <LanguagesSelector />
              </Grid>
            </Grid>
          </StyledToolBar>
        </ContentContainer>
      </StyledAppBar>
      {/* DEV_NOTE : Second 'Toolbar' is a trick offered by MUI to keep the content properly below the fixed AppBar */}
      <Toolbar />
    </>
  );
};
