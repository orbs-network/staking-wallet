import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as GlobeIcon } from '../../../../../assets/globe.svg';
import { getWebsiteAddress } from '../../util';

const getWebsiteColumn = (guardiansTableTranslations: any) => {
  return {
    title: guardiansTableTranslations('columnHeader_website'),
    field: 'Website',
    render: (guardian) => (
      <Tooltip arrow title={<Typography>{guardian.Website}</Typography>}>
        <a
          data-testid={`guardian-${guardian.EthAddress}-website`}
          href={getWebsiteAddress(guardian.Website)}
          target='_blank'
          rel='noopener noreferrer'
        >
          <SvgIcon component={GlobeIcon} />
        </a>
      </Tooltip>
    ),
    cellStyle: {
      textAlign: 'center' as const,
    },
    sorting: false,
  };
};

export default getWebsiteColumn;
