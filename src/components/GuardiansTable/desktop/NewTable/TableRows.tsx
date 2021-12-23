import React, { memo } from 'react';
import {
  ICommitteeMemberData,
  IGuardiansDictionary,
  IGroupedGuardiansByNetwork,
} from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { v4 as uuidv4 } from 'uuid';

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
import config from '../../../../config';

const useStyles = makeStyles((theme) => ({
  nameRow: { maxWidth: '14vw', paddingRight: 30 },
  multipleGuardiansCell: {
    verticalAlign: 'top',
  },
  multipleGuardiansCellContent: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 'auto',
    objectFit: 'contain',
  },
  notSelectedChain: {
    opacity: 0.5,
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
  const { networks, EthAddress, Name, Website: website } = group;
  const selectedChainGuardian = networks.find((n) => n.chain === selectedChain).guardian;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  const rowSpan = networks.length + 1;

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
              />
            </div>
          )}
        </TableCell>

        <TableCell rowSpan={rowSpan} className={`${classes.nameRow}`}>
          <div>{Name}</div>
        </TableCell>
        <TableCell align='center' rowSpan={rowSpan}>
          <div>
            <Website address={EthAddress} website={website} />
          </div>
        </TableCell>
        <TableCell align='center' rowSpan={rowSpan}>
          <div>
            <Address address={EthAddress} copyAddress={copyAddress} />
          </div>
        </TableCell>
      </TableRow>
      {networks.map((network: IGroupedGuardiansByNetwork) => {
        const { guardian, chain } = network;
        const guardianDelegatorCut = guardian ? guardiansToDelegatorsCut[guardian.EthAddress] : 0;
        const isActive = chain === selectedChain;
        return (
          <TableRow key={uuidv4()} className={!isActive ? classes.notSelectedChain : ''}>
            <TableCell>
              <img className={classes.logo} src={config.networks[chain].logo} />
            </TableCell>
            <TableCell align='center'>
              {guardianDelegatorCut ? (
                <RewardPercentage
                  guardianDelegatorCut={guardianDelegatorCut}
                  translation={guardiansTableTranslations}
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell align='center'>
              {guardian ? (
                <EffectiveStake
                  selfStake={guardian.SelfStake}
                  effectiveStake={guardian.EffectiveStake}
                  delegatedStake={guardian.DelegatedStake}
                  translation={guardiansTableTranslations}
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell align='center'>
              {guardian ? (
                <Participation percentage={guardian.ParticipationPercentage} translation={guardiansTableTranslations} />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell align='center'>
              {guardian ? (
                <Capacity
                  translation={guardiansTableTranslations}
                  selfStake={guardian.SelfStake}
                  delegatedStake={guardian.DelegatedStake}
                  capacity={guardian.Capacity}
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

export default TableRows
