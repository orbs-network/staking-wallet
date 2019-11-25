import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useMemo } from 'react';
import { LinkButton } from './LinkButton';

export interface IHeaderProps {
  isConnectedToWallet: boolean;
}

export const Header = React.memo<IHeaderProps>(props => {
  const { isConnectedToWallet } = props;

  const linkForCryptoWallet = useMemo(() => {
    if (isConnectedToWallet) {
      return (
        <>
          <LinkButton data-testid={'menuLink-myWallet'} color='primary' to='/wallet'>
            My Wallet
          </LinkButton>

          <LinkButton data-testid={'menuLink-stakeOrbs'} color='primary' to='/stake'>
            Stake ORBS
          </LinkButton>
        </>
      );
    } else {
      return (
        <LinkButton data-testid={'menuLink-connectWallet'} color='primary' to='/wallet'>
          Connect Wallet
        </LinkButton>
      );
    }
  }, [isConnectedToWallet]);

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
