import { IOrbsNodeService } from './IOrbsNodeService';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { SystemState } from './systemState';
import { updateSystemState } from './nodeResponseProcessing/processor-public';
import { IReadAndProcessResults } from './OrbsNodeTypes';
import { IManagementStatus } from './nodeResponseProcessing/RootNodeData';
import Moment from 'moment';
import errorMonitoring from '../../error-monitoring';
import _ from 'lodash';
import { groupGuardiansByNetworks, createSystemStates } from './util';

// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(
    private defaultStatusUrls: { chain: number; managementServiceStatusPageUrl: string }[],
    private selectedChain: number,
  ) {}
  checkIfDefaultNodeIsInSync(managementStatusResponses: IManagementStatus[]): boolean {
    const selectedChainManagementStatus = managementStatusResponses.find((m) => this.selectedChain);
    return this.checkIfNodeIsInSync(selectedChainManagementStatus);
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
    allManagementStatuses: IManagementStatus[],
    minSelfStakePercentMille: number,
  ): IReadAndProcessResults {
    //return states = all chains system state, selectedChainState = state of the current chain,
    // committeeMembers = the commitee members of the selected chain
    const { states, selectedChainState, committeeMembers } = createSystemStates(
      allManagementStatuses,
      this.selectedChain,
      minSelfStakePercentMille,
    );

    //groupedGuardiansByNetwork = all the guardians sorted by network,
    // allGuardians = all the guardians of all chains in one array
    const { groupedGuardiansByNetwork, allGuardians } = groupGuardiansByNetworks(states, this.selectedChain);

    return {
      allNetworksGuardians: allGuardians,
      committeeMembers,
      committeeGuardians: Object.values(selectedChainState.CommitteeNodes),
      groupedGuardiansByNetwork,
    };
  }

  async fetchNodeManagementStatus(): Promise<IManagementStatus[]> {
    const statusUrls = this.defaultStatusUrls;
    try {
      const res = await Promise.all(
        statusUrls.map(async (u) => {
          const { chain } = u;
          return {
            chain,
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
