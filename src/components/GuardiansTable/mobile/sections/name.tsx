import React, { FC } from 'react';
import styled from 'styled-components';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { Typography } from '@material-ui/core';
import { IMobileSection } from '../../interfaces';

const NameBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'center',
}));

const NameSection: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  return (
    <div>
      <Typography>{guardiansTableTranslations('columnHeader_name')}</Typography>
      <NameBox data-testid={`guardian-${guardian.EthAddress}`}>
        <Typography>{guardian.Name}</Typography>
      </NameBox>
    </div>
  );
};

export default NameSection;
