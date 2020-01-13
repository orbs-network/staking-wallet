import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@material-ui/core';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import styled from 'styled-components';

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
  const sortedGuardians = useMemo(() => guardians.slice().sort((a, b) => b.stake - a.stake), [guardians]);

  function getSelectedGuardianCell(g: TGuardianInfoExtended, idx: number) {
    if (onGuardianSelect) {
      return (
        <TableCell align='center'>
          <SelectButton
            variant='contained'
            size='small'
            disabled={g.address === selectedGuardian}
            data-testid={`guardian-${idx + 1}-select-action`}
            onClick={() => onGuardianSelect(g)}
          >
            {t(g.address === selectedGuardian ? 'Selected' : 'Select')}
          </SelectButton>
        </TableCell>
      );
    } else {
      if (selectedGuardian) {
        return (
          <TableCell align='center'>
            <Typography data-testid={`guardian-${idx + 1}-selected-status`}>
              {t(g.address === selectedGuardian ? 'Selected' : '-')}
            </Typography>
          </TableCell>
        );
      }
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
            {(onGuardianSelect || selectedGuardian) && <TableCell align='center'>{t('Selection')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedGuardians.map((g, idx) => (
            <TableRow data-testid={`guardian-${idx + 1}`} key={g.name} hover>
              <TableCell data-testid={`guardian-${idx + 1}-name`}>
                <NameBox>
                  <Jazzicon diameter={40} seed={jsNumberForAddress(g.address)} />
                  <NameContainer>{g.name}</NameContainer>
                </NameBox>
              </TableCell>
              <TableCell data-testid={`guardian-${idx + 1}-address`}>{g.address}</TableCell>
              <TableCell align='center'>
                <a
                  data-testid={`guardian-${idx + 1}-website`}
                  href={getWebsiteAddress(g.website)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img src='/assets/globe.svg' />
                </a>
              </TableCell>
              <TableCell data-testid={`guardian-${idx + 1}-stake`} align='center'>
                {asPercent(g.stake)}
              </TableCell>
              <TableCell data-testid={`guardian-${idx + 1}-voted`} align='center'>
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
