import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import React from 'react';
import { GuardiansTable } from './GuardiansTable';
import { useGuardiansStore } from '../store/storeHooks';
import { observer } from 'mobx-react';

export const Guardians = observer(() => {
  const guardiansStore = useGuardiansStore();

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Guardians' />
        <CardContent>
          <Typography>Guardians List</Typography>

          {guardiansStore.guardiansList.length === 0 ? (
            <Typography>Loading...</Typography>
          ) : (
            <GuardiansTable guardians={guardiansStore.guardiansList} />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
});
