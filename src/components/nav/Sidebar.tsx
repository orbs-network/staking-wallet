import { Drawer, List } from '@material-ui/core';
import React, { useMemo } from 'react';
import { DrawerLinkItem } from './DrawerLinkItem';
import { HeaderSpacer } from './HeaderSpacer';
import styled from 'styled-components';

const Root = styled.div`
  height: 100%;
`;

export interface ISidebarProps {
  isConnectedToWallet: boolean;
}

export const Sidebar = React.memo<ISidebarProps>(props => {
  const { isConnectedToWallet } = props;

  const linkForCryptoWallet = useMemo(() => {
    if (isConnectedToWallet) {
      return <DrawerLinkItem data-testid={'menuLink-myWallet'} to='/' text='My Wallet' />;
    } else {
      return <DrawerLinkItem data-testid={'menuLink-connectWallet'} to='/' text='Connect Wallet' />;
    }
  }, [isConnectedToWallet]);

  return (
    <Root>
      <HeaderSpacer />
      <List>
        {linkForCryptoWallet}
        <DrawerLinkItem data-testid={'menuLink-guardians'} to='/guardians' text='Guardians' />
        <DrawerLinkItem to='/faq' text='F.A.Q' />
      </List>
    </Root>
  );
});
