import { IGuardianInfo } from 'orbs-pos-data';
import * as React from 'react';
import { Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';
import { useMemo } from 'react';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

interface IProps {
  guardians: IGuardianInfo[];
}

export const GuardiansTable: React.FunctionComponent<IProps> = ({ guardians }) => {
  const sortedGuardians = useMemo(() => guardians.slice().sort((a, b) => b.stake - a.stake), [guardians]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Url</TableCell>
          <TableCell>Stake</TableCell>
          <TableCell>Voted</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedGuardians.map(g => (
          <TableRow key={g.name} hover>
            <TableCell>{g.name}</TableCell>
            <TableCell>{g.website}</TableCell>
            <TableCell>{asPercent(g.stake)}</TableCell>
            <TableCell>{g.voted.toString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
