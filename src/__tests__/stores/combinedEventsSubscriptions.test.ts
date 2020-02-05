import { StakingServiceMock } from 'orbs-pos-data/dist/testkit';
import {
  subscribeToOrbsInCooldownChange,
  subscribeToStakeAmountChange,
} from '../../store/contractsStateSubscriptions/combinedEventsSubscriptions';

describe('Combined Contracts Events Subscriptions', () => {
  describe('subscribeToOrbsInCooldownChange', () => {
    const testAccountAddress = '0xTestAddress';
    let stakingServiceMock: StakingServiceMock;
    let callbackSpy: jest.Mock;

    beforeEach(() => {
      stakingServiceMock = new StakingServiceMock(true);
      stakingServiceMock.setFromAccount(testAccountAddress);

      callbackSpy = jest.fn();
    });

    it('Should trigger the callback on each of the events', async () => {
      const unsubscribeFunction = subscribeToOrbsInCooldownChange(stakingServiceMock, testAccountAddress, callbackSpy);

      // Start with some orbs staked
      await stakingServiceMock.stake(BigInt(1000));

      // Should get triggered after 'unstake'
      await stakingServiceMock.unstake(BigInt(200));
      expect(callbackSpy).toBeCalledTimes(1);
      expect(callbackSpy).toBeCalledWith(null, BigInt(200), BigInt(800));

      // Should get triggered after 'restake'
      await stakingServiceMock.restake();
      expect(callbackSpy).toBeCalledTimes(2);
      expect(callbackSpy).toBeCalledWith(null, BigInt(200), BigInt(1000));

      // Unstaking again, so we could withdraw
      await stakingServiceMock.unstake(BigInt(600));
      expect(callbackSpy).toBeCalledTimes(3);
      expect(callbackSpy).toBeCalledWith(null, BigInt(600), BigInt(400));

      // Should get triggered after 'withdraw'
      await stakingServiceMock.withdraw();
      expect(callbackSpy).toBeCalledTimes(4);
      expect(callbackSpy).toBeCalledWith(null, BigInt(600), BigInt(400));
    });

    // TODO : FUTURE : Add tests with mocks to check that all unsubscribe functions are getting called.
  });

  describe('subscribeToStakeAmountChange', () => {
    const testAccountAddress = '0xTestAddress';
    let stakingServiceMock: StakingServiceMock;
    let callbackSpy: jest.Mock;

    beforeEach(() => {
      stakingServiceMock = new StakingServiceMock(true);
      stakingServiceMock.setFromAccount(testAccountAddress);

      callbackSpy = jest.fn();
    });

    it('Should trigger the callback on each of the events', async () => {
      const unsubscribeFunction = subscribeToStakeAmountChange(stakingServiceMock, testAccountAddress, callbackSpy);

      // Should get triggered after 'stake'
      await stakingServiceMock.stake(BigInt(1000));
      expect(callbackSpy).toBeCalledTimes(1);
      expect(callbackSpy).toBeCalledWith(null, BigInt(1000), BigInt(1000));

      // Should get triggered after 'unstake'
      await stakingServiceMock.unstake(BigInt(600));
      expect(callbackSpy).toBeCalledTimes(2);
      expect(callbackSpy).toBeCalledWith(null, BigInt(600), BigInt(400));

      // Should get triggered after 'restake'
      await stakingServiceMock.restake();
      expect(callbackSpy).toBeCalledTimes(3);
      expect(callbackSpy).toBeCalledWith(null, BigInt(600), BigInt(1000));
    });

    // TODO : FUTURE : Add tests with mocks to check that all unsubscribe functions are getting called.
  });
});
