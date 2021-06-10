import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Theme,
  Tooltip,
  Snackbar,
} from '@material-ui/core';
import copy from 'copy-to-clipboard';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import MaterialTable, { Column, MTableToolbar } from 'material-table';
import styled from 'styled-components';
import { ReactComponent as CopyIcon } from '../../../assets/copy.svg';

import { EMPTY_ADDRESS } from '../../constants';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { selectActionButtonTestIdFromAddress } from '../../__tests__/components/guardians/guardiansTestUtils';
import { useAlertsTranslations, useGuardiansTableTranslations } from '../../translations/translationsHooks';
import { ReactComponent as GlobeIcon } from '../../../assets/globe.svg';
import SvgIcon from '@material-ui/core/SvgIcon';
import { TABLE_ICONS } from '../tables/TableIcons';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { GuardianQualifications } from './GuardianQualifications';
import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Line } from 'rc-progress';
import { CommonActionButton } from '../base/CommonActionButton';
import { InTextLink } from '../shared/texts/InTextLink';
import { toJS } from 'mobx';
import { ensurePrefix } from '../../utils/stringUtils';
import { InfoToolTipIcon } from '../tooltips/InfoTooltipIcon';
import { useBoolean } from 'react-hanger';
import { CustomSnackBarContent } from '../snackbar/CustomSnackBarContent';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

// DEV_NOTE : O.L : The '+' is a trick to get better display of round numbers
const secondsToDaysString = (seconds: number) => +(seconds / (60 * 60 * 24)).toFixed(2);

const getWebsiteAddress = (url: string) => (url.toLowerCase().indexOf('http') === 0 ? url : `http://${url}`);

const NameBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'center',
}));

const useStyles = makeStyles((theme) => ({
  toolbarWrapper: {
    '& .MuiToolbar-gutters': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  breakAll: {
    '& *': {
      wordBreak: 'keep-all',
    },
  },
  selectButton: {
    minWidth: '130px',
  },
}));

type TGuardianSelectionMode = 'Select' | 'Change' | 'None';

interface IProps {
  guardianSelectionMode: TGuardianSelectionMode;
  guardians: Guardian[];
  committeeMembers: ICommitteeMemberData[];
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };

  selectedGuardian?: string;
  onGuardianSelect?: (guardian: Guardian) => void;
  tableTestId?: string;
  extraStyle?: React.CSSProperties;
  tableTitle?: string;

  disableSelection?: boolean;

  // Styling
  densePadding?: boolean;
}

function compareGuardiansBySelectedAndThenStake(a: Guardian, b: Guardian, selectedGuardianAddress = '') {
  const selectedGuardianAddressLowerCase = selectedGuardianAddress.toLowerCase();
  if (a.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return -1;
  } else if (b.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return 1;
  } else {
    return b.EffectiveStake - a.EffectiveStake;
  }
}

