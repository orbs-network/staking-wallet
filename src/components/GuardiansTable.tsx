import { IGuardianInfo } from 'orbs-pos-data/dist/orbs-pos-data-service';
import * as React from 'react';
import { Table, TableHead, TableCell, TableBody, TableRow, Typography } from '@material-ui/core';

const asPercent = (num: number) =>
  (num * 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + '%';

interface IProps {
  guardians: IGuardianInfo[];
}
export const GuardiansTable: React.FunctionComponent<IProps> = ({ guardians }) => (
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
      {guardians
        .sort((a, b) => b.stake - a.stake)
        .map(g => (
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
