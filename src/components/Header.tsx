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
          <LinkButton data-testid={'menuLink-myWallet'} color='primary' to='/'>
            My Wallet
          </LinkButton>

          <LinkButton data-testid={'menuLink-stakeOrbs'} color='primary' to='/stake'>
            Stake ORBS
          </LinkButton>
        </>
      );
    } else {
      return (
        <LinkButton data-testid={'menuLink-connectWallet'} color='primary' to='/'>
          Connect Wallet
        </LinkButton>
      );
    }
  }, [isConnectedToWallet]);

  return (
    <AppBar position='static' color='default'>
      <Toolbar>
        {linkForCryptoWallet}
        <LinkButton data-testid={'menuLink-guardians'} color='primary' to='/guardians'>
          Guardians
        </LinkButton>
      </Toolbar>
    </AppBar>
  );
});
