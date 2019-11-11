import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useOrbsPOSDataService } from '../services/ServicesHooks';
import { IGuardianInfo } from 'orbs-pos-data/dist/orbs-pos-data-service';
import { GuardiansTable } from './GuardiansTable';

export const Guardians: React.FunctionComponent = () => {
  const orbsPOSDataService = useOrbsPOSDataService();
  const [guardiansAddressList, setGuardiansAddressList] = React.useState<string[]>([]);
  const [guardiansList, setGuardiansList] = React.useState<IGuardianInfo[]>([]);

  React.useEffect(() => {
    const fetch = async () => {
      const list = await orbsPOSDataService.getGuardiansList(0, 100);
      setGuardiansAddressList(list);
    };
    fetch();
  }, [orbsPOSDataService]);

  React.useEffect(() => {
    const fetch = async () => {
      const promises = guardiansAddressList.map(guardianAddress => orbsPOSDataService.getGuardianInfo(guardianAddress));
      setGuardiansList(await Promise.all(promises));
    };
    fetch();
  }, [guardiansAddressList]);

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Guardians' />
        <CardContent>
          <Typography>Guardians List</Typography>
          {guardiansList.length === 0 ? (
            <Typography>Loading...</Typography>
          ) : (
            <GuardiansTable guardians={guardiansList} />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
