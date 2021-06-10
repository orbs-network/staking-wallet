import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { InTextLink } from '../../../shared/texts/InTextLink';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { IMobileSection } from '../../interfaces';

const getAddressColumn: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  return (
    <div>
      <Typography>{guardiansTableTranslations('columnHeader_address')}</Typography>
      <Tooltip title={<Typography>{guardian.EthAddress}</Typography>} arrow placement={'right'} interactive>
        <Typography style={{ fontFamily: 'monospace', textAlign: 'center' }}>
          <InTextLink
            href={`https://etherscan.io/address/${guardian.EthAddress}`}
            text={`${guardian.EthAddress.substring(0, 10)}...`}
          />
        </Typography>
      </Tooltip>
    </div>
  );
};
export default getAddressColumn;
