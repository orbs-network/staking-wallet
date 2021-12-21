import { IOrbsNodeService } from './IOrbsNodeService';
import Web3 from 'web3';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { Guardian, SystemState } from './systemState';
import { updateSystemState } from './nodeResponseProcessing/processor-public';
import { IProcessedSystemState, IReadAndProcessResults } from './OrbsNodeTypes';
import { IManagementStatus } from './nodeResponseProcessing/RootNodeData';
import Moment from 'moment';
import errorMonitoring from '../../error-monitoring';
import _ from 'lodash';
import { IGroupedGuardian } from '../../../components/GuardiansTable/interfaces';

// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(
    private defaultStatusUrls: { chain: number; managementServiceStatusPageUrl: string; selected: boolean }[],
  ) {}
  checkIfDefaultNodeIsInSync(managementStatusResponse: IManagementStatus): boolean {
    return this.checkIfNodeIsInSync(managementStatusResponse);
  }

  checkIfNodeIsInSync(managementStatusResponse: IManagementStatus): boolean {
    const result = managementStatusResponse.result;
    try {
      const currentTimestamp = Moment().unix();

      const ACCEPTED_RANGE_IN_SECONDS = 60 * 60; // 60 minutes
      const earliestAcceptedTimestamp = currentTimestamp - ACCEPTED_RANGE_IN_SECONDS;

      const nodeRefTime = result.Payload.CurrentRefTime;
      const isManagementServiceReferenceFresh = nodeRefTime >= earliestAcceptedTimestamp;
      const isManagementServiceError = result.Error?.length > 0;

      const checkNodeSync = process.env.CHECK_NODE_SYNC && process.env.CHECK_NODE_SYNC.toLowerCase().trim() === 'true';
      const isNodeInSync = !checkNodeSync || (isManagementServiceReferenceFresh && !isManagementServiceError);

      return isNodeInSync;
    } catch (e) {
      const { sections, captureException } = errorMonitoring;
      captureException(e, sections.orbsNodeStore, 'error in function: checkIfNodeIsInSync');
      console.error(`Error while getting node  status: ${e}`);
      return false;
    }
  }

  readAndProcessSystemState(
    selectedNetworkManagementStatus: IManagementStatus,
    allManagementStatuses: IManagementStatus[],
  ): IReadAndProcessResults {
    const result = selectedNetworkManagementStatus.result;
    const systemState = new SystemState();
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    updateSystemState(systemState, result, currentTimeStamp);

    const getAllGuardians = () => {
      const states: IProcessedSystemState[] = [];
      allManagementStatuses.forEach((status) => {
        const { chain, result, selected } = status;
        const state = new SystemState();
        const timeStamp = Math.floor(Date.now() / 1000);
        updateSystemState(state, result, timeStamp);
        states.push({ chain, state, selected });
      });

      let committeeNodes: Guardian[] = [];
      let nonCommitteeGuardians: Guardian[] = [];
      states.forEach(({ state, chain, selected }) => {
        const nodes = Object.values(state.CommitteeNodes).map((g: Guardian) => {
          return {
            ...g,
            chain,
            selectedChain: selected,
          };
        });
        committeeNodes = [...committeeNodes, ...nodes];
        const standByNodes = Object.values(state.StandByNodes).map((g: Guardian) => {
          return {
            ...g,
            chain,
            selectedChain: selected,
          };
        });
        nonCommitteeGuardians = [...nonCommitteeGuardians, ...standByNodes];
      });

      const allGuardians = [...committeeNodes, ...nonCommitteeGuardians];
      return { allGuardians, committeeNodes, nonCommitteeGuardians };
    };

    const { allGuardians } = getAllGuardians();

    const groupGuardians = (): IGroupedGuardian[] => {
      const grouped = Object.values(_.groupBy(allGuardians, 'EthAddress'));
      const result = grouped.map((guardians: Guardian[]) => {
        return {
          EthAddress: guardians[0].EthAddress,
          guardians,
          EffectiveStake: guardians.reduce(function (acc, obj) {
            return acc + obj.EffectiveStake;
          }, 0),
        };
      });
      return result;
    };

    return {
      systemState,
      committeeMembers: result.Payload.CurrentCommittee,
      allChainGroupedGuardians: groupGuardians(),
      // committeeNodes,
      // nonCommitteeGuardians
    };
  }

  async fetchNodeManagementStatus(): Promise<IManagementStatus[]> {
    const statusUrls = this.defaultStatusUrls;
    try {
      const res = await Promise.all(
        statusUrls.map(async (u) => {
          const { chain, selected } = u;
          return {
            chain,
            selected,
            result: await fetchJson(u.managementServiceStatusPageUrl),
          };
        }),
      );

      return res;
    } catch (error) {
      const { sections, captureException } = errorMonitoring;
      captureException(error, sections.orbsNodeStore, 'error in function: fetchNodeManagementStatus');
    }
  }
}
