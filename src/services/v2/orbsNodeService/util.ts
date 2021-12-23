import { IManagementStatus } from './nodeResponseProcessing/RootNodeData';
import { Guardian, SystemState } from './systemState';
import { getSortedChains } from '../../../utils/web3';
import { IGuardiansDictionary, IGroupedGuardiansByNetwork, IProcessedSystemState } from './OrbsNodeTypes';
import { updateSystemState } from './nodeResponseProcessing/processor-public';

interface IGuardiansByChains {
  [key: number]: Guardian[];
}

const createSystemStates = (allManagementStatuses: IManagementStatus[], selectedChain: number) => {
  const states: IProcessedSystemState[] = [];
  const { result } = allManagementStatuses.find((m) => m.chain === selectedChain);
  allManagementStatuses.forEach((status) => {
    const { chain, result } = status;
    const state = new SystemState();
    const timeStamp = Math.floor(Date.now() / 1000);
    updateSystemState(state, result, timeStamp);
    states.push({ chain, state });
  });
  const selectedChainState = states.find((s: IProcessedSystemState) => s.chain === selectedChain).state;
  return { states, selectedChainState, committeeMembers: result.Payload.CurrentCommittee };
};

const sortStates = (states: IProcessedSystemState[], selectedChain: number) => {
  const selectedState = states.find((c: IProcessedSystemState) => c.chain === selectedChain);
  const index = states.findIndex((c: IProcessedSystemState) => c.chain === selectedChain);
  states.splice(index, 1);
  states.unshift(selectedState);
  return states;
};

const createGuardiansByChains = (
  states: IProcessedSystemState[],
): { guardiansByChains: IGuardiansByChains; allGuardians: Guardian[] } => {
  const guardiansByChains: IGuardiansByChains = {};
  let allGuardians: Guardian[] = [];

  states.forEach(({ state, chain }) => {
    const guardians = [...Object.values(state.CommitteeNodes), ...Object.values(state.StandByNodes)];
    allGuardians = [...allGuardians, ...guardians];
    guardiansByChains[chain] = guardians;
  });

  return { guardiansByChains, allGuardians };
};

const handleNetworks = (networks: IGroupedGuardiansByNetwork[], guardian: Guardian, chain: string) => {
  return networks.map((network) => {
    if (network.chain === Number(chain)) {
      return {
        ...network,
        guardian,
      };
    }
    return network;
  });
};

const createNetworks = (selectedChain: number) => {
  const networks: IGroupedGuardiansByNetwork[] = [];
  const chains: number[] = getSortedChains(selectedChain);

  for (const chain of chains) {
    networks.push({ chain, guardian: null });
  }
  return networks;
};

const groupGuardiansByNetworks = (states: IProcessedSystemState[], selectedChain: number) => {
  const sortedStates = sortStates(states, selectedChain);

  const { guardiansByChains, allGuardians } = createGuardiansByChains(sortedStates);

  const groupedGuardiansByNetwork: { [key: string]: IGuardiansDictionary } = {};
  const networks = createNetworks(selectedChain);

  for (const guardian of allGuardians) {
    groupedGuardiansByNetwork[guardian.EthAddress] = {
      networks,
      Name: '',
      EthAddress: '',
      Website: '',
      EffectiveStake: 0,
      ParticipationPercentage: 0,
      Capacity: 0,
    };
  }

  for (const chain in guardiansByChains) {
    const guardians = guardiansByChains[chain];

    for (const guardian of guardians) {
      const { EthAddress, EffectiveStake, ParticipationPercentage, Capacity } = guardian;
      const { networks, Name, Website } = groupedGuardiansByNetwork[EthAddress];

      groupedGuardiansByNetwork[EthAddress] = {
        EthAddress,
        EffectiveStake: Number(chain) === selectedChain ? EffectiveStake : 0,
        ParticipationPercentage: Number(chain) === selectedChain ? ParticipationPercentage : 0,
        Capacity: Number(chain) === selectedChain ? Capacity : 0,
        Name: Name || guardian.Name,
        Website: Website || guardian.Website,
        networks: handleNetworks(networks, guardian, chain),
      };
    }
  }

  return { groupedGuardiansByNetwork, allGuardians };
};

export { groupGuardiansByNetworks, createSystemStates };
