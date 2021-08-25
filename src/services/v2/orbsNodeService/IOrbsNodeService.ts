import { IManagementStatusResponse } from './nodeResponseProcessing/RootNodeData';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessSystemState(managementStatusResponse: IManagementStatusResponse): IReadAndProcessResults;
  checkIfDefaultNodeIsInSync(managementStatusResponse: IManagementStatusResponse): boolean;
  checkIfNodeIsInSync(managementStatusResponse: IManagementStatusResponse): boolean;
  fetchNodeManagementStatus(): Promise<IManagementStatusResponse>;
}
