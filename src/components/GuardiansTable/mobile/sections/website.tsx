import React, { FC } from 'react';
import { Typography } from '@material-ui/core';

import { getWebsiteAddress } from '../../util';
import { useCommonStyles } from './styles';

interface IProps {
  translation: any;
  website: string;
  address: string;
}

const Website = ({ website, address, translation }: IProps) => {
  const commonClasses = useCommonStyles();
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_website')}</Typography>
      </div>
      <a
        className={commonClasses.rowContent}
        style={{ color: 'white' }}
        data-testid={`guardian-${address}-website`}
        href={getWebsiteAddress(website)}
        target='_blank'
        rel='noopener noreferrer'
      >
        Link
      </a>
    </div>
  );
};

export default Website;
