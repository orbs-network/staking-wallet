import { AppBarProps, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import { ReactComponent as OrbsLogoAndIconSvg } from '../../../assets/logos/orbs_logo_with_icon.svg';
import { ReactComponent as TetraLogoAndIconSvg } from '../../../assets/logos/tetra_logo_with_icon.svg';

const StyledAppBar = styled(AppBar)<AppBarProps>({
  borderBottom: '2px solid #363636',
});

const StyledToolBar = styled(Toolbar)<ToolbarProps>({
});

export const Header = () => {
  return (
    <>
      <StyledAppBar position='fixed'>
        <ContentContainer>
          <StyledToolBar disableGutters>
            <Grid container direction={'row'} alignItems={'center'}>
              <Grid item xs={8}>
                <TetraLogoAndIconSvg />
              </Grid>
              <Grid item xs={4}>
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
