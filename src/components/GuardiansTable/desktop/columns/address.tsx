import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';

const getAddressColumn = (guardiansTableTranslations: any) => {
  return {
    title: guardiansTableTranslations('columnHeader_address'),
    field: 'EthAddress',
    render: (guardian) => (
      <Tooltip title={<Typography>{guardian.EthAddress}</Typography>} arrow placement={'right'} interactive>
        <Typography style={{ fontFamily: 'monospace', textAlign: 'center' }}>
          <InTextLink
            href={`https://etherscan.io/address/${guardian.EthAddress}`}
            text={`${guardian.EthAddress.substring(0, 10)}...`}
          />
        </Typography>
      </Tooltip>
    ),
    // TODO : FUTURE : O.L : Adding "fontFamily: 'monospace'" to the cell makes the Typography text larger and better, understand whats going on.
    cellStyle: {
      fontFamily: 'monospace',
    },
  };
};
export default getAddressColumn;
