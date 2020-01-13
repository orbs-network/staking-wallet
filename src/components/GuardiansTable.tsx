import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { TGuardianInfoExtended } from '../store/GuardiansStore';
import styled from 'styled-components';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

const getWebsiteAddress = (url: string) => (url.toLowerCase().indexOf('http') === 0 ? url : `http://${url}`);

const NameBox = styled.div`
  display: flex;
  align-items: center;
`;

const NameContainer = styled.span(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

interface IProps {
  guardians: TGuardianInfoExtended[];
  totalParticipatingTokens: number;
  onGuardianSelect?: (guardian: TGuardianInfoExtended) => void;
}

export const GuardiansTable = React.memo<IProps>(({ guardians, onGuardianSelect, totalParticipatingTokens }) => {
  const { t } = useTranslation();
  const sortedGuardians = useMemo(() => guardians.slice().sort((a, b) => b.stake - a.stake), [guardians]);

  return (
    <Paper>
      <div data-testid='total-participating-tokens'>{totalParticipatingTokens.toLocaleString()}</div>
      <Table data-testid={'guardians-table'}>
        <TableHead>
          <TableRow>
            <TableCell>{t('Name')}</TableCell>
            <TableCell>{t('Address')}</TableCell>
            <TableCell>{t('Url')}</TableCell>
            <TableCell>{t('Stake')}</TableCell>
            <TableCell>{t('Voted')}</TableCell>
            {onGuardianSelect && <TableCell>{t('Voted')}</TableCell>}
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
              <TableCell>
                <a
                  data-testid={`guardian-${idx + 1}-website`}
                  href={getWebsiteAddress(g.website)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img src='/assets/globe.svg' />
                </a>
              </TableCell>
              <TableCell data-testid={`guardian-${idx + 1}-stake`}>{asPercent(g.stake)}</TableCell>
              <TableCell data-testid={`guardian-${idx + 1}-voted`}>{g.voted ? 'Yes' : 'No'}</TableCell>
              {onGuardianSelect && (
                <TableCell>
                  <Button
                    variant='contained'
                    data-testid={`guardian-${idx + 1}-select-button`}
                    onClick={() => onGuardianSelect(g)}
                  >
                    {t('Select')}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
});
