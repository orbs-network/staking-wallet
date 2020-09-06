import { Model } from './model';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessModel(nodeAddress?: string): Promise<IReadAndProcessResults>;
  checkIfDefaultNodeIsInSync(): Promise<boolean>;
  checkIfNodeIsInSync(nodeAddress: string): Promise<boolean>;
}
