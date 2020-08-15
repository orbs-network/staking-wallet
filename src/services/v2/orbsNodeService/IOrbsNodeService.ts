import { Model } from './model';

export interface IOrbsNodeService {
  readAndProcessModel(nodeAddress?: string): Promise<Model>;
}