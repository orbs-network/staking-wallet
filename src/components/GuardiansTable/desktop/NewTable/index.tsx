import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IBaseTableProps, IGroupedGuardian } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import Address from './Address';
import Website from './Website';
import RewardPercentage from './reward-percentage';
import { useAlertsTranslations, useGuardiansTableTranslations } from '../../../../translations/translationsHooks';
import EffectiveStake from './effective-stake';
import Participation from './participation';
import Capacity from './capacity';
import Qualifications from './qualifications';
import Selection from './selection';
import { EMPTY_ADDRESS } from '../../../../constants';
import copy from 'copy-to-clipboard';
import CustomSnackbar from '../../../snackbar/custom-snackbar';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  nameRow: { maxWidth: '14vw', paddingRight: 30 },
  multipleGuardiansCell: {
    verticalAlign: 'top',
  },
  multipleGuardiansCellContent: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
  },
}));

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
}

export default function SpanningTable(props: IProps) {
  const {
    groupedGuardians,
    guardiansToDelegatorsCut,
    committeeMembers,
    selectedGuardian,
    onGuardianSelect,
    guardianSelectionMode,
    mainAddress,
    disableSelection,
    isGuardian,
  } = props;

  const theme = useTheme();
  const classes = useStyles();
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const alertsTranslations = useAlertsTranslations();
  const [order, setOrder] = React.useState<any>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('calories');

  const copyAddress = useCallback((value: string) => {
    copy(value);
    setShowSnackbar(true);
  }, []);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Rewards</TableCell>
            <TableCell>Effective stake</TableCell>
            <TableCell>Participation</TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedGuardians.map((group: IGroupedGuardian) => {
            const { guardians } = group;
            const selectedChainGuardian = guardians.find((g) => g.selectedChain);
            const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
            const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
            const rowSpan = guardians.length + 1;
            return (
              <>
                <TableRow>
                  <TableCell rowSpan={rowSpan} className={guardians.length > 1 ? classes.multipleGuardiansCell : ''}>
                    {addSelectionColumn && selectedChainGuardian && (
                      <Selection
                        guardiansTableTranslations={guardiansTableTranslations}
                        onGuardianSelect={onGuardianSelect}
                        selectedGuardian={selectedGuardian}
                        guardianSelectionMode={guardianSelectionMode}
                        theme={theme}
                        disableSelection={disableSelection}
                        isGuardian={isGuardian}
                        mainAddress={mainAddress}
                        guardian={selectedChainGuardian}
                      />
                    )}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className={guardians.length > 1 ? classes.multipleGuardiansCell : ''}>
                    {selectedChainGuardian && (
                      <div className={guardians.length > 1 ? classes.multipleGuardiansCellContent : ''}>
                        <Qualifications
                          address={selectedChainGuardian.EthAddress}
                          guardian={selectedChainGuardian}
                          committeeMembers={committeeMembers}
                        />
                      </div>
                    )}
                  </TableCell>

                  <TableCell
                    rowSpan={rowSpan}
                    className={`${classes.nameRow} ${guardians.length > 1 ? classes.multipleGuardiansCell : ''}`}
                  >
                    <div className={guardians.length > 1 ? classes.multipleGuardiansCellContent : ''}>
                      {guardians[0].Name}
                    </div>
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className={guardians.length > 1 ? classes.multipleGuardiansCell : ''}>
                    <div className={guardians.length > 1 ? classes.multipleGuardiansCellContent : ''}>
                      <Website address={guardians[0].EthAddress} website={guardians[0].Website} />
                    </div>
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className={guardians.length > 1 ? classes.multipleGuardiansCell : ''}>
                    <div className={guardians.length > 1 ? classes.multipleGuardiansCellContent : ''}>
                      <Address address={guardians[0].EthAddress} copyAddress={copyAddress} />
                    </div>
                  </TableCell>
                </TableRow>
                {guardians.map((guardian: Guardian, index: number) => {
                  const {
                    EthAddress,
                    Website: website,
                    EffectiveStake: effectiveStake,
                    DelegatedStake,
                    SelfStake,
                    ParticipationPercentage: percentage,
                    Capacity: capacity,
                  } = guardian;
                  const guardianDelegatorCut = guardiansToDelegatorsCut[EthAddress];
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <RewardPercentage
                          guardianDelegatorCut={guardianDelegatorCut}
                          translation={guardiansTableTranslations}
                        />
                      </TableCell>
                      <TableCell>
                        <EffectiveStake
                          selfStake={SelfStake}
                          effectiveStake={effectiveStake}
                          delegatedStake={DelegatedStake}
                          translation={guardiansTableTranslations}
                        />
                      </TableCell>
                      <TableCell>
                        <Participation percentage={percentage} translation={guardiansTableTranslations} />
                      </TableCell>
                      <TableCell>
                        <Capacity
                          translation={guardiansTableTranslations}
                          selfStake={SelfStake}
                          delegatedStake={DelegatedStake}
                          capacity={capacity}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            );
          })}
        </TableBody>
      </Table>
      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
      />
    </Paper>
  );
}
