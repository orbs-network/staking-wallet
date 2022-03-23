import React, { useEffect } from 'react';
import ODNP from '@open-defi-notification-protocol/widget';
import { Button } from '@material-ui/core';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import { useWalletInfoSectionTranslations } from '../../translations/translationsHooks';
import styled from 'styled-components';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface IProps {
  address?: string;
}

const StyledButton = styled(Button)({
  border: ' 1px solid #545557',
  borderRadius: 0,
  paddingLeft: 20,
  paddingRight: 20,
  textTransform: 'none',
});

const useStyles = makeStyles({
  icon: {
    width: '20px',
    height: '20px',
  },
});

const odnp = new ODNP();

odnp.init();
odnp.hide();
odnp.mainDiv.style.color = 'black';
const NotificationButton = ({ address }: IProps) => {
  const walletInfoSectionTranslations = useWalletInfoSectionTranslations();

  useEffect(() => {
    if (window.innerWidth <= 700) {
      odnp.mainDiv.style.zoom = 0.55;
      odnp.mainDiv.style.width = '90%'
      odnp.mainDiv.style.left = '5%'
    }
  }, []);

  const classes = useStyles();
  return (
    <StyledButton
      onClick={() => odnp.show(address, 'orbs')}
      startIcon={<NotificationsActiveOutlinedIcon className={classes.icon} />}
    >
      {walletInfoSectionTranslations('notifications')}
    </StyledButton>
  );
};

export default NotificationButton;
