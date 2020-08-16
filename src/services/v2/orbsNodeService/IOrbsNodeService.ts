import { Model } from './model';
import { IReadAndProcessResults } from './OrbsNodeTypes';

export interface IOrbsNodeService {
  readAndProcessModel(nodeAddress?: string): Promise<IReadAndProcessResults>;
}
