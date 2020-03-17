import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as OrbsLogoIcon } from '../../../assets/orbs_logo_24.svg';
import Grid from '@material-ui/core/Grid';

const StyledAppBar = styled(AppBar)({
  borderBottom: '2px solid #363636',
});

const StyledToolBar = styled(Toolbar)({
  // DEV_NOTE : Padding 0 keeps the Toolbar aligned with the body (via 'ContentContainer')
  paddingRight: 0,
  paddingLeft: 0,
});

export const Header = () => {
  return (
    <>
      <StyledAppBar position='fixed'>
        <ContentContainer>
          <StyledToolBar>
            <Grid container spacing={2} direction={'row'} alignItems={'center'}>
              <Grid item>
                <SvgIcon component={OrbsLogoIcon} />
              </Grid>
              <Grid item>
                <Typography>ORBS</Typography>
              </Grid>
              <Grid item>
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
