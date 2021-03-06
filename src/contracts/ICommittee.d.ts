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

export type CommitteeSnapshot = ContractEventLog<{
  addrs: string[];
  weights: string[];
  certification: boolean[];
  0: string[];
  1: string[];
  2: boolean[];
}>;
export type GuardianCommitteeChange = ContractEventLog<{
  addr: string;
  weight: string;
  certification: boolean;
  inCommittee: boolean;
  0: string;
  1: string;
  2: boolean;
  3: boolean;
}>;
export type MaxCommitteeSizeChanged = ContractEventLog<{
  newValue: string;
  oldValue: string;
  0: string;
  1: string;
}>;
export type MaxTimeBetweenRewardAssignmentsChanged = ContractEventLog<{
  newValue: string;
  oldValue: string;
  0: string;
  1: string;
}>;

export interface ICommittee extends BaseContract {
  constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ICommittee;
  clone(): ICommittee;
  methods: {
    /**
     * Called by: Elections contract Notifies a weight change for sorting to a relevant committee member. weight = 0 indicates removal of the member from the committee (for exmaple on unregister, voteUnready, voteOut)
     */
    memberWeightChange(addr: string, weight: number | string): NonPayableTransactionObject<boolean>;

    /**
     * Called by: Elections contract Notifies a guardian certification change
     */
    memberCertificationChange(addr: string, isCertified: boolean): NonPayableTransactionObject<boolean>;

    /**
     * Called by: Elections contract Notifies a a member removal for exampl	e due to voteOut / voteUnready
     */
    removeMember(addr: string): NonPayableTransactionObject<boolean>;

    /**
     * Called by: Elections contract Notifies a new member applicable for committee (due to registration, unbanning, certification change)
     */
    addMember(addr: string, weight: number | string, isCertified: boolean): NonPayableTransactionObject<boolean>;

    /**
     * Called by: Elections contract Returns the committee members and their weights
     */
    getCommittee(): NonPayableTransactionObject<{
      addrs: string[];
      weights: string[];
      certification: boolean[];
      0: string[];
      1: string[];
      2: boolean[];
    }>;

    setMaxTimeBetweenRewardAssignments(
      maxTimeBetweenRewardAssignments: number | string,
    ): NonPayableTransactionObject<void>;

    setMaxCommittee(maxCommitteeSize: number | string): NonPayableTransactionObject<void>;

    /**
     * Updates the address calldata of the contract registry
     */
    setContractRegistry(_contractRegistry: string): NonPayableTransactionObject<void>;

    /**
     * returns the current committee used also by the rewards and fees contracts
     */
    getCommitteeInfo(): NonPayableTransactionObject<{
      addrs: string[];
      weights: string[];
      orbsAddrs: string[];
      certification: boolean[];
      ips: string[];
      0: string[];
      1: string[];
      2: string[];
      3: boolean[];
      4: string[];
    }>;

    /**
     * returns the current settings of the committee contract
     */
    getSettings(): NonPayableTransactionObject<{
      maxTimeBetweenRewardAssignments: string;
      maxCommitteeSize: string;
      0: string;
      1: string;
    }>;
  };
  events: {
    CommitteeSnapshot(cb?: Callback<CommitteeSnapshot>): EventEmitter;
    CommitteeSnapshot(options?: EventOptions, cb?: Callback<CommitteeSnapshot>): EventEmitter;

    GuardianCommitteeChange(cb?: Callback<GuardianCommitteeChange>): EventEmitter;
    GuardianCommitteeChange(options?: EventOptions, cb?: Callback<GuardianCommitteeChange>): EventEmitter;

    MaxCommitteeSizeChanged(cb?: Callback<MaxCommitteeSizeChanged>): EventEmitter;
    MaxCommitteeSizeChanged(options?: EventOptions, cb?: Callback<MaxCommitteeSizeChanged>): EventEmitter;

    MaxTimeBetweenRewardAssignmentsChanged(cb?: Callback<MaxTimeBetweenRewardAssignmentsChanged>): EventEmitter;
    MaxTimeBetweenRewardAssignmentsChanged(
      options?: EventOptions,
      cb?: Callback<MaxTimeBetweenRewardAssignmentsChanged>,
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: 'CommitteeSnapshot', cb: Callback<CommitteeSnapshot>): void;
  once(event: 'CommitteeSnapshot', options: EventOptions, cb: Callback<CommitteeSnapshot>): void;

  once(event: 'GuardianCommitteeChange', cb: Callback<GuardianCommitteeChange>): void;
  once(event: 'GuardianCommitteeChange', options: EventOptions, cb: Callback<GuardianCommitteeChange>): void;

  once(event: 'MaxCommitteeSizeChanged', cb: Callback<MaxCommitteeSizeChanged>): void;
  once(event: 'MaxCommitteeSizeChanged', options: EventOptions, cb: Callback<MaxCommitteeSizeChanged>): void;

  once(event: 'MaxTimeBetweenRewardAssignmentsChanged', cb: Callback<MaxTimeBetweenRewardAssignmentsChanged>): void;
  once(
    event: 'MaxTimeBetweenRewardAssignmentsChanged',
    options: EventOptions,
    cb: Callback<MaxTimeBetweenRewardAssignmentsChanged>,
  ): void;
}
