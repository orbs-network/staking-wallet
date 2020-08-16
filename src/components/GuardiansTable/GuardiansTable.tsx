import { Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, Theme } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import MaterialTable, { Column, MTableToolbar } from 'material-table';
import styled from 'styled-components';
import { EMPTY_ADDRESS } from '../../constants';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { selectActionButtonTestIdFromAddress } from '../../__tests__/components/guardians/guardiansTestUtils';
import { useGuardiansTableTranslations } from '../../translations/translationsHooks';
import { ReactComponent as GlobeIcon } from '../../../assets/globe.svg';
import SvgIcon from '@material-ui/core/SvgIcon';
import { TABLE_ICONS } from '../tables/TableIcons';
import { Guardian } from '../../services/v2/orbsNodeService/model';
import { GuardianQualifications } from './GuardianQualifications';
import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

const getWebsiteAddress = (url: string) => (url.toLowerCase().indexOf('http') === 0 ? url : `http://${url}`);

const SelectButton = styled(Button)`
  min-width: 130px;
`;

const NameBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'center',
}));

const yesColor = '#00ff11';
const YesContainer = styled.span`
  color: #00ff11;
`;

const noColor = 'red';
const NoContainer = styled.span`
  color: red;
`;

const NameContainer = styled.span(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)((themeProps: { theme: Theme }) => ({
  backgroundColor: themeProps.theme.palette.primary.dark,
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
}));

const StyledTableBody = styled(TableBody)((themeProps: { theme: Theme }) => ({
  // backgroundColor: themeProps.theme.palette.primary.main,
  backgroundColor: 'rgba(33,33, 33, 0.55)',
}));

const useStyles = makeStyles((theme) => ({
  toolbarWrapper: {
    '& .MuiToolbar-gutters': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

// TODO : ORL : Pick a better color for marking selected guardian
const selectedGuardianRowStyle: React.CSSProperties = { backgroundColor: '#1D0D0D' };

type TGuardianSelectionMode = 'Select' | 'Change' | 'None';

interface IProps {
  guardianSelectionMode: TGuardianSelectionMode;
  guardians: Guardian[];
  committeeMembers: ICommitteeMemberData[];

  selectedGuardian?: string;
  onGuardianSelect?: (guardian: Guardian) => void;
  tableTestId?: string;
  extraStyle?: React.CSSProperties;
  tableTitle?: string;

  // Styling
  densePadding?: boolean;
}

function compareGuardiansBySelectedAndThenStake(a: Guardian, b: Guardian, selectedGuardianAddress: string) {
  if (a.EthAddress === selectedGuardianAddress) {
    return -1;
  } else if (b.EthAddress === selectedGuardianAddress) {
    return 11;
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
    tableTestId,
    extraStyle,
    tableTitle,
    densePadding,
    committeeMembers,
  } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();

  const classes = useStyles();
  const theme = useTheme();

  const getGuardianSelectionCellContent = useCallback(
    (g: Guardian) => {
      let selectedGuardianCell = null;

      const actionButtonTestId = selectActionButtonTestIdFromAddress(g.EthAddress);
      const actionButtonOnClick = () => onGuardianSelect(g);
      const isSelectedGuardian = g.EthAddress.toLowerCase() === selectedGuardian.toLowerCase();

      switch (guardianSelectionMode) {
        case 'Select':
          selectedGuardianCell = (
            <SelectButton
              variant='contained'
              size='small'
              data-testid={actionButtonTestId}
              onClick={actionButtonOnClick}
            >
              {guardiansTableTranslations(isSelectedGuardian ? 'action_keep' : 'action_select')}
            </SelectButton>
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
                disabled={!enabled}
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
    [theme, guardianSelectionMode, guardiansTableTranslations, onGuardianSelect, selectedGuardian],
  );

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');

  const sortedGuardians = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian)),
    [guardians, selectedGuardian],
  );

  const getCommitteeMemberData = useCallback(
    (guardianEthAddress: string) => {
      const committeeMemberData = committeeMembers.find(
        (committeeMember) => committeeMember.EthAddress.toLowerCase() === guardianEthAddress.toLowerCase(),
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
      },
      {
        title: guardiansTableTranslations('columnHeader_name'),
        field: 'name',
        render: (guardian) => (
          <NameBox data-testid={`guardian-${guardian.EthAddress}`}>
            {/* TODO : FUTURE : O.L : add support for the jazzicon */}
            {/*<Jazzicon diameter={40} seed={jsNumberForAddress(extendedGuardianInfo.address)} />*/}
            <NameContainer>
              <Typography>{guardian.Name}</Typography>
            </NameContainer>
          </NameBox>
        ),
        headerStyle: {
          textAlign: 'left',
        },
      },
      {
        title: guardiansTableTranslations('columnHeader_address'),
        field: 'address',
        render: (guardian) => (
          <Typography style={{ fontFamily: 'monospace', textAlign: 'center' }}>{guardian.EthAddress}</Typography>
        ),
        // TODO : FUTURE : O.L : Adding "fontFamily: 'monospace'" to the cell makes the Typography text larger and better, understand whats going on.
        cellStyle: {
          fontFamily: 'monospace',
        },
      },
      {
        title: guardiansTableTranslations('columnHeader_website'),
        field: 'website',
        render: (guardian) => (
          <a
            data-testid={`guardian-${guardian.EthAddress}-website`}
            href={getWebsiteAddress(guardian.Website)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <SvgIcon component={GlobeIcon} />
          </a>
        ),
        cellStyle: {
          textAlign: 'center',
        },
        sorting: false,
      },
      {
        title: guardiansTableTranslations('columnHeader_stakingPercentageInLastElections'),
        field: 'stakePercent',
        render: (guardian) => <Typography variant={'button'}>{asPercent(0)}</Typography>,
        cellStyle: {
          textAlign: 'center',
        },
        defaultSort: 'desc',
      },
      {
        title: guardiansTableTranslations('columnHeader_votedInLastElection'),
        field: 'voted',
        render: (guardian) => {
          const textColor = false ? yesColor : noColor;
          const text = false ? guardiansTableTranslations('didVote_yes') : guardiansTableTranslations('didVote_no');

          return <Typography style={{ color: textColor }}>{text}</Typography>;
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
  }, [addSelectionColumn, getCommitteeMemberData, getGuardianSelectionCellContent, guardiansTableTranslations]);

  const pageSize = Math.min(50, guardians.length);

  // TODO : O.L : FUTURE : Consider using a 3rd party MUI table component
  return (
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
          backgroundColor: guardian.EthAddress === selectedGuardian ? 'rgba(66,66, 66, 0.55)' : 'rgba(33,33, 33, 0.55)',
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
  );
});
