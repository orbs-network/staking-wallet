import React from 'react';
import styled from 'styled-components';
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
    render: (rowData) => {
      return (
        <NameBox data-testid={`guardian-${rowData.guardian.EthAddress}`}>
          <Typography>{rowData.guardian.Name}</Typography>
        </NameBox>
      );
    },
    headerStyle: {
      textAlign: 'left' as const,
    },
  };
};

export default getNameColumn;
