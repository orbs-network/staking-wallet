import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { ReactComponent as CopyIcon } from '../../../../../assets/copy.svg';

const getAddressColumn = (guardiansTableTranslations: any, copyAddress: (value: string) => void) => {
  return {
    title: guardiansTableTranslations('columnHeader_address'),
    field: 'EthAddress',
    render: ({ EthAddress }) => (
      <Tooltip title={<Typography>{EthAddress}</Typography>} arrow placement={'right'} interactive>
        <Typography style={{ fontFamily: 'monospace', textAlign: 'center', display: 'flex' }}>
          <InTextLink href={`https://etherscan.io/address/${EthAddress}`} text={`${EthAddress.substring(0, 10)}...`} />
          <CopyIcon
            style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '8px' }}
            onClick={() => copyAddress(EthAddress)}
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
