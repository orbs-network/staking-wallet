import { IOrbsNodeService } from './IOrbsNodeService';
import Web3 from 'web3';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { SystemState } from './systemState';
import { updateSystemState } from './nodeResponseProcessing/processor-public';
import { ICommitteeMemberData, IReadAndProcessResults } from './OrbsNodeTypes';
import { IManagementStatusResponse } from './nodeResponseProcessing/RootNodeData';
import Moment from 'moment';

const ManagementServiceStatusPageUrl = process.env.URL_MGMT_SERV || 'http://localhost:7666/status';
// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(private defaultStatusUrl: string = ManagementServiceStatusPageUrl) {}

  async checkIfDefaultNodeIsInSync(): Promise<boolean> {
    return this.checkIfNodeIsInSync(this.defaultStatusUrl);
  }

  async checkIfNodeIsInSync(nodeAddress: string): Promise<boolean> {
    try {
      const managementStatusResponse: IManagementStatusResponse = await this.fetchNodeManagementStatus(nodeAddress);

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
      console.error(`Error while getting node ${nodeAddress} status: ${e}`);
      return false;
    }
  }

  async readAndProcessSystemState(nodeAddress?: string): Promise<IReadAndProcessResults> {
    const nodeUrl = nodeAddress || this.defaultStatusUrl;
    const systemState = new SystemState();

    const managementStatusResponse = await this.fetchNodeManagementStatus(nodeUrl);

    const currentTimeStamp = Math.floor(Date.now() / 1000);
    updateSystemState(systemState, managementStatusResponse, currentTimeStamp);

    return {
      systemState,
      committeeMembers: managementStatusResponse.Payload.CurrentCommittee,
    };
  }

  private async fetchNodeManagementStatus(statusUrl: string): Promise<IManagementStatusResponse> {
    return await fetchJson(statusUrl);
  }
}
