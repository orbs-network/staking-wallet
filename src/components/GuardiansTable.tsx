import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@material-ui/core';
import React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import styled from 'styled-components';
import { EMPTY_ADDRESS } from '../constants';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { IGuardianInfo } from 'orbs-pos-data';

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

interface IProps {
  guardians: TGuardianInfoExtended[];
  selectedGuardian?: string;
  onGuardianSelect?: (guardian: TGuardianInfoExtended) => void;
}

export const GuardiansTable = React.memo<IProps>(({ guardians, onGuardianSelect, selectedGuardian }) => {
  const { t } = useTranslation();

  const sortedGuardians = useMemo(
    () => guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian)),
    [guardians, selectedGuardian],
  );

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;

  function getSelectedGuardianCell(g: TGuardianInfoExtended, idx: number) {
    if (hasSelectedGuardian) {
      const isSelectedGuardian = g.address === selectedGuardian;

      const enabled = !!onGuardianSelect;
      const actionButtonOnClick = () => onGuardianSelect(g);
      const actionButtonIcon = isSelectedGuardian ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />;

      return (
        <TableCell align='center'>
          <Typography data-testid={`guardian-${g.address}-selected-status`}>
            <IconButton onClick={actionButtonOnClick} disabled={!enabled}>
              {actionButtonIcon}
            </IconButton>
          </Typography>
        </TableCell>
      );
    }

    return null;
  }

  return (
    <Paper>
      <Table data-testid={'guardians-table'}>
        <TableHead>
          <TableRow>
            <TableCell>{t('Name')}</TableCell>
            <TableCell>{t('Address')}</TableCell>
            <TableCell align='center'>{t('Website')}</TableCell>
            <TableCell align='center'>{t('Stake')}</TableCell>
            <TableCell align='center'>{t('Voted')}</TableCell>
            {(onGuardianSelect || hasSelectedGuardian) && <TableCell align='center'>{t('Selection')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedGuardians.map((g, idx) => (
            <TableRow data-testid={`guardian-${g.address}`} key={g.name} hover>
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
              {getSelectedGuardianCell(g, idx)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
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
