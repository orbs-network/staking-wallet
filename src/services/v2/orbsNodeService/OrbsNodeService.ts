import { IOrbsNodeService } from './IOrbsNodeService';
import Web3 from 'web3';
import { fetchJson } from './nodeResponseProcessing/helpers';
import { Model } from './model';
import { updateModel } from './nodeResponseProcessing/processor-public';
import RootNodeData from '../../../local/StatusResponse.json';

const MAIN_NET_DEFAULT_NODE_URL = 'http://34.255.138.28';
const ManagementStatusSuffix = '/services/management-service/status';
// TODO : O.L : Consider using httpService
export class OrbsNodeService implements IOrbsNodeService {
  constructor(private defaultNodeUrl: string = MAIN_NET_DEFAULT_NODE_URL) {}

  async readAndProcessModel(nodeAddress?: string): Promise<Model> {
    const nodeUrl = nodeAddress || this.defaultNodeUrl;
    const model = new Model();
    // TODO : ORL : Fix CORS and then return this read.
    // const rootNodeData = await fetchJson(`${nodeUrl}${ManagementStatusSuffix}`);
    const rootNodeData = RootNodeData;
    updateModel(model, rootNodeData);

    return model;
  }
}
