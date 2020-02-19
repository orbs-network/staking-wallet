import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import styled from 'styled-components';
import { EMPTY_ADDRESS } from '../constants';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { selectActionButtonTestIdFromAddress } from '../__tests__/components/guardians/guardiansTestUtils';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

const getWebsiteAddress = (url: string) => (url.toLowerCase().indexOf('http') === 0 ? url : `http://${url}`);

const SelectButton = styled(Button)`
  min-width: 130px;
`;

const NameBox = styled.div`
  display: flex;
  align-items: center;
`;

const YesContainer = styled.span`
  color: #00ff11;
`;

const NoContainer = styled.span`
  color: red;
`;

const NameContainer = styled.span(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

type TGuardianSelectionMode = 'Select' | 'Change' | 'None';

interface IProps {
  guardianSelectionMode: TGuardianSelectionMode;
  guardians: TGuardianInfoExtended[];
  selectedGuardian?: string;
  onGuardianSelect?: (guardian: TGuardianInfoExtended) => void;
  tableTestId?: string;
}

export const GuardiansTable = React.memo<IProps>(
  ({ guardianSelectionMode, guardians, onGuardianSelect, selectedGuardian, tableTestId }) => {
    const { t } = useTranslation();

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
                  {t(g.address === selectedGuardian ? 'Keep' : 'Select')}
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
      [guardianSelectionMode, onGuardianSelect, selectedGuardian, t],
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
        // TODO : ORL : Pick a better color for marking selected guardian
        const extraStyle = hasSelectedGuardian && selectedGuardian === g.address ? { backgroundColor: '#1D0D0D' } : {};
        return (
          <TableRow style={extraStyle} data-testid={`guardian-${g.address}`} key={g.name} hover>
            <TableCell data-testid={`guardian-${g.address}-name`}>
              <NameBox>
                <Jazzicon diameter={40} seed={jsNumberForAddress(g.address)} />
                <NameContainer>{g.name}</NameContainer>
              </NameBox>
            </TableCell>
            <TableCell data-testid={`guardian-${g.address}-address`}>{g.address}</TableCell>
            <TableCell align='center'>
              <a
                data-testid={`guardian-${g.address}-website`}
                href={getWebsiteAddress(g.website)}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img src='/assets/globe.svg' />
              </a>
            </TableCell>
            <TableCell data-testid={`guardian-${g.address}-stake`} align='center'>
              {asPercent(g.stakePercent)}
            </TableCell>
            <TableCell data-testid={`guardian-${g.address}-voted`} align='center'>
              {g.voted ? <YesContainer>Yes</YesContainer> : <NoContainer>No</NoContainer>}
            </TableCell>
            {addSelectionColumn && getSelectedGuardianCell(g, idx)}
          </TableRow>
        );
      });
    }, [addSelectionColumn, getSelectedGuardianCell, hasSelectedGuardian, selectedGuardian, sortedGuardians]);
    return (
      <Paper>
        <Table data-testid={tableTestId}>
          <TableHead>
            <TableRow>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Address')}</TableCell>
              <TableCell align='center'>{t('Website')}</TableCell>
              <TableCell align='center'>{t('Staking % in last elections')}</TableCell>
              <TableCell align='center'>{t('Voted in last election')}</TableCell>
              {addSelectionColumn && <TableCell align='center'>{t('Selection')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </Paper>
    );
  },
);

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
