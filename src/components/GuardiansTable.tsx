import { Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, Theme } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import MaterialTable, { Column, MTableToolbar } from 'material-table';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import styled from 'styled-components';
import { EMPTY_ADDRESS } from '../constants';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { selectActionButtonTestIdFromAddress } from '../__tests__/components/guardians/guardiansTestUtils';
import { useGuardiansTableTranslations } from '../translations/translationsHooks';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { ReactComponent as GlobeIcon } from '../../assets/globe.svg';
import SvgIcon from '@material-ui/core/SvgIcon';
import { TABLE_ICONS } from './tables/TableIcons';

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
  guardians: TGuardianInfoExtended[];
  selectedGuardian?: string;
  onGuardianSelect?: (guardian: TGuardianInfoExtended) => void;
  tableTestId?: string;
  extraStyle?: React.CSSProperties;
  tableTitle?: string;

  // Styling
  densePadding?: boolean;
}

export const GuardiansTableOld = React.memo<IProps>((props) => {
  const { guardianSelectionMode, guardians, onGuardianSelect, selectedGuardian, tableTestId, extraStyle } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();

  const getSelectedGuardianCell = useCallback(
    (g: TGuardianInfoExtended, idx: number) => {
      let selectedGuardianCell = null;

      const actionButtonTestId = selectActionButtonTestIdFromAddress(g.address);
      const actionButtonOnClick = () => onGuardianSelect(g);

      switch (guardianSelectionMode) {
        case 'Select':
          selectedGuardianCell = (
            <TableCell align='center'>
              <SelectButton
                variant='contained'
                size='small'
                // disabled={g.address === selectedGuardian}
                data-testid={actionButtonTestId}
                onClick={actionButtonOnClick}
              >
                {guardiansTableTranslations(g.address === selectedGuardian ? 'action_keep' : 'action_select')}
              </SelectButton>
            </TableCell>
          );
          break;
        case 'Change':
          const isSelectedGuardian = g.address === selectedGuardian;

          const enabled = !!onGuardianSelect;
          const actionButtonIcon = isSelectedGuardian ? (
            <CheckCircleOutlineIcon data-testid={'selected-guardian-icon'} />
          ) : (
            <RadioButtonUncheckedIcon data-testid={'unselected-guardian-icon'} />
          );

          selectedGuardianCell = (
            <TableCell align='center'>
              <Typography data-testid={`guardian-${g.address}-selected-status`}>
                <IconButton data-testid={actionButtonTestId} onClick={actionButtonOnClick} disabled={!enabled}>
                  {actionButtonIcon}
                </IconButton>
              </Typography>
            </TableCell>
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
    [guardianSelectionMode, guardiansTableTranslations, onGuardianSelect, selectedGuardian],
  );

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');

  const sortedGuardians = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian)),
    [guardians, selectedGuardian],
  );

  const tableRows = useMemo(() => {
    return sortedGuardians.map((g, idx) => {
      const extraStyle = hasSelectedGuardian && selectedGuardian === g.address ? selectedGuardianRowStyle : null;
      return (
        <TableRow style={extraStyle} data-testid={`guardian-${g.address}`} key={g.name} hover>
          <TableCell data-testid={`guardian-${g.address}-name`}>
            <NameBox>
              <Jazzicon diameter={40} seed={jsNumberForAddress(g.address)} />
              <NameContainer>{g.name}</NameContainer>
            </NameBox>
          </TableCell>
          <TableCell data-testid={`guardian-${g.address}-address`} style={{ fontFamily: 'monospace' }}>
            {g.address}
          </TableCell>
          <TableCell align='center'>
            <a
              data-testid={`guardian-${g.address}-website`}
              href={getWebsiteAddress(g.website)}
              target='_blank'
              rel='noopener noreferrer'
            >
              <SvgIcon component={GlobeIcon} />
            </a>
          </TableCell>
          <TableCell data-testid={`guardian-${g.address}-stake`} align='center'>
            {asPercent(g.stakePercent)}
          </TableCell>
          <TableCell data-testid={`guardian-${g.address}-voted`} align='center'>
            {g.voted ? (
              <YesContainer>{guardiansTableTranslations('didVote_yes')}</YesContainer>
            ) : (
              <NoContainer>{guardiansTableTranslations('didVote_no')}</NoContainer>
            )}
          </TableCell>
          {addSelectionColumn && getSelectedGuardianCell(g, idx)}
        </TableRow>
      );
    });
  }, [
    addSelectionColumn,
    getSelectedGuardianCell,
    guardiansTableTranslations,
    hasSelectedGuardian,
    selectedGuardian,
    sortedGuardians,
  ]);

  // TODO : O.L : FUTURE : Consider using a 3rd party MUI table component
  return (
    <TableContainer component={Paper} style={extraStyle}>
      <Table data-testid={tableTestId}>
        <StyledTableHead>
          <TableRow>
            <TableCell>{guardiansTableTranslations('columnHeader_name')}</TableCell>
            <TableCell>{guardiansTableTranslations('columnHeader_address')}</TableCell>
            <TableCell align='center'>{guardiansTableTranslations('columnHeader_website')}</TableCell>
            <TableCell align='center'>
              {guardiansTableTranslations('columnHeader_stakingPercentageInLastElections')}
            </TableCell>
            <TableCell align='center'>{guardiansTableTranslations('columnHeader_votedInLastElection')}</TableCell>
            {addSelectionColumn && (
              <TableCell align='center'>{guardiansTableTranslations('columnHeader_selection')}</TableCell>
            )}
          </TableRow>
        </StyledTableHead>
        <StyledTableBody>{tableRows}</StyledTableBody>
      </Table>
    </TableContainer>
  );
});

