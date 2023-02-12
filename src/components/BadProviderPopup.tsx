import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAlertsTranslations } from '../translations/translationsHooks';
import { CommonDialog } from '../components/modal/CommonDialog';
import { CommonActionButton } from '../components/base/CommonActionButton';
import { useOrbsAccountStore } from '../store/storeHooks';
import { observer } from 'mobx-react';

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
    fontSize: '20px',
    '& *': {
      color: 'white',
    },
  },
}));

const BadProviderPopup = observer(() => {
  const classes = useStyles();
  const translation = useAlertsTranslations();
  const store = useOrbsAccountStore();

  return (
    <CommonDialog open={store.isProviderError}>
      <Box className={classes.root}>
        <Typography style={{ marginBottom: 20, fontSize: 20, fontWeight: 500 }}>
          {translation('providerErrorTitle')}
        </Typography>
        <Typography>{translation('providerErrorBody')}</Typography>
        <CommonActionButton style={{ marginTop: '40px' }} onClick={() => window.location.reload()}>
          {translation('reload')}
        </CommonActionButton>
      </Box>
    </CommonDialog>
  );
});

export default BadProviderPopup;
