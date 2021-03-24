import { SystemState } from './systemState';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessSystemState(nodeAddress?: string): Promise<IReadAndProcessResults>;
  checkIfDefaultNodeIsInSync(): Promise<boolean>;
  checkIfNodeIsInSync(nodeAddress: string): Promise<boolean>;
}
