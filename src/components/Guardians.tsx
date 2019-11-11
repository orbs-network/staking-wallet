import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export const Guardians: React.FunctionComponent = () => (
  <Grid item xs={12}>
    <Card>
      <CardHeader title='Guardians' />
      <CardContent>
        <Typography>Guardians List</Typography>
      </CardContent>
    </Card>
  </Grid>
);
