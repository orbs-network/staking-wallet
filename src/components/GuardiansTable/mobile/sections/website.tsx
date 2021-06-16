import React, { FC } from 'react';
import { Typography } from '@material-ui/core';

import { getWebsiteAddress } from '../../util';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';

const Website: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const commonClasses = useCommonStyles();
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('columnHeader_website')}</Typography>
      </div>
      <a
        className={commonClasses.rowContent}
        style={{ color: 'white' }}
        data-testid={`guardian-${guardian.EthAddress}-website`}
        href={getWebsiteAddress(guardian.Website)}
        target='_blank'
        rel='noopener noreferrer'
      >
        Link
      </a>
    </div>
  );
};

export default Website;
