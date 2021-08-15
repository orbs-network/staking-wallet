import React from 'react';
import styled from 'styled-components';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { Typography } from '@material-ui/core';

const NameBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'center',
}));

const getNameColumn = (guardiansTableTranslations: any) => {
  return {
    title: guardiansTableTranslations('columnHeader_name'),
    field: 'Name',
    render: (guardian: Guardian) => (
      <NameBox data-testid={`guardian-${guardian.EthAddress}`}>
        <Typography>{guardian.Name}</Typography>
      </NameBox>
    ),
    headerStyle: {
      textAlign: 'left' as const,
    },
  };
};

export default getNameColumn;
