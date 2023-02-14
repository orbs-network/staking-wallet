import { IBaseTableProps } from '../interfaces';
import React, { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';

import GuardiansMobileSection from './sections/index';
import { IGuardiansDictionary } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { handleRemoveGuardianFromList } from '../util';
interface IProps extends IBaseTableProps {
  sortedGuardians: IGuardiansDictionary[];
}

const GuardiansMobile: FC<IProps> = (props) => {
  const { sortedGuardians, selectedChain } = props;
  return (
    <div style={{ width: '100%', marginTop: '40px' }}>
      {sortedGuardians.map((group: IGuardiansDictionary) => {
        if (handleRemoveGuardianFromList(group.networks, props.showCandidatesNotInStandby, selectedChain)) return null;

        return <GuardiansMobileSection key={uuidv4()} {...props} group={group} selectedChain={selectedChain} />;
      })}
    </div>
  );
};

export default GuardiansMobile;
