import { Box, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CommonDialog } from '../../components/modal/CommonDialog';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { getChainConfig } from '../../utils';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { useConnectWalletSectionTranslations } from '../../translations/translationsHooks';
import config from '../../../config';
import { NETWORK_QUERY_PARAM } from '../../constants';

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
  text: {
    fontSize:'20px',
    "& *": {
      color:'white'
    }
  }
}));

interface Props {
  chainId: number;
  open: boolean;
  onClose: () => void;
  userChainId: number;
}

const getUserConnectedChainConfig = (chain: number) => {
  return config.networks[chain];
};

function WrongNetworkPopup({ chainId, open, onClose, userChainId }: Props) {
  const classes = useStyles();
  const [chainName, setChainName] = useState('');
  const translation = useConnectWalletSectionTranslations();

  useEffect(() => {
    const chainConfig = getChainConfig(chainId);
    setChainName(chainConfig.name);
  }, [chainId]);

  const userConnectedChainConfig = useMemo(() => getUserConnectedChainConfig(userChainId), [userChainId]);

  return (
    <CommonDialog open={open} onClose={onClose}>
      <Box className={classes.root}>
        <Typography style={{ fontSize: 22, marginBottom: 10 }}>{translation('wrongChain')}</Typography>
        <LinkOffIcon style={{ fontSize: 50, marginBottom: 10 }} />
        <Typography style={{ fontSize: 20 }}>{translation('pleaseChangeChain', { chainName })} </Typography>

        {userConnectedChainConfig && (
          <Typography
            
            className={classes.text}
            dangerouslySetInnerHTML={{
              __html: translation('swicthToDifferentChain', {
                chainName: userConnectedChainConfig.name,
                url: window.location.pathname + '?' + `${NETWORK_QUERY_PARAM}=${userChainId}`,
              }),
            }}
          ></Typography>
        )}

        <CommonActionButton style={{ marginTop: '40px' }} onClick={onClose}>
          Close
        </CommonActionButton>
      </Box>
    </CommonDialog>
  );
}

export default WrongNetworkPopup;
