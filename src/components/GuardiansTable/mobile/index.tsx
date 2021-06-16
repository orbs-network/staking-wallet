import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import { IBaseTableProps } from '../interfaces';
import React, { FC } from 'react';
import GuardiansMobileSection from './sections/index';
interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
}

const GuardiansMobile: FC<IProps> = (props) => {
  const { sortedGuardians } = props;
  return (
    <div style={{ width: '100%', marginTop: '40px' }}>
      {sortedGuardians.map((guardian: Guardian) => {
        return <GuardiansMobileSection key={guardian.EthAddress} {...props} guardian={guardian} />;
      })}
    </div>
  );
};

export default GuardiansMobile;
