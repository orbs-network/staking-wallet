import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { LinkButton } from './LinkButton';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import { useMemo } from 'react';
import { observer } from 'mobx-react';

export const Header = observer(() => {
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  const linkForCryptoWallet = useMemo(() => {
    if (cryptoWalletIntegrationStore.isConnectedToWallet) {
      return (
        <>
          <LinkButton data-testid={'menuLink-myWallet'} color='primary' to='/my-wallet'>
            My Wallet
          </LinkButton>

          <LinkButton data-testid={'menuLink-stakeOrbs'} color='primary' to='/my-wallet'>
            Stake ORBS
          </LinkButton>
        </>
      );
    } else {
      return (
        <LinkButton data-testid={'menuLink-connectWallet'} color='primary' to='/connect-wallet'>
          Connect Wallet
        </LinkButton>
      );
    }
  }, [cryptoWalletIntegrationStore.isConnectedToWallet]);

  return (
    <AppBar position='static' color='default'>
      <Toolbar>
        <LinkButton data-testid={'menuLink-home'} color='primary' to='/'>
          Home
        </LinkButton>
        <LinkButton data-testid={'menuLink-guardians'} color='primary' to='/guardians'>
          Guardians
        </LinkButton>
        <LinkButton data-testid={'menuLink-about'} color='primary' to='/about'>
          About
        </LinkButton>
        {linkForCryptoWallet}
      </Toolbar>
    </AppBar>
  );
});
