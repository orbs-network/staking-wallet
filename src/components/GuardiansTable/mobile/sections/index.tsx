import React, { FC, useState } from 'react';
import { useGuardiansTableTranslations } from '../../../../translations/translationsHooks';
import Address from './address';
import useTheme from '@material-ui/core/styles/useTheme';
import Capacity from './capacity';
import EffectiveStake from './effective-stake';
import Participation from './participation';
import Rewards from './rewards';
import Selection from './selection';
import { v4 as uuidv4 } from 'uuid';
import Network from './Network';
import Website from './website';
import { IBaseTableProps } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import GuardianMobileHeader from './header';
import { useCommonStyles } from './styles';
import { IGuardiansDictionary } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { getChainConfig } from '../../../../utils';

interface IProps extends IBaseTableProps {
  group: IGuardiansDictionary;
  selectedChain: number;
}

const GuardiansMobileSection = (props: IProps) => {
  const { committeeMembers, guardiansToDelegatorsCut, group, selectedChain } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const theme = useTheme();

  const chainConfig = getChainConfig(selectedChain);

  const commonClasses = useCommonStyles();
  const { networks } = group;
  const { guardian } = networks.find((network) => network.chain === props.selectedChain);

  return (
    <div className={commonClasses.container}>
      <GuardianMobileHeader
        onClick={() => setShowDetails(!showDetails)}
        name={group.Name}
        committeeMembers={committeeMembers}
        guardian={guardian}
        qualificationImages={chainConfig.ui.guardians}
      />
      {showDetails && (
        <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255, 0.6)' }}>
          <Website translation={guardiansTableTranslations} website={group.Website} address={group.EthAddress} />
          <Address EthAddress={group.EthAddress} translation={guardiansTableTranslations} />
          <div className=''>
            {networks.map((network) => {
              const { chain, guardian } = network;

              const sectionProps = {
                translation: guardiansTableTranslations,
                guardian,
              };

              return (
                <div key={uuidv4()} className={commonClasses.networkSection}>
                  <Network chain={chain} translation={guardiansTableTranslations} />
                  <Rewards {...sectionProps} guardiansToDelegatorsCut={guardiansToDelegatorsCut} />
                  <EffectiveStake {...sectionProps} />
                  <Participation {...sectionProps} isSelectedChain={chain === selectedChain} chain={chain}  />
                  <Capacity {...sectionProps} isSelectedChain={chain === selectedChain} chain={chain} />
                  <Selection
                    {...sectionProps}
                    onGuardianSelect={props.onGuardianSelect}
                    selectedGuardian={props.selectedGuardian}
                    guardianSelectionMode={props.guardianSelectionMode}
                    theme={theme}
                    disableSelection={props.disableSelection}
                    isGuardian={props.isGuardian}
                    mainAddress={props.mainAddress}
                    isSelectedChain={chain === props.selectedChain}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardiansMobileSection;
