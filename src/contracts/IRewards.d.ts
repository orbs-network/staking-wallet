/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from 'bn.js';
import { ContractOptions } from 'web3-eth-contract';
import { EventLog } from 'web3-core';
import { EventEmitter } from 'events';
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from './types';

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type BootstrapAddedToPool = ContractEventLog<{
  added: string;
  total: string;
  0: string;
  1: string;
}>;
export type BootstrapRewardsAssigned = ContractEventLog<{
  generalGuardianAmount: string;
  certifiedGuardianAmount: string;
  0: string;
  1: string;
}>;
export type BootstrapRewardsWithdrawn = ContractEventLog<{
  guardian: string;
  amount: string;
  0: string;
  1: string;
}>;
export type FeesAddedToBucket = ContractEventLog<{
  bucketId: string;
  added: string;
  total: string;
  isCertified: boolean;
  0: string;
  1: string;
  2: string;
  3: boolean;
}>;
export type FeesAssigned = ContractEventLog<{
  generalGuardianAmount: string;
  certifiedGuardianAmount: string;
  0: string;
  1: string;
}>;
export type FeesWithdrawn = ContractEventLog<{
  guardian: string;
  amount: string;
  0: string;
  1: string;
}>;
export type FeesWithdrawnFromBucket = ContractEventLog<{
  bucketId: string;
  withdrawn: string;
  total: string;
  isCertified: boolean;
  0: string;
  1: string;
  2: string;
  3: boolean;
}>;
export type MaxDelegatorsStakingRewardsChanged = ContractEventLog<{
  maxDelegatorsStakingRewardsPercentMille: string;
  0: string;
}>;
export type StakingRewardsAddedToPool = ContractEventLog<{
  added: string;
  total: string;
  0: string;
  1: string;
}>;
export type StakingRewardsAssigned = ContractEventLog<{
  assignees: string[];
  amounts: string[];
  0: string[];
  1: string[];
}>;
export type StakingRewardsDistributed = ContractEventLog<{
  distributer: string;
  fromBlock: string;
  toBlock: string;
  split: string;
  txIndex: string;
  to: string[];
  amounts: string[];
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string[];
  6: string[];
}>;

