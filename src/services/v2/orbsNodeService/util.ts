import { Guardian } from './systemState';
import { getSupportedChains } from '../../../utils/web3';

interface INetworks {
  [key: number]: Guardian;
}

const createGuardianObject = (guardian: Guardian) => {
  const chains: number[] = getSupportedChains();
  const networks: INetworks = {};
  chains.forEach((chain) => {
    networks[chain] = guardian;
  });
  return {
    EthAddress: '',
    networks,
  };
};

const updateGuardiansDictionary = (obj, g: Guardian, network: number) => {
  const networks = obj[g.EthAddress].networks;
  obj[g.EthAddress] = {
    EthAddress: g.EthAddress,
    networks: {
      ...networks,
      [network]: {
        Name: g.Name,
        Website: g.Website,
        EffectiveStake: g.EffectiveStake,
        IsCertified: g.IsCertified,
        DelegatedStake: g.DelegatedStake,
        Capacity: g.Capacity,
        ParticipationPercentage: g.ParticipationPercentage,
        SelfStake: g.SelfStake,
      },
    },
  };
};

const fillGuardiansDictionary = (obj, guardians: { [key: string]: Guardian }, network: number) => {
  Object.values(guardians).forEach((guardian: Guardian) => {
    const guardianObject = obj[guardian.EthAddress];
    if (!guardianObject) {
      const elem = createGuardianObject(guardian);
      obj[guardian.EthAddress] = elem;
      updateGuardiansDictionary(obj, guardian, network);
    } else {
      updateGuardiansDictionary(obj, guardian, network);
    }
  });
};

const createGuardiansDictionary = (guardiansByChains: { [key: number]: Guardian[] }) => {
  const dictionary: any = {};
  const chains: number[] = getSupportedChains();
  for (const property in guardiansByChains) {
      
    
  }
};

export { fillGuardiansDictionary, createGuardiansDictionary };
