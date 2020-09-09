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

export type ContractRegistryAddressUpdated = ContractEventLog<{
  addr: string;
  0: string;
}>;
export type FunctionalOwnershipTransferred = ContractEventLog<{
  previousFunctionalOwner: string;
  newFunctionalOwner: string;
  0: string;
  1: string;
}>;
export type GuardianCertificationUpdate = ContractEventLog<{
  guardian: string;
  isCertified: boolean;
  0: string;
  1: boolean;
}>;
export type Locked = ContractEventLog<{}>;
export type MigrationOwnershipTransferred = ContractEventLog<{
  previousMigrationOwner: string;
  newMigrationOwner: string;
  0: string;
  1: string;
}>;
export type Unlocked = ContractEventLog<{}>;

export interface Certification extends BaseContract {
  constructor(jsonInterface: any[], address?: string, options?: ContractOptions): Certification;
  clone(): Certification;
  methods: {
    /**
     * Allows the pendingFunctionalOwner address to finalize the transfer.
     */
    claimFunctionalOwnership(): NonPayableTransactionObject<void>;

    /**
     * Allows the pendingMigrationOwner address to finalize the transfer.
     */
    claimMigrationOwnership(): NonPayableTransactionObject<void>;

    /**
     * Returns the address of the current functionalOwner.
     */
    functionalOwner(): NonPayableTransactionObject<string>;

    getBootstrapRewardsWallet(): NonPayableTransactionObject<string>;

    getCertificationContract(): NonPayableTransactionObject<string>;

    getCommitteeContract(): NonPayableTransactionObject<string>;

    getDelegationsContract(): NonPayableTransactionObject<string>;

    getElectionsContract(): NonPayableTransactionObject<string>;

    getGuardiansRegistrationContract(): NonPayableTransactionObject<string>;

    getProtocolContract(): NonPayableTransactionObject<string>;

    getRewardsContract(): NonPayableTransactionObject<string>;

    getStakingContract(): NonPayableTransactionObject<string>;

    getStakingRewardsWallet(): NonPayableTransactionObject<string>;

    getSubscriptionsContract(): NonPayableTransactionObject<string>;

    /**
     * Returns true if the caller is the current functionalOwner.
     */
    isFunctionalOwner(): NonPayableTransactionObject<boolean>;

    /**
     * Returns true if the caller is the current migrationOwner.
     */
    isMigrationOwner(): NonPayableTransactionObject<boolean>;

    lock(): NonPayableTransactionObject<void>;

    locked(): NonPayableTransactionObject<boolean>;

    /**
     * Returns the address of the current migrationOwner.
     */
    migrationOwner(): NonPayableTransactionObject<string>;

    /**
     * Leaves the contract without functionalOwner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current functionalOwner.     * NOTE: Renouncing functionalOwnership will leave the contract without an functionalOwner, thereby removing any functionality that is only available to the functionalOwner.
     */
    renounceFunctionalOwnership(): NonPayableTransactionObject<void>;

    /**
     * Leaves the contract without migrationOwner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current migrationOwner.     * NOTE: Renouncing migrationOwnership will leave the contract without an migrationOwner, thereby removing any functionality that is only available to the migrationOwner.
     */
    renounceMigrationOwnership(): NonPayableTransactionObject<void>;

    setContractRegistry(_contractRegistry: string): NonPayableTransactionObject<void>;

    /**
     * Allows the current functionalOwner to set the pendingOwner address.
     * @param newFunctionalOwner The address to transfer functionalOwnership to.
     */
    transferFunctionalOwnership(newFunctionalOwner: string): NonPayableTransactionObject<void>;

    /**
     * Allows the current migrationOwner to set the pendingOwner address.
     * @param newMigrationOwner The address to transfer migrationOwnership to.
     */
    transferMigrationOwnership(newMigrationOwner: string): NonPayableTransactionObject<void>;

    unlock(): NonPayableTransactionObject<void>;

    isGuardianCertified(addr: string): NonPayableTransactionObject<boolean>;

    setGuardianCertification(addr: string, isCertified: boolean): NonPayableTransactionObject<void>;
  };
  events: {
    ContractRegistryAddressUpdated(cb?: Callback<ContractRegistryAddressUpdated>): EventEmitter;
    ContractRegistryAddressUpdated(options?: EventOptions, cb?: Callback<ContractRegistryAddressUpdated>): EventEmitter;

    FunctionalOwnershipTransferred(cb?: Callback<FunctionalOwnershipTransferred>): EventEmitter;
    FunctionalOwnershipTransferred(options?: EventOptions, cb?: Callback<FunctionalOwnershipTransferred>): EventEmitter;

    GuardianCertificationUpdate(cb?: Callback<GuardianCertificationUpdate>): EventEmitter;
    GuardianCertificationUpdate(options?: EventOptions, cb?: Callback<GuardianCertificationUpdate>): EventEmitter;

    Locked(cb?: Callback<Locked>): EventEmitter;
    Locked(options?: EventOptions, cb?: Callback<Locked>): EventEmitter;

    MigrationOwnershipTransferred(cb?: Callback<MigrationOwnershipTransferred>): EventEmitter;
    MigrationOwnershipTransferred(options?: EventOptions, cb?: Callback<MigrationOwnershipTransferred>): EventEmitter;

    Unlocked(cb?: Callback<Unlocked>): EventEmitter;
    Unlocked(options?: EventOptions, cb?: Callback<Unlocked>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: 'ContractRegistryAddressUpdated', cb: Callback<ContractRegistryAddressUpdated>): void;
  once(
    event: 'ContractRegistryAddressUpdated',
    options: EventOptions,
    cb: Callback<ContractRegistryAddressUpdated>,
  ): void;

  once(event: 'FunctionalOwnershipTransferred', cb: Callback<FunctionalOwnershipTransferred>): void;
  once(
    event: 'FunctionalOwnershipTransferred',
    options: EventOptions,
    cb: Callback<FunctionalOwnershipTransferred>,
  ): void;

  once(event: 'GuardianCertificationUpdate', cb: Callback<GuardianCertificationUpdate>): void;
  once(event: 'GuardianCertificationUpdate', options: EventOptions, cb: Callback<GuardianCertificationUpdate>): void;

  once(event: 'Locked', cb: Callback<Locked>): void;
  once(event: 'Locked', options: EventOptions, cb: Callback<Locked>): void;

  once(event: 'MigrationOwnershipTransferred', cb: Callback<MigrationOwnershipTransferred>): void;
  once(
    event: 'MigrationOwnershipTransferred',
    options: EventOptions,
    cb: Callback<MigrationOwnershipTransferred>,
  ): void;

  once(event: 'Unlocked', cb: Callback<Unlocked>): void;
  once(event: 'Unlocked', options: EventOptions, cb: Callback<Unlocked>): void;
}