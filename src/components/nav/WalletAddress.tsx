import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import CustomSnackbar from '../snackbar/custom-snackbar';
import copy from 'copy-to-clipboard';
import useWeb3 from '../../hooks/useWeb3';
import { useAlertsTranslations, useWalletInfoSectionTranslations } from '../../translations/translationsHooks';

const StyledButton = styled(Button)(({ theme }) => ({
  border: '0.5px solid rgba(63, 224, 186, 0.35)',
  borderRadius: 3,
  background: 'rgba(12, 30, 34, 0.55)',
  color: theme.palette.secondary.main,
  width: '100%',
  height: 35,
  paddingLeft: 12,
  paddingRight: 8,
  display: 'flex',
  alignItems: 'center',
  textTransform: 'none',

  '&:hover': {
    background: 'rgba(18, 45, 51, 0.85)',
  },
}));

const useStyles = makeStyles((theme: any) => ({
  address: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    textTransform: 'none',
    color: theme.palette.secondary.main,
  },
  menuPaper: {
    marginTop: 7,
    minWidth: 176,
    borderRadius: 3,
    border: '1px solid rgba(63, 224, 186, 0.18)',
    background: '#152329',
    color: '#d7e3e5',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.32)',
  },
  menuItem: {
    height: 40,
    fontSize: 13,
    color: theme.palette.secondary.main,
  },
  disconnectItem: {
    height: 40,
    fontSize: 13,
    color: '#ff6262',
  },
  menuIcon: {
    minWidth: 28,
    color: 'inherit',
  },
}));

interface IProps {
  address?: string;
}

function shortenAddress(address?: string) {
  if (!address || address.length < 13) {
    return address || '';
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletAddress({ address }: IProps) {
  const classes = useStyles();
  const alertsTranslations = useAlertsTranslations();
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();
  const { disconnect } = useWeb3();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const closeMenu = () => setAnchorEl(null);

  const copyAddress = () => {
    copy(address);
    setShowSnackbar(true);
    closeMenu();
  };

  const handleDisconnect = async () => {
    closeMenu();
    await disconnect();
  };

  return (
    <>
      <StyledButton onClick={(event) => setAnchorEl(event.currentTarget)} endIcon={<KeyboardArrowDownIcon />}>
        <Typography className={classes.address}>{shortenAddress(address)}</Typography>
      </StyledButton>

      <Menu
        anchorEl={anchorEl}
        disableScrollLock
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        classes={{ paper: classes.menuPaper }}
      >
        <MenuItem className={classes.menuItem} onClick={copyAddress}>
          <ListItemIcon className={classes.menuIcon}>
            <FileCopyOutlinedIcon fontSize='small' />
          </ListItemIcon>
          {walletInfoSectionTranslations('copyAddress')}
        </MenuItem>
        <MenuItem className={classes.disconnectItem} onClick={handleDisconnect}>
          <ListItemIcon className={classes.menuIcon}>
            <ExitToAppIcon fontSize='small' />
          </ListItemIcon>
          {walletInfoSectionTranslations('disconnect')}
        </MenuItem>
      </Menu>

      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
        autoHideDuration={2000}
      />
    </>
  );
}

export default WalletAddress;
