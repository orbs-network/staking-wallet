import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface IProps {
  title: string;
  icon: React.ElementType;
}

export const SectionHeader: React.FC<IProps> = props => {
  const { title, icon: MyIcon } = props;

  return (
    <Grid item style={{ display: 'flex', flexDirection: 'row' }}>
      <MyIcon></MyIcon>
      <Typography variant={'h5'} style={{ marginLeft: '0.5em' }}>
        {title}
      </Typography>
    </Grid>
  );
};
