import { Box, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CommonDialog } from '../../components/modal/CommonDialog';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { MobXProviderContext } from 'mobx-react';
import { getChainConfig } from '../../utils';
import { useAppContext } from '../../context/app-context';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { useConnectWalletSectionTranslations } from '../../translations/translationsHooks';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    textAlign: 'center',
  },
}));

function WrongNetworkPopup() {
  const { showWrongNetworkPoup, setShowWrongNetworkPopup } = useAppContext();
  const classes = useStyles();
  const { chainId } = useContext(MobXProviderContext);
  const [chainName, setChainName] = useState('');
  const translation = useConnectWalletSectionTranslations();

  useEffect(() => {
    const chainConfig = getChainConfig(chainId);
    setChainName(chainConfig.name);
  }, [chainId]);

  const onClose = () => {
    setShowWrongNetworkPopup(false);
  };

  return (
    <CommonDialog open={showWrongNetworkPoup} onClose={onClose}>
      <Box className={classes.root}>
        <Typography style={{ fontSize: 22, marginBottom: 10 }}>{translation('wrongChain')}</Typography>
        <LinkOffIcon style={{ fontSize: 50, marginBottom: 10 }} />
        <Typography style={{ fontSize: 20 }}>{translation('pleaseChangeChain', { chainName })} </Typography>
        <CommonActionButton onClick={onClose} style={{ marginTop: 40 }}>
          Close
        </CommonActionButton>
      </Box>
    </CommonDialog>
  );
}

export default WrongNetworkPopup;
