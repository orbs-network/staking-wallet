/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/interface-name-prefix */
import _ from 'lodash';
// import { fetchJson, isStaleTime, getCurrentClockTime } from '../helpers';
import { SystemState, VirtualChain, Service, Guardians, HealthLevel, Guardian } from '../systemState';
import { getCurrentClockTime, isStaleTime } from './helpers';
import { generateNodeManagmentUrl, generateVirtualChainUrls } from './url-generator';
import { IManagementStatusResponse, IGuardianData } from './RootNodeData';

// DEV_NOTE : IMPORTANT: O.L : This file is taken from the 'Status-page' backend, we should unite them
// TODO : Extract the functionality to a library.
export enum NetworkType {
  Public = 'public',
  Private = 'private',
}

interface Configuration {
  Port: number;
  ProcessorPollTimeSeconds: number;
  NetworkType: NetworkType;
  RootNodeEndpoint: string;
  StaleStatusTimeSeconds: number;
  ExpirationWarningTimeInDays: number;
}

const defaultConfiguration = {
  Port: 80,
  ProcessorPollTimeSeconds: 5 * 60,
  NetworkType: NetworkType.Public,
  RootNodeEndpoint: 'http://34.255.138.28',
  StaleStatusTimeSeconds: 15 * 60,
  ExpirationWarningTimeInDays: 30,
};

export function updateSystemState(
  systemState: SystemState,
  rootNodeData: IManagementStatusResponse,
  currentTimestamp: number,
  minSelfStakePercentMille: number,
) {
  // const rootNodeData = await fetchJson(`${config.RootNodeEndpoint}${ManagementStatusSuffix}`);

  const virtualChainList = readVirtualChains(rootNodeData, defaultConfiguration);
  if (_.size(virtualChainList) === 0) {
    console.error(`Could not read valid Virtual Chains, current network seems not to be running any.`);
  }

  const services = [
    // choose the services that exist in a public network
    Service.Boyar,
    Service.Signer,
    Service.Management,
    Service.EthereumWriter,
    Service.Rewards,
  ];

  const guardians = extractGuardians(rootNodeData, currentTimestamp, minSelfStakePercentMille);
  const committeeMembersAddresses = _.map(rootNodeData.Payload.CurrentCommittee, 'EthAddress');

  const committeeMembers = _.pick(guardians, committeeMembersAddresses);
  if (_.size(committeeMembers) === 0) {
    console.error(`Could not read a valid Committee, current network seems empty.`);
  }
  const standbyMembersAddresses = _.map(rootNodeData.Payload.CurrentCandidates, 'EthAddress');

  const candidatesNotInStandby = _.map(
    _.filter(rootNodeData.Payload.CurrentCandidates, (data) => !data.IsStandby),
    'EthAddress',
  );
  const standByMembers = _.pick(guardians, standbyMembersAddresses);

  candidatesNotInStandby.forEach((it: string) => {
    standByMembers[it].isCandidateAndNotInStandby = true;
  });

  systemState.TimeSeconds = getCurrentClockTime();
  systemState.Timestamp = new Date().toISOString();
  systemState.VirtualChains = virtualChainList;
  systemState.Services = services;
  systemState.CommitteeNodes = committeeMembers;
  systemState.StandByNodes = standByMembers;
}

function readVirtualChains(rootNodeData: IManagementStatusResponse, config: Configuration): VirtualChain[] {
  return _.map(rootNodeData.Payload.CurrentVirtualChains, (vcData, vcId) => {
    const expirationTime = _.isNumber(vcData.Expiration) ? vcData.Expiration : -1;
    let healthLevel = HealthLevel.Green;
    let healthLevelToolTip = '';
    if (expirationTime > 0) {
      if (getCurrentClockTime() > expirationTime - config.ExpirationWarningTimeInDays * 24 * 60 * 60) {
        healthLevel = HealthLevel.Yellow;
        healthLevelToolTip = `VirtualChain will expire in less than ${config.ExpirationWarningTimeInDays} days.`;
      } else if (isStaleTime(expirationTime, 0)) {
        healthLevel = HealthLevel.Red;
        healthLevelToolTip = 'VirtualChain expired.';
      }
    }
    return {
      Id: vcId,
      Name: _.isString(vcData.Name) ? vcData.Name : '',
      IsCanary: _.isString(vcData.RolloutGroup) ? vcData.RolloutGroup != 'main' : false,
      IsCertified: _.isNumber(vcData.IdentityType) ? vcData.IdentityType === 1 : false,
      GenesisTimeSeconds: _.isNumber(vcData.GenesisRefTime) ? vcData.GenesisRefTime : 0,
      ExpirationTimeSeconds: expirationTime,
      SubscriptionStatus: healthLevel,
      SubscriptionStatusToolTip: healthLevelToolTip,
      VirtualChainUrls: generateVirtualChainUrls(vcId),
    };
  });
}

