import { IBaseTableProps } from '../interfaces';
import React, { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';

import GuardiansMobileSection from './sections/index';
import { IGroupedGuardiansByNetwork, IGuardiansDictionary } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
interface IProps extends IBaseTableProps {
  sortedGuardians: IGuardiansDictionary[];
}

const GuardiansMobile: FC<IProps> = (props) => {
  const { sortedGuardians, selectedChain } = props;
  return (
    <div style={{ width: '100%', marginTop: '40px' }}>
      {sortedGuardians.map((group: IGuardiansDictionary) => {
        return <GuardiansMobileSection key={uuidv4()} {...props} group={group} selectedChain={selectedChain} />;
      })}
    </div>
  );
};

export default GuardiansMobile;