export interface IRewards extends BaseContract {
  constructor(jsonInterface: any[], address?: string, options?: ContractOptions): IRewards;
  clone(): IRewards;
  methods: {
    assignRewards(): NonPayableTransactionObject<void>;

    assignRewardsToCommittee(
      generalCommittee: string[],
      generalCommitteeWeights: (number | string)[],
      certification: boolean[],
    ): NonPayableTransactionObject<void>;

    /**
     * @returns Returns the currently unclaimed orbs token reward balance of the given address.
     */
    getStakingRewardBalance(addr: string): NonPayableTransactionObject<string>;

    /**
     * Distributes msg.sender's orbs token rewards to a list of addresses, by transferring directly into the staking contract.`to[0]` must be the sender's main addressTotal delegators reward (`to[1:n]`) must be less then maxDelegatorsStakingRewardsPercentMille of total amount
     */
    distributeOrbsTokenStakingRewards(
      totalAmount: number | string,
      fromBlock: number | string,
      toBlock: number | string,
      split: number | string,
      txIndex: number | string,
      to: string[],
      amounts: (number | string)[],
    ): NonPayableTransactionObject<void>;

    /**
     * Transfers the given amount of orbs tokens form the sender to this contract an update the pool.
     */
    topUpStakingRewardsPool(amount: number | string): NonPayableTransactionObject<void>;

    /**
     * Assigns rewards and sets a new monthly rate for the pro-rata pool.
     */
    setAnnualStakingRewardsRate(
      annual_rate_in_percent_mille: number | string,
      annual_cap: number | string,
    ): NonPayableTransactionObject<void>;

    /**
     * @returns Returns the currently unclaimed orbs token reward balance of the given address.
     */
    getFeeBalance(addr: string): NonPayableTransactionObject<string>;

    /**
     * Transfer all of msg.sender's outstanding balance to their account
     */
    withdrawFeeFunds(): NonPayableTransactionObject<void>;

    /**
     * Called by: subscriptions contract Top-ups the certification fee pool with the given amount at the given rate (typically called by the subscriptions contract)
     */
    fillCertificationFeeBuckets(
      amount: number | string,
      monthlyRate: number | string,
      fromTimestamp: number | string,
    ): NonPayableTransactionObject<void>;

    /**
     * Called by: subscriptions contract Top-ups the general fee pool with the given amount at the given rate (typically called by the subscriptions contract)
     */
    fillGeneralFeeBuckets(
      amount: number | string,
      monthlyRate: number | string,
      fromTimestamp: number | string,
    ): NonPayableTransactionObject<void>;

    getTotalBalances(): NonPayableTransactionObject<{
      feesTotalBalance: string;
      stakingRewardsTotalBalance: string;
      bootstrapRewardsTotalBalance: string;
      0: string;
      1: string;
      2: string;
    }>;

    /**
     * @returns Returns the currently unclaimed bootstrap balance of the given address.
     */
    getBootstrapBalance(addr: string): NonPayableTransactionObject<string>;

    /**
     * Transfer all of msg.sender's outstanding balance to their account
     */
    withdrawBootstrapFunds(): NonPayableTransactionObject<void>;

    /**
     * @returns The timestamp of the last reward assignment.
     */
    getLastRewardAssignmentTime(): NonPayableTransactionObject<string>;

    /**
     * Transfers the given amount of bootstrap tokens form the sender to this contract and update the pool. Assumes the tokens were approved for transfer
     */
    topUpBootstrapPool(amount: number | string): NonPayableTransactionObject<void>;

    /**
     * Assigns rewards and sets a new monthly rate for the geenral commitee bootstrap.
     */
    setGeneralCommitteeAnnualBootstrap(annual_amount: number | string): NonPayableTransactionObject<void>;

    /**
     * Assigns rewards and sets a new monthly rate for the certification commitee bootstrap.
     */
    setCertificationCommitteeAnnualBootstrap(annual_amount: number | string): NonPayableTransactionObject<void>;

    /**
     * Updates the address of the contract registry
     */
    setContractRegistry(_contractRegistry: string): NonPayableTransactionObject<void>;
  };
  events: {
    BootstrapAddedToPool(cb?: Callback<BootstrapAddedToPool>): EventEmitter;
    BootstrapAddedToPool(options?: EventOptions, cb?: Callback<BootstrapAddedToPool>): EventEmitter;

    BootstrapRewardsAssigned(cb?: Callback<BootstrapRewardsAssigned>): EventEmitter;
    BootstrapRewardsAssigned(options?: EventOptions, cb?: Callback<BootstrapRewardsAssigned>): EventEmitter;

    BootstrapRewardsWithdrawn(cb?: Callback<BootstrapRewardsWithdrawn>): EventEmitter;
    BootstrapRewardsWithdrawn(options?: EventOptions, cb?: Callback<BootstrapRewardsWithdrawn>): EventEmitter;

    FeesAddedToBucket(cb?: Callback<FeesAddedToBucket>): EventEmitter;
    FeesAddedToBucket(options?: EventOptions, cb?: Callback<FeesAddedToBucket>): EventEmitter;

    FeesAssigned(cb?: Callback<FeesAssigned>): EventEmitter;
    FeesAssigned(options?: EventOptions, cb?: Callback<FeesAssigned>): EventEmitter;

    FeesWithdrawn(cb?: Callback<FeesWithdrawn>): EventEmitter;
    FeesWithdrawn(options?: EventOptions, cb?: Callback<FeesWithdrawn>): EventEmitter;

    FeesWithdrawnFromBucket(cb?: Callback<FeesWithdrawnFromBucket>): EventEmitter;
    FeesWithdrawnFromBucket(options?: EventOptions, cb?: Callback<FeesWithdrawnFromBucket>): EventEmitter;

    MaxDelegatorsStakingRewardsChanged(cb?: Callback<MaxDelegatorsStakingRewardsChanged>): EventEmitter;
    MaxDelegatorsStakingRewardsChanged(
      options?: EventOptions,
      cb?: Callback<MaxDelegatorsStakingRewardsChanged>,
    ): EventEmitter;

    StakingRewardsAddedToPool(cb?: Callback<StakingRewardsAddedToPool>): EventEmitter;
    StakingRewardsAddedToPool(options?: EventOptions, cb?: Callback<StakingRewardsAddedToPool>): EventEmitter;

    StakingRewardsAssigned(cb?: Callback<StakingRewardsAssigned>): EventEmitter;
    StakingRewardsAssigned(options?: EventOptions, cb?: Callback<StakingRewardsAssigned>): EventEmitter;

    StakingRewardsDistributed(cb?: Callback<StakingRewardsDistributed>): EventEmitter;
    StakingRewardsDistributed(options?: EventOptions, cb?: Callback<StakingRewardsDistributed>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: 'BootstrapAddedToPool', cb: Callback<BootstrapAddedToPool>): void;
  once(event: 'BootstrapAddedToPool', options: EventOptions, cb: Callback<BootstrapAddedToPool>): void;

  once(event: 'BootstrapRewardsAssigned', cb: Callback<BootstrapRewardsAssigned>): void;
  once(event: 'BootstrapRewardsAssigned', options: EventOptions, cb: Callback<BootstrapRewardsAssigned>): void;

  once(event: 'BootstrapRewardsWithdrawn', cb: Callback<BootstrapRewardsWithdrawn>): void;
  once(event: 'BootstrapRewardsWithdrawn', options: EventOptions, cb: Callback<BootstrapRewardsWithdrawn>): void;

  once(event: 'FeesAddedToBucket', cb: Callback<FeesAddedToBucket>): void;
  once(event: 'FeesAddedToBucket', options: EventOptions, cb: Callback<FeesAddedToBucket>): void;

  once(event: 'FeesAssigned', cb: Callback<FeesAssigned>): void;
  once(event: 'FeesAssigned', options: EventOptions, cb: Callback<FeesAssigned>): void;

  once(event: 'FeesWithdrawn', cb: Callback<FeesWithdrawn>): void;
  once(event: 'FeesWithdrawn', options: EventOptions, cb: Callback<FeesWithdrawn>): void;

  once(event: 'FeesWithdrawnFromBucket', cb: Callback<FeesWithdrawnFromBucket>): void;
  once(event: 'FeesWithdrawnFromBucket', options: EventOptions, cb: Callback<FeesWithdrawnFromBucket>): void;

  once(event: 'MaxDelegatorsStakingRewardsChanged', cb: Callback<MaxDelegatorsStakingRewardsChanged>): void;
  once(
    event: 'MaxDelegatorsStakingRewardsChanged',
    options: EventOptions,
    cb: Callback<MaxDelegatorsStakingRewardsChanged>,
  ): void;

  once(event: 'StakingRewardsAddedToPool', cb: Callback<StakingRewardsAddedToPool>): void;
  once(event: 'StakingRewardsAddedToPool', options: EventOptions, cb: Callback<StakingRewardsAddedToPool>): void;

  once(event: 'StakingRewardsAssigned', cb: Callback<StakingRewardsAssigned>): void;
  once(event: 'StakingRewardsAssigned', options: EventOptions, cb: Callback<StakingRewardsAssigned>): void;

  once(event: 'StakingRewardsDistributed', cb: Callback<StakingRewardsDistributed>): void;
  once(event: 'StakingRewardsDistributed', options: EventOptions, cb: Callback<StakingRewardsDistributed>): void;
}
