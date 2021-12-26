import { AppBarProps, Grid, ToolbarProps, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useContext } from 'react';
import { LanguagesSelector } from './LanguagesSelector';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import { ReactComponent as OrbsLogoAndIconSvg } from '../../../assets/logos/orbs_logo_with_icon.svg';
import { ReactComponent as TetraLogoAndIconSvg } from '../../../assets/logos/tetra_logo_with_icon.svg';
import NetworkIndicator from '../NetworkIndicator';
import { MobXProviderContext } from 'mobx-react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { IExtenedTheme } from '../../theme/Theme';

const StyledAppBar = styled(AppBar)<AppBarProps>({
  paddingTop: '1em',
  paddingBottom: '0.5em',
  borderBottom: '2px solid #363636',
});

const StyledToolBar = styled(Toolbar)<ToolbarProps>({});

const useStyes = makeStyles((theme: IExtenedTheme) => ({
  logoContainer: {
    filter: theme.custom?.filter,
  },
  logo: {
    [theme.breakpoints.down('sm')]: {
      zoom: 0.5,
    },
  },
}));

export const Header = () => {
  const { chainId } = useContext(MobXProviderContext);
  const classes = useStyes();
  return (
    <>
      <StyledAppBar position='fixed'>
        <ContentContainer>
          <StyledToolBar disableGutters>
            <Grid container direction={'row'} alignItems={'center'} justify={'space-between'}>
              <Grid item className={classes.logoContainer}>
                <TetraLogoAndIconSvg className={classes.logo} />
              </Grid>
              <Grid item style={{ marginLeft: 'auto', marginRight: 30 }}>
                <NetworkIndicator chainId={chainId} />
              </Grid>

              <Grid item>
                <LanguagesSelector />
              </Grid>
            </Grid>
          </StyledToolBar>
        </ContentContainer>
      </StyledAppBar>
      {/* DEV_NOTE : Second 'Toolbar' is a trick offered by MUI to keep the content properly below the fixed AppBar */}
      {/* DEV_NOTE : We should add any 'bottom padding/margin' of the 'StyledAppBar' to the value we want to have from the page content*/}
      <Toolbar style={{ marginBottom: '2.5em' }} />
    </>
  );
};
