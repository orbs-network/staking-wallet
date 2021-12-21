import { IManagementStatusResponse, IManagementStatus } from './nodeResponseProcessing/RootNodeData';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessSystemState(
    managementStatusResponse: IManagementStatus,
    allManagementStatuses: IManagementStatus[],
  ): IReadAndProcessResults;
  checkIfDefaultNodeIsInSync(managementStatusResponse: IManagementStatus): boolean;
  checkIfNodeIsInSync(managementStatusResponse: IManagementStatus): boolean;
  fetchNodeManagementStatus(): Promise<IManagementStatus[]>;
}
