import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const SectionHeaderGrid = styled(Grid)({
  marginBottom: '0.5em',
});

interface IProps {
  title: string;
  icon: React.ElementType;
}

export const SectionHeader: React.FC<IProps> = props => {
  const { title, icon: MyIcon } = props;

  return (
    <SectionHeaderGrid container direction={'row'} alignItems={'center'}>
      {/* TODO : O.L : Make this Icon adhere to the page font-size */}
      <MyIcon></MyIcon>
      <Typography variant={'h5'} style={{ marginLeft: '0.5em' }}>
        {title}
      </Typography>
    </SectionHeaderGrid>
  );
};
