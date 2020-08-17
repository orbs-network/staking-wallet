export interface IDelegationsService {
  readDelegation(fromAddress: string): Promise<string>;
}
