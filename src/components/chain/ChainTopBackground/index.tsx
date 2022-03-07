import React, { useContext, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { MobXProviderContext } from 'mobx-react';
import { getChainConfig } from '../../../utils/index';
import { AppBarProps, Box, Grid, ToolbarProps, Typography } from '@material-ui/core';
import { ContentContainer } from '../../structure/ContentContainer';

const useStyes = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
    // pointerEvents: 'none',
    zIndex: -1,
    background: 'yellow',
    [theme.breakpoints.down('xs')]: {
      display:'none'
      }
  },
  chainLogo: {
    position: 'absolute',
    height: '80px',
  },
  networkEllipsis: {
    position: 'absolute',
    right: -140,
    top: -140,
    zoom: 1.4,
  },
}));

function ChainTopBackground() {
  const { chainId } = useContext(MobXProviderContext);
  const classes = useStyes();
  const chainConfig = useMemo(() => getChainConfig(chainId), [chainId]);
  const navbarConfig = chainConfig.ui.navbar;
  const ChainLogo = navbarConfig.chainLogo;
  return (
    <ContentContainer style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%)'}}>
      <Box className={classes.container}>
        <ChainLogo style={{ right: 20, top: -20 }} className={classes.chainLogo} />
        <ChainLogo style={{ right: 160, top: 70 }} className={classes.chainLogo} />
        <ChainLogo style={{ right: 300, top: 0 }} className={classes.chainLogo} />
        <ChainLogo style={{ right: 380, top: 80 }} className={classes.chainLogo} />
        <img src={navbarConfig.ellipsis} className={classes.networkEllipsis} />
      </Box>
    </ContentContainer>
  );
}

export default ChainTopBackground;
