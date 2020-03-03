import Grid, { GridTypeMap } from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const SectionHeaderGrid = styled<typeof Grid>(props => (
  <Grid item container direction={'row'} alignItems={'center'} {...props}></Grid>
))(() => ({
  marginBottom: '0.5em',
}));

const Title = styled(Typography)`
  margin-left: 0.5em;
  text-transform: uppercase;
`;

const SideTitle = styled(Typography)`
  flex: 1;
  margin-right: 0.5em;
  text-align: right;
`;

interface IProps {
  title: string;
  sideTitle?: string;
  icon: React.ElementType;
}

export const SectionHeader: React.FC<IProps> = props => {
  const { title, sideTitle, icon: MyIcon } = props;

  return (
    <SectionHeaderGrid>
      <SvgIcon>
        <MyIcon />
      </SvgIcon>
      <Title variant={'h5'}>{title}</Title>
      {sideTitle && (
        <SideTitle data-testid='side-title' variant={'h6'}>
          {sideTitle}
        </SideTitle>
      )}
    </SectionHeaderGrid>
  );
};
