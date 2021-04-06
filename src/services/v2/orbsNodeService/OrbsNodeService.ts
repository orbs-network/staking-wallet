import { IOrbsNodeService } from './IOrbsNodeService';
import Web3 from 'web3';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { SystemState } from './systemState';
import { updateSystemState } from './nodeResponseProcessing/processor-public';
import { IReadAndProcessResults } from './OrbsNodeTypes';
import { IManagementStatusResponse } from './nodeResponseProcessing/RootNodeData';
import Moment from 'moment';

const ManagementServiceStatusPageUrl = process.env.URL_MGMT_SERV || 'http://localhost:7666/status';
// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(private defaultStatusUrl: string = ManagementServiceStatusPageUrl) {}
  checkIfDefaultNodeIsInSync(managementStatusResponse: IManagementStatusResponse): boolean {
    return this.checkIfNodeIsInSync(managementStatusResponse);
  }

  checkIfNodeIsInSync(managementStatusResponse: IManagementStatusResponse): boolean {
    try {
      const currentTimestamp = Moment().unix();

      const ACCEPTED_RANGE_IN_SECONDS = 60 * 60; // 60 minutes
      const earliestAcceptedTimestamp = currentTimestamp - ACCEPTED_RANGE_IN_SECONDS;

      const nodeRefTime = managementStatusResponse.Payload.CurrentRefTime;
      const isManagementServiceReferenceFresh = nodeRefTime >= earliestAcceptedTimestamp;
      const isManagementServiceError = managementStatusResponse.Error?.length > 0;

      const checkNodeSync = process.env.CHECK_NODE_SYNC && process.env.CHECK_NODE_SYNC.toLowerCase().trim() === 'true';
      const isNodeInSync = !checkNodeSync || (isManagementServiceReferenceFresh && !isManagementServiceError);

      return isNodeInSync;
    } catch (e) {
      console.error(`Error while getting node ${this.defaultStatusUrl} status: ${e}`);
      return false;
    }
  }

  readAndProcessSystemState(managementStatusResponse: IManagementStatusResponse): IReadAndProcessResults {
    const systemState = new SystemState();

    const currentTimeStamp = Math.floor(Date.now() / 1000);
    updateSystemState(systemState, managementStatusResponse, currentTimeStamp);

    return {
      systemState,
      committeeMembers: managementStatusResponse.Payload.CurrentCommittee,
    };
  }

  async fetchNodeManagementStatus(): Promise<IManagementStatusResponse> {
    const statusUrl = this.defaultStatusUrl;

    return fetchJson(statusUrl);
  }
}
