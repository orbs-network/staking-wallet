import { AbiItem } from 'web3-utils';
import abi from './abi.json';

class ContractRegistry {
  contarct;
  constructor(web3: any, address: string) {
    this.contarct = new web3.eth.Contract(abi as AbiItem[], address);
  }

  getContract(name: string) {
    return this.contarct.methods.getContract(name).call();
  }

  async getContracts<T>(names: string[]): Promise<T> {
    const promises = names.map((name: string) => {
      return this.getContract(name);
    });

    const addresses = await Promise.all(promises);
    const result = {} as T;
    addresses.forEach((address: string, index: number) => {
      result[names[index]] = address;
    });
    return result;
  }
}

export default ContractRegistry;