function formatParticipationPercentage(raw: number): number {
  const safeParticipation = Math.min(raw || 0, 1); // default to 0, no more than 1 TODO ensure no more than 1 in management service
  const formattedParticipation = parseInt((safeParticipation * 100).toFixed(2));
  return formattedParticipation;
}

function extractGuardians(
  rootNodeData: IManagementStatusResponse,
  currentTimestamp: number,
  minSelfStakePercentMille: number,
): Guardian[] {
  return _.mapValues(rootNodeData.Payload.Guardians, (guardianData: IGuardianData) => {
    const ip = _.isString(guardianData.Ip) ? guardianData.Ip : '';

    const guardian: Guardian = {
      EthAddress: ensureAddressStartsWithPrefix(guardianData.EthAddress),
      Name: _.isString(guardianData.Name) ? guardianData.Name : '',
      Ip: ip,
      Website: _.isString(guardianData.Website) ? guardianData.Website : '',
      EffectiveStake: _.isNumber(guardianData.EffectiveStake) ? guardianData.EffectiveStake : 1,
      IsCertified: _.isNumber(guardianData.IdentityType) ? guardianData.IdentityType === 1 : false,
      OrbsAddress: _.isString(guardianData.OrbsAddress) ? guardianData.OrbsAddress : '',
      NodeManagementURL: generateNodeManagmentUrl(ip),
      NodeVirtualChains: {},
      NodeServices: {},
      NodeReputation: {
        NodeVirtualChainReputations: {},
        NodeVirtualChainBadReputations: {},
        ReputationStatus: HealthLevel.Green,
        ReputationToolTip: '',
      },
      RegistrationTime: guardianData.RegistrationTime,
      DistributionFrequency: extractDistributionFrequency(guardianData),
      ParticipationPercentage: formatParticipationPercentage(
        rootNodeData.Payload.Participation30Days[guardianData.EthAddress],
      ),
      Capacity: calculateCapacity(guardianData, minSelfStakePercentMille),
      DelegatedStake: guardianData.DelegatedStake,
      SelfStake: guardianData.SelfStake,
    };

    return guardian;
  });
}

function ensureAddressStartsWithPrefix(ethAddress: string) {
  const prefix = '0x';
  if (ethAddress.startsWith(prefix)) {
    return ethAddress;
  } else {
    return `${prefix}${ethAddress}`;
  }
}

function extractDistributionFrequency(guardianData: IGuardianData): number {
  // TODO : ORL : Read these constants from a better place that will get updted.
  const DEFAULT_DISTRIBUTION_FREQUENCY = 60 * 60 * 24 * 14; // 14 days in seconds
  const REWARDS_DISTRIBUTION_KEY = 'REWARDS_FREQUENCY_SEC';

  const manuallySetValue = guardianData.Metadata[REWARDS_DISTRIBUTION_KEY];
  return manuallySetValue ? manuallySetValue : DEFAULT_DISTRIBUTION_FREQUENCY;
}

function calculateCapacity(guardianData: IGuardianData, minSelfStakePercentMille: number): number {
  const { DelegatedStake, SelfStake } = guardianData;

  const capacity = SelfStake
    ? minSelfStakePercentMille
      ? DelegatedStake / (SelfStake / minSelfStakePercentMille)
      : 0
    : 0;

  return capacity;
}
