import { IOrbsNodeService } from './IOrbsNodeService';
import Web3 from 'web3';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { Model } from './model';
import { updateModel } from './nodeResponseProcessing/processor-public';
import RootNodeData from '../../../local/StatusResponse.json';
import { ICommitteeMemberData, IReadAndProcessResults } from './OrbsNodeTypes';
import { IRootNodeData } from './nodeResponseProcessing/RootNodeData';
import { IEthereumWriterStatusResponse } from './nodeResponseProcessing/EthereumWriterStatusResponse';
import Moment from 'moment';

const MAIN_NET_DEFAULT_NODE_URL = 'http://34.255.138.28';
const ManagementStatusSuffix = '/services/management-service/status';
const EthereumWriterStatusSuffix = '/services/ethereum-writer/status';

// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(private defaultNodeUrl: string = MAIN_NET_DEFAULT_NODE_URL) {}

  public get defaultNodeAddress(): string {
    return this.defaultNodeUrl;
  }

  async checkIfDefaultNodeIsInSync(): Promise<boolean> {
    return this.checkIfNodeIsInSync(this.defaultNodeUrl);
  }

  async checkIfNodeIsInSync(nodeAddress: string): Promise<boolean> {
    try {
      const rootNodeData: IRootNodeData = await this.fetchNodeManagementStatus(nodeAddress);
      const ethereumWriterStatusResponse: IEthereumWriterStatusResponse = await this.fetchNodeEthereumWriterStatus(
        nodeAddress,
      );

      const isEthereumWriterInSync = ethereumWriterStatusResponse.Payload.VchainSyncStatus === 'in-sync';

      const currentTimestamp = Moment().unix();

      const ACCEPTED_RANGE_IN_SECONDS = 60 * 60; // 60 minutes
      const earliestAcceptedTimestamp = currentTimestamp - ACCEPTED_RANGE_IN_SECONDS;

      const nodeRefTime = rootNodeData.Payload.CurrentRefTime;
      const isManagementServiceReferenceFresh = nodeRefTime >= earliestAcceptedTimestamp;

      const isNodeInSync = isManagementServiceReferenceFresh && isEthereumWriterInSync;

      return isNodeInSync;
    } catch (e) {
      console.error(`Error while getting node ${nodeAddress} status: ${e}`);
      return false;
    }
  }

  async readAndProcessModel(nodeAddress?: string): Promise<IReadAndProcessResults> {
    const nodeUrl = nodeAddress || this.defaultNodeUrl;
    const model = new Model();

    const rootNodeData = await this.fetchNodeManagementStatus(nodeUrl);

    updateModel(model, rootNodeData);

    return {
      model,
      committeeMembers: rootNodeData.Payload.CurrentCommittee,
    };
  }

  private async fetchNodeManagementStatus(nodeAddress: string): Promise<IRootNodeData> {
    const rootNodeData: IRootNodeData = await fetchJson(`${nodeAddress}${ManagementStatusSuffix}`);
    return rootNodeData;
  }

  private async fetchNodeEthereumWriterStatus(nodeAddress: string): Promise<IEthereumWriterStatusResponse> {
    const rootNodeData: IEthereumWriterStatusResponse = await fetchJson(`${nodeAddress}${EthereumWriterStatusSuffix}`);
    return rootNodeData;
  }
}
