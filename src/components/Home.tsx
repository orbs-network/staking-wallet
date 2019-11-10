import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export const Home: React.FunctionComponent = () => (
  <Grid item xs={12}>
    <Card>
      <CardHeader title='HOME' />
      <CardContent>
        <Typography variant='h4'>
          This is The ORBS Staking Wallet.
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);
