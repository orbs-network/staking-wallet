import { IManagementStatusResponse, IManagementStatus } from './nodeResponseProcessing/RootNodeData';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessSystemState(allManagementStatuses: IManagementStatus[]): IReadAndProcessResults;
  checkIfDefaultNodeIsInSync(managementStatusResponses: IManagementStatus[]): boolean;
  checkIfNodeIsInSync(managementStatusResponse: IManagementStatus): boolean;
  fetchNodeManagementStatus(): Promise<IManagementStatus[]>;
}
