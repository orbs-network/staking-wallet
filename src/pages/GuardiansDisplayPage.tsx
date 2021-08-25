import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { GuardiansSection } from '../sections/guardians/GuardiansSection';

export const GuardianDisplayPage = observer(() => {
  return (
    <Grid container item direction={'column'} id={'guardianDisplayPage'}>
      <GuardiansSection />
    </Grid>
  );
});
