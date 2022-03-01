import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { ReactComponent as WalletIcon } from '../../../assets/navbar/wallet.svg';
import { HtmlTooltip } from '../base/HtmlTooltip';
import { useAlertsTranslations, useWalletInfoSectionTranslations } from '../../translations/translationsHooks';
import CustomSnackbar from '../snackbar/custom-snackbar';
import copy from 'copy-to-clipboard';

const StyledButton = styled(Button)({
  border: '0.5px solid #FFFFFF',
  borderRadius: 0,
  background: 'transparent',
  width: 137,
  height: 35,
  paddingLeft: 15,
  paddingRight: 10,
  display: 'flex',
  alignItems: 'center',
});

const useStyles = makeStyles({
  icon: {
    width: 20,
  },
  address: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    textTransform: 'none',
  },

  copyText: {
    fontSize: 12,
  },
});

interface IProps {
  address?: string;
}

function WalletAddress({ address }: IProps) {
  const classes = useStyles();
  const alertsTranslations = useAlertsTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const copyAddress = () => {
    copy(address);
    setShowSnackbar(true);
  };
  return (
    <>
      <HtmlTooltip
        style={{ borderRadius: '0px' }}
        title={<Typography className={classes.copyText}>{walletInfoSectionTranslations('copy')}</Typography>}
      >
        <StyledButton onClick={copyAddress} startIcon={<WalletIcon className={classes.icon} />}>
          <Typography className={classes.address}>{address}</Typography>
        </StyledButton>
      </HtmlTooltip>
      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
      />
    </>
  );
}

export default WalletAddress;