function compareGuardiansBySelectedAndThenStake(
  a: TGuardianInfoExtended,
  b: TGuardianInfoExtended,
  selectedGuardianAddress: string,
) {
  if (a.address === selectedGuardianAddress) {
    return -1;
  } else if (b.address === selectedGuardianAddress) {
    return 11;
  } else {
    return b.stakePercent - a.stakePercent;
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
  } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();

  const classes = useStyles();
  const theme = useTheme();

  const getGuardianSelectionCellContent = useCallback(
    (g: TGuardianInfoExtended) => {
      let selectedGuardianCell = null;

      const actionButtonTestId = selectActionButtonTestIdFromAddress(g.address);
      const actionButtonOnClick = () => onGuardianSelect(g);

      switch (guardianSelectionMode) {
        case 'Select':
          selectedGuardianCell = (
            // <TableCell align='center'>
              <SelectButton
                variant='contained'
                size='small'
                // disabled={g.address === selectedGuardian}
                data-testid={actionButtonTestId}
                onClick={actionButtonOnClick}
              >
                {guardiansTableTranslations(g.address === selectedGuardian ? 'action_keep' : 'action_select')}
              </SelectButton>
            // </TableCell>
          );
          break;
        case 'Change':
          const isSelectedGuardian = g.address === selectedGuardian;

          const enabled = !!onGuardianSelect;
          const actionButtonIcon = isSelectedGuardian ? (
            <CheckCircleOutlineIcon data-testid={'selected-guardian-icon'} />
          ) : (
            <RadioButtonUncheckedIcon data-testid={'unselected-guardian-icon'} />
          );

          selectedGuardianCell = (
            // <TableCell align='center'>
              <Typography data-testid={`guardian-${g.address}-selected-status`}>
                <IconButton data-testid={actionButtonTestId} onClick={actionButtonOnClick} disabled={!enabled}>
                  {actionButtonIcon}
                </IconButton>
              </Typography>
            // </TableCell>
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
    [guardianSelectionMode, guardiansTableTranslations, onGuardianSelect, selectedGuardian],
  );

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');

  const sortedGuardians = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian)),
    [guardians, selectedGuardian],
  );

  const columns: Column<TGuardianInfoExtended>[] = [
    {
      title: guardiansTableTranslations('columnHeader_name'),
      field: 'name',
      render: (extendedGuardianInfo) => (
        <NameBox data-testid={`guardian-${extendedGuardianInfo.address}`}>
          <Jazzicon diameter={40} seed={jsNumberForAddress(extendedGuardianInfo.address)} />
          <NameContainer>
            <Typography>{extendedGuardianInfo.name}</Typography>
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
      render: (extendedGuardianInfo) => (
        <Typography style={{ fontFamily: 'monospace', textAlign: 'center' }}>{extendedGuardianInfo.address}</Typography>
      ),
      // TODO : FUTURE : O.L : Adding "fontFamily: 'monospace'" to the cell makes the Typography text larger and better, understand whats going on.
      cellStyle: {
        fontFamily: 'monospace',
      },
    },
    {
      title: guardiansTableTranslations('columnHeader_website'),
      field: 'website',
      render: (extendedGuardianInfo) => (
        <a
          data-testid={`guardian-${extendedGuardianInfo.address}-website`}
          href={getWebsiteAddress(extendedGuardianInfo.website)}
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
      render: (extendedGuardianInfo) => (
        <Typography variant={'button'}>{asPercent(extendedGuardianInfo.stakePercent)}</Typography>
      ),
      cellStyle: {
        textAlign: 'center',
      },
      defaultSort: 'desc',
    },
    {
      title: guardiansTableTranslations('columnHeader_votedInLastElection'),
      field: 'voted',
      render: (extendedGuardianInfo) => {
        const textColor = extendedGuardianInfo.voted ? yesColor : noColor;
        const text = extendedGuardianInfo.voted
          ? guardiansTableTranslations('didVote_yes')
          : guardiansTableTranslations('didVote_no');

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

  // TODO : O.L : FUTURE : Consider using a 3rd party MUI table component
  return (
    <MaterialTable
      title={tableTitle || ''}
      columns={columns}
      data={sortedGuardians}
      icons={TABLE_ICONS}
      style={{ overflowX: 'auto' }}
      options={{
        padding: densePadding? 'dense' : 'default',
        pageSizeOptions: [5],

        rowStyle: (TGuardianInfoExtended) => ({
          backgroundColor: TGuardianInfoExtended.address === selectedGuardian ? 'rgba(10, 10, 10, 1)' : 'rgba(33,33, 33, 0.55)',
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
