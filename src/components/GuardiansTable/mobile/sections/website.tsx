import React, { FC } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as GlobeIcon } from '../../../../../assets/globe.svg';
import { getWebsiteAddress } from '../../util';
import { IMobileSection } from '../../interfaces';

const Website: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  return (
    <div>
      <Typography>{guardiansTableTranslations('columnHeader_website')}</Typography>
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
    </div>
  );
};

export default Website;
