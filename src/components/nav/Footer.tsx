import { AppBarProps, Grid, Slide, ToolbarProps, Typography, useScrollTrigger } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import styled from 'styled-components';
import { ContentContainer } from '../structure/ContentContainer';
import { useCommonsTranslations } from '../../translations/translationsHooks';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../../constants';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../../store/storeHooks';

const StyledAppBar = styled(AppBar)<AppBarProps>({
  // paddingTop: '1em',
  // paddingBottom: '1em',
  borderTop: '2px solid #363636',
  bottom: 0,
  top: 'auto',
});

const StyledToolBar = styled(Toolbar)<ToolbarProps>({});

const HideOnScroll = React.memo((props) => {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction='up' in={trigger}>
      {children as any}
    </Slide>
  );
});

export const Footer = observer(() => {
  const cryptoWalletConnectionStore = useCryptoWalletIntegrationStore();
  const commonsTranslations = useCommonsTranslations();

  return (
    <>
      {/* DEV_NOTE : Second 'Toolbar' is a trick offered by MUI to keep the content properly below the fixed AppBar */}
      {/* DEV_NOTE : We should add any 'bottom padding/margin' of the 'StyledAppBar' to the value we want to have from the page content*/}
      <Toolbar style={{ marginTop: '2.5em' }} />
      <HideOnScroll>
        <StyledAppBar position='fixed'>
          <ContentContainer>
            <StyledToolBar disableGutters>
              <Grid container direction={'row'} alignItems={'flex-start'} spacing={1}>
                <Grid item>
                  <a
                    href={PRIVACY_POLICY_URL}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    style={{ color: 'inherit' }}
                  >
                    <Typography variant={'subtitle2'}>{commonsTranslations('privacyPolicy')}</Typography>
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href={TERMS_OF_SERVICE_URL}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    style={{ color: 'inherit' }}
                  >
                    <Typography variant={'subtitle2'}>{commonsTranslations('termsOfUse')}</Typography>
                  </a>
                </Grid>
                <Grid item>
                  <a
                    href={'https://staking-v1.orbs.network'}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    style={{ color: 'inherit' }}
                  >
                    <Typography variant={'subtitle2'}>{commonsTranslations('tetraV1ChangeV1Delegation')}</Typography>
                  </a>
                </Grid>

                <Grid item>
                  <a
                    href={`https://orbs-network.github.io/voting/reward?address=${cryptoWalletConnectionStore.mainAddress}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    style={{ color: 'inherit' }}
                  >
                    <Typography variant={'subtitle2'}>{commonsTranslations('v1HistoricRewards')}</Typography>
                  </a>
                </Grid>
              </Grid>
            </StyledToolBar>
          </ContentContainer>
        </StyledAppBar>
      </HideOnScroll>
    </>
  );
});
