export interface IDelegationsService {
  readDelegation(forAddress: string): Promise<string>;
}
