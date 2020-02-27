import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const SectionHeaderGrid = styled.div`
  display: flex;
  margin-bottom: 0.5em;
`;

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
      {/* TODO : O.L : Make this Icon adhere to the page font-size */}
      <MyIcon></MyIcon>
      <Title variant={'h5'}>{title}</Title>
      {sideTitle && (
        <SideTitle data-testid='side-title' variant={'h6'}>
          {sideTitle}
        </SideTitle>
      )}
    </SectionHeaderGrid>
  );
};