export const GuardiansTable = React.memo<IProps>((props) => {
  const {
    guardianSelectionMode,
    guardians,
    onGuardianSelect,
    selectedGuardian,
    guardiansToDelegatorsCut,
    disableSelection,
    tableTestId,
    extraStyle,
    tableTitle,
    densePadding,
    committeeMembers,
  } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();

  const classes = useStyles();
  const theme = useTheme();
  const alertsTranslations = useAlertsTranslations();

  const showSnackbarMessage = useBoolean(false);
  const getGuardianSelectionCellContent = useCallback(
    (g: Guardian) => {
      let selectedGuardianCell = null;

      const actionButtonTestId = selectActionButtonTestIdFromAddress(g.EthAddress);
      const actionButtonOnClick = () => onGuardianSelect(g);
      const isSelectedGuardian = g.EthAddress.toLowerCase() === selectedGuardian?.toLowerCase();

      switch (guardianSelectionMode) {
        case 'Select':
          selectedGuardianCell = (
            <CommonActionButton
              disabled={disableSelection}
              variant={'outlined'}
              onClick={actionButtonOnClick}
              fullWidth
            >
              {guardiansTableTranslations(isSelectedGuardian ? 'action_keep' : 'action_select')}
            </CommonActionButton>
          );
          break;
        case 'Change':
          const enabled = !!onGuardianSelect;
          const actionButtonIcon = isSelectedGuardian ? (
            <CheckCircleOutlineIcon data-testid={'selected-guardian-icon'} />
          ) : (
            <RadioButtonUncheckedIcon data-testid={'unselected-guardian-icon'} />
          );

          const iconColor = isSelectedGuardian ? theme.palette.secondary.main : theme.palette.grey['500'];

          selectedGuardianCell = (
            <Typography data-testid={`guardian-${g.EthAddress}-selected-status`}>
              <IconButton
                data-testid={actionButtonTestId}
                onClick={actionButtonOnClick}
                disabled={!enabled || disableSelection}
                style={{ color: iconColor }}
              >
                {actionButtonIcon}
              </IconButton>
            </Typography>
          );
          break;
        case 'None':
          selectedGuardianCell = null;
          break;
        default:
          throw new Error(`Invalid guardian selection mode of ${guardianSelectionMode}`);
      }

      return selectedGuardianCell;
    },
    [
      selectedGuardian,
      guardianSelectionMode,
      onGuardianSelect,
      disableSelection,
      guardiansTableTranslations,
      theme.palette.secondary.main,
      theme.palette.grey,
    ],
  );

  const copyAddress = useCallback(
    (value: string) => {
      copy(value);
      showSnackbarMessage.setTrue();
    },
    [showSnackbarMessage],
  );

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');

  const sortedGuardians = useMemo(
    () => guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian)),
    [guardians, selectedGuardian],
  );

  console.log({ committeeMembers: toJS(committeeMembers) });

  const getCommitteeMemberData = useCallback(
    (guardianEthAddress: string) => {
      const committeeMemberData = committeeMembers.find(
        (committeeMember) =>
          ensurePrefix(committeeMember.EthAddress, '0x').toLowerCase() === guardianEthAddress.toLowerCase(),
      );

      return committeeMemberData;
    },
    [committeeMembers],
  );

  const columns = useMemo(() => {
    const columns: Column<Guardian>[] = [
      {
        title: '',
        field: '',
        render: (guardian) => (
          <GuardianQualifications
            guardian={guardian}
            committeeMembershipData={getCommitteeMemberData(guardian.EthAddress)}
          />
        ),
        width: 'fit-content',
      },
      {
        title: guardiansTableTranslations('columnHeader_name'),
        field: 'Name',
        render: (guardian) => (
          <NameBox data-testid={`guardian-${guardian.EthAddress}`}>
            <Typography>{guardian.Name}</Typography>
          </NameBox>
        ),
        headerStyle: {
          textAlign: 'left',
        },
      },
      {
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
          textAlign: 'center',
        },
        sorting: false,
      },
      {
        title: guardiansTableTranslations('columnHeader_address'),
        field: 'EthAddress',
        render: (guardian) => (
          <Tooltip title={<Typography>{guardian.EthAddress}</Typography>} arrow placement={'right'} interactive>
            <Typography style={{ fontFamily: 'monospace', textAlign: 'center', display: 'flex' }}>
              <InTextLink
                href={`https://etherscan.io/address/${guardian.EthAddress}`}
                text={`${guardian.EthAddress.substring(0, 10)}...`}
              />
              <CopyIcon
                style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '8px' }}
                onClick={() => copyAddress(guardian.EthAddress)}
              />
            </Typography>
          </Tooltip>
        ),
        // TODO : FUTURE : O.L : Adding "fontFamily: 'monospace'" to the cell makes the Typography text larger and better, understand whats going on.
        cellStyle: {
          fontFamily: 'monospace',
        },
      },

      {
        title: (
          <ColumnHeaderWithTooltip
            headerText={guardiansTableTranslations('columnHeader_rewardsPercentageToDelegators')}
            tooltipText={guardiansTableTranslations('columnHeaderInfo_rewardsPercentageToDelegators', {
              minPercentage: 0,
              maxPercentage: 66.667,
            })}
          />
        ),
        field: '',
        render: (guardian) => {
          const { EthAddress } = guardian;

          const hasData = guardiansToDelegatorsCut[EthAddress] != undefined;

          const percentageText = hasData ? `${guardiansToDelegatorsCut[EthAddress]}%` : '--';

          return (
            <Tooltip
              arrow
              title={
                <>
                  <Typography>
                    {guardiansTableTranslations('message_guardianGivesXPercentageToDelegators', {
                      percentage: percentageText,
                    })}
                  </Typography>
                </>
              }
            >
              <Typography>{percentageText}</Typography>
            </Tooltip>
          );
        },
        cellStyle: {
          textAlign: 'center',
        },
        customSort: (data1, data2) => {
          // DEV_NOTE : This is quick, might cause 'un-deterministic' sort, but it's acceptable
          const delegatorsCut1 = guardiansToDelegatorsCut[data1.EthAddress] || 0;
          const delegatorsCut2 = guardiansToDelegatorsCut[data2.EthAddress] || 0;

          return delegatorsCut2 - delegatorsCut1;
        },
        defaultSort: 'desc',
      },
      {
        title: (
          <ColumnHeaderWithTooltip
            headerText={guardiansTableTranslations('columnHeader_effectiveStake')}
            tooltipText={[
              [
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_effectiveStakeTitle'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_effectiveStakeExplain'),
              ],
              [
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityOverTitle'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityOverCalculation'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityUnderTitle'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_ifCapacityUnderCalculation'),
              ],
              [
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_selfStakeTitle'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_selfStakeExplanation'),
              ],
              [
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_delegatedStakeTitle'),
                guardiansTableTranslations('columnHeaderInfo_effectiveStake_delegatedStakeExplanation'),
              ],
            ]}
          />
        ),
        field: 'EffectiveStake',
        render: (guardian) => {
          const { EffectiveStake, SelfStake, DelegatedStake } = guardian;

          const effectiveStakeInUnits =
            EffectiveStake > 1_000_000
              ? `${(EffectiveStake / 1_000_000).toFixed(2).replace(/[.,]00$/, '')} M`
              : `${(EffectiveStake / 1_000).toFixed(2).replace(/[.,]00$/, '')} K`;

          return (
            <Tooltip
              arrow
              title={
                <>
                  <Typography>
                    {guardiansTableTranslations('message_selfStake')}:{' '}
                    {guardiansTableTranslations('xOrbs', { amount: SelfStake?.toLocaleString() })}
                  </Typography>

                  <Typography>
                    {guardiansTableTranslations('message_delegatedStake')}:{' '}
                    {guardiansTableTranslations('xOrbs', { amount: DelegatedStake?.toLocaleString() })}
                  </Typography>
                </>
              }
            >
              <Typography>{effectiveStakeInUnits}</Typography>
            </Tooltip>
          );
        },
        cellStyle: {
          textAlign: 'center',
        },
        defaultSort: 'desc',
      },
      {
        title: (
          <ColumnHeaderWithTooltip
            headerText={guardiansTableTranslations('columnHeader_participation')}
            tooltipText={guardiansTableTranslations('columnHeaderInfo_participation')}
          />
        ),
        field: 'ParticipationPercentage',
        render: (guardian) => {
          const { ParticipationPercentage } = guardian;
          // TODO : ORL : Make this color gradient
          const color = ParticipationPercentage <= 30 ? 'red' : ParticipationPercentage <= 80 ? 'yellow' : 'green';
          const timePercentageText = ParticipationPercentage.toFixed(2);

          return (
            <Tooltip
              arrow
              title={
                <>
                  <Typography>
                    {guardiansTableTranslations('message_participationExplanation', {
                      daysPeriod: 30,
                      timePercentage: timePercentageText,
                    })}
                  </Typography>
                  <br />
                  <Typography>{guardiansTableTranslations('message_participationRewardsWarning')}</Typography>
                </>
              }
            >
              <div>
                <Line percent={ParticipationPercentage} strokeWidth={5} strokeColor={color} />
                <Typography>{timePercentageText}%</Typography>
              </div>
            </Tooltip>
          );
        },
        cellStyle: {
          textAlign: 'center',
        },
        defaultSort: 'desc',
      },
      {
        title: (
          <ColumnHeaderWithTooltip
            headerText={guardiansTableTranslations('columnHeader_capacity')}
            tooltipText={[
              guardiansTableTranslations('columnHeaderInfo_capacity_explanation'),
              guardiansTableTranslations('columnHeaderInfo_capacity_calculation'),
              [
                guardiansTableTranslations('columnHeaderInfo_capacity_note_title'),
                guardiansTableTranslations('columnHeaderInfo_capacity_note_content'),
              ],
            ]}
          />
        ),
        field: 'SelfStake',
        render: (guardian) => {
          const { Capacity, SelfStake, DelegatedStake } = guardian;
          // TODO : ORL : Make this color gradient
          const color = Capacity <= 30 ? 'green' : Capacity <= 80 ? 'yellow' : 'red';
          // const
          const selfStakePercentage = +((SelfStake / DelegatedStake) * 100).toFixed(2);
          // const selfStakePercentageText =

          const capacityText = !isNaN(Capacity) ? `${Capacity.toFixed(2)}%` : '--';

          // console.log(`${guardian.Name} capacity : ${Capacity}`);
          // console.log(`${guardian.Name} capacity : ${SelfStake} - ${DelegatedStake}`);

          return (
            <Tooltip
              arrow
              title={
                <>
                  <Typography>
                    {guardiansTableTranslations('message_selfStake')}:{' '}
                    {guardiansTableTranslations('xOrbs', { amount: SelfStake?.toLocaleString() })} {'  '}(
                    {selfStakePercentage?.toLocaleString()}%)
                  </Typography>
                  <Typography>
                    {guardiansTableTranslations('message_delegatedStake')}:{' '}
                    {guardiansTableTranslations('xOrbs', { amount: DelegatedStake?.toLocaleString() })}
                  </Typography>
                </>
              }
            >
              <div>
                <Line percent={Capacity} strokeWidth={5} strokeColor={color} />
                <Typography>{capacityText}</Typography>
              </div>
            </Tooltip>
          );
        },
        cellStyle: {
          textAlign: 'center',
        },
        defaultSort: 'desc',
      },
    ];

    if (addSelectionColumn) {
      columns.push({
        title: guardiansTableTranslations('columnHeader_selection'),
        field: '',
        render: (extendedGuardianInfo) => {
          return getGuardianSelectionCellContent(extendedGuardianInfo);
        },
        cellStyle: {
          textAlign: 'center',
        },
      });
    }

    return columns;
  }, [
    addSelectionColumn,
    getCommitteeMemberData,
    getGuardianSelectionCellContent,
    guardiansTableTranslations,
    guardiansToDelegatorsCut,
    copyAddress,
  ]);

  // DEV_NOTE : O.L : This prevents displaying of a large empty table if there are less than 50 Guardians.
  const pageSize = Math.min(50, guardians.length);

  // TODO : ORL : Add translations to table here.
  return (
    <div className={classes.breakAll}>
      <MaterialTable
        title={tableTitle || ''}
        columns={columns}
        data={sortedGuardians}
        icons={TABLE_ICONS}
        style={{ overflowX: 'auto' }}
        options={{
          padding: densePadding ? 'dense' : 'default',
          pageSize: pageSize,
          pageSizeOptions: [5, 10, pageSize],

          rowStyle: (guardian: Guardian) => ({
            backgroundColor:
              guardian.EthAddress.toLowerCase() === selectedGuardian?.toLowerCase()
                ? 'rgba(66,66, 66, 0.55)'
                : 'rgba(33,33, 33, 0.55)',
          }),
          headerStyle: {
            backgroundColor: theme.palette.primary.dark,
            textAlign: 'center',
          },
        }}
        components={{
          // DEV_NOTE : This 'Hack' to style the toolbar is taken from 'https://github.com/mbrn/material-table/issues/1690#issuecomment-603755197'
          Toolbar: (props) => (
            <div className={classes.toolbarWrapper}>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showSnackbarMessage.value}
        autoHideDuration={1200}
        onClose={showSnackbarMessage.setFalse}
      >
        <CustomSnackBarContent
          variant={'success'}
          message={alertsTranslations('walletAddressWasCopied')}
          onClose={showSnackbarMessage.setFalse}
          data-testid={'message-address-was-copied'}
        />
      </Snackbar>
    </div>
  );
});

interface IColumnHeaderWithTooltipProps {
  headerText: string;
  tooltipText: string | Array<string | string[]>;
}

const ColumnHeaderWithTooltip = React.memo<IColumnHeaderWithTooltipProps>((props) => {
  const { headerText, tooltipText } = props;
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {headerText} <span style={{ width: '0.5rem' }} /> <InfoToolTipIcon tooltipTitle={tooltipText} />
    </span>
  );
});
