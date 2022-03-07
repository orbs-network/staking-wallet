import React, { memo } from 'react';
import {
  ICommitteeMemberData,
  IGuardiansDictionary,
  IGroupedGuardiansByNetwork,
} from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { v4 as uuidv4 } from 'uuid';
import BaseTooltip from '../../../../components/tooltips/BaseTooltip';
import Selection from './selection';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { TGuardianSelectionMode } from '../../interfaces';
import RewardPercentage from './reward-percentage';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import Address from './Address';
import Website from './Website';
import { EMPTY_ADDRESS } from '../../../../constants';
import EffectiveStake from './effective-stake';
import Participation from './participation';
import Capacity from './capacity';
import useTheme from '@material-ui/core/styles/useTheme';
import Qualifications from './qualifications';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../../../../config';
import { useCommonsTranslations } from '../../../../translations/translationsHooks';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

const useStyles = makeStyles((theme) => ({
  multipleGuardiansCell: {
    verticalAlign: 'top',
  },
  multipleGuardiansCellContent: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
  logo: {
    width: 30,
    height: 'auto',
    objectFit: 'contain',
  },
  notSelectedChain: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  selectedChain: {
    '& td': {
      borderBottom: '1px solid transparent',
      paddingTop: '30px',
    },
  },
}));

interface IProps {
  group: IGuardiansDictionary;
  selectedChain: number;
  guardiansTableTranslations: any;
  guardianSelectionMode: TGuardianSelectionMode;
  committeeMembers: ICommitteeMemberData[];
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };
  selectedGuardian?: string;
  onGuardianSelect?: (guardian: Guardian) => void;
  tableTestId?: string;
  extraStyle?: React.CSSProperties;
  tableTitle?: string;
  disableSelection?: boolean;
  isGuardian: boolean;
  mainAddress: string;
  copyAddress: (val: string) => void;
}

function TableRows(props: IProps) {
  const theme = useTheme();
  const classes = useStyles();
  const commonTranslations = useCommonsTranslations();
  const {
    guardiansToDelegatorsCut,
    committeeMembers,
    selectedGuardian,
    onGuardianSelect,
    guardianSelectionMode,
    mainAddress,
    disableSelection,
    isGuardian,
    selectedChain,
    guardiansTableTranslations,
    group,
    copyAddress,
  } = props;
  const { networks, EthAddress, Name, Website: website, IsCertified, RegistrationTime } = group;
  const selectedChainGuardian = selectedChain ? networks.find((n) => n.chain === selectedChain).guardian : null;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  const rowSpan = networks.length + 1;
  const selectedNetworkConfig = config.networks[selectedChain];
  const blockExplorer = selectedNetworkConfig ? selectedNetworkConfig.blockExplorerUrl : '';
  if (selectedChainGuardian) {
    selectedChainGuardian.RegistrationTime = RegistrationTime;
    selectedChainGuardian.IsCertified = IsCertified;
  }
  return (
    <>
      <TableRow>
        <TableCell rowSpan={rowSpan}>
          {addSelectionColumn && selectedChainGuardian && (
            <Selection
              guardiansTableTranslations={guardiansTableTranslations}
              onGuardianSelect={onGuardianSelect}
              selectedGuardian={selectedGuardian}
              guardianSelectionMode={guardianSelectionMode}
              theme={theme}
              disableSelection={disableSelection}
              isGuardian={isGuardian}
              mainAddress={mainAddress}
              guardian={selectedChainGuardian}
            />
          )}
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          {selectedChainGuardian && (
            <div>
              <Qualifications
                address={EthAddress}
                guardian={selectedChainGuardian}
                committeeMembers={committeeMembers}
                qualificationImages={selectedNetworkConfig && selectedNetworkConfig.ui.guardians}
              />
            </div>
          )}
        </TableCell>

        <TableCell rowSpan={rowSpan}>
          <div style={{ width: '10vw', paddingRight: 20 }}>{Name}</div>
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          <div>
            <Website
              address={EthAddress}
              website={website}
              linkImage={selectedNetworkConfig && selectedNetworkConfig.ui.linkImage}
            />
          </div>
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          <div style={{ paddingRight: '10px' }}>
            <Address
              address={EthAddress}
              copyAddress={copyAddress}
              blockExplorer={blockExplorer}
              copyImage={selectedNetworkConfig && selectedNetworkConfig.ui.copyImage}
            />
          </div>
        </TableCell>
      </TableRow>
      {networks.map((network: IGroupedGuardiansByNetwork, index: number) => {
        const { guardian, chain } = network;
        const networkConfig = config.networks[chain];
        const guardianDelegatorCut = guardian ? guardiansToDelegatorsCut[guardian.EthAddress] : 0;
        const isActive = chain === selectedChain;
        const translationName = networkConfig.name.toLowerCase();
        return (
          <TableRow key={index} className={isActive && classes.selectedChain}>
            <TableCell style={{ paddingRight: 20 }}>
              <HtmlTooltip placement='bottom' arrow title={commonTranslations(translationName as any)}>
                <img className={classes.logo} src={networkConfig.smallLogo} />
              </HtmlTooltip>
            </TableCell>
            <TableCell>
              {guardianDelegatorCut ? (
                <RewardPercentage
                  guardianDelegatorCut={guardianDelegatorCut}
                  translation={guardiansTableTranslations}
                  className={!isActive && classes.notSelectedChain}
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {guardian ? (
                <EffectiveStake
                  selfStake={guardian.SelfStake}
                  effectiveStake={guardian.EffectiveStake}
                  delegatedStake={guardian.DelegatedStake}
                  translation={guardiansTableTranslations}
                  className={!isActive && classes.notSelectedChain}
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {guardian ? (
                <Participation
                  chain={chain}
                  percentage={guardian.ParticipationPercentage}
                  translation={guardiansTableTranslations}
                  isSelectedChain={chain === selectedChain}
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {guardian ? (
                <Capacity
                  translation={guardiansTableTranslations}
                  selfStake={guardian.SelfStake}
                  delegatedStake={guardian.DelegatedStake}
                  capacity={guardian.Capacity}
                  chain={chain}
                  isSelectedChain={chain === selectedChain}
                />
              ) : (
                '-'
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

export default TableRows;
