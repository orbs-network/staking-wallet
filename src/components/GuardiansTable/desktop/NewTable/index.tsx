import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IBaseTableProps, IGroupedGuardian } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import Address from './Address'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}));

const sample = [
  { name: 'apple', detail: ['a', 'b', 'c', 'd'], test: '5' },
  { name: 'banana', detail: ['a', 'b'], test: '5' },
];

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
}

export default function SpanningTable(props: IProps) {
  const { groupedGuardians } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Eth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedGuardians.map((group: IGroupedGuardian) => {
            const { guardians } = group;
            const selectedChainGuardian = guardians.find((g: Guardian) => g.selectedChain);
            console.log({ guardians });
            return (
              <>
                <TableRow>
                  <TableCell rowSpan={guardians.length + 1}>{guardians[0].Name}</TableCell>
                </TableRow>
                {guardians.map((guardian: Guardian, index: number) => (
                  <TableRow key={index}>
                      <Address />
                    <TableCell>{guardian.EthAddress}</TableCell>
                  </TableRow>
                ))}
              </>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
