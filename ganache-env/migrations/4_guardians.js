const OrbsGuardians = artifacts.require('OrbsGuardians');

module.exports = async function(deployer, network, accounts) {
  const registrationDepositWei = 1000;
  const registrationMinTime = 60 * 3;

  await deployer.deploy(OrbsGuardians, registrationDepositWei, registrationMinTime);
  const instance = await OrbsGuardians.deployed();
  await instance.register('Guardian 1', 'www.guardian-1.com', { from: accounts[1], value: registrationDepositWei });
  await instance.register('Guardian 2', 'www.guardian-2.com', { from: accounts[2], value: registrationDepositWei });
  await instance.register('Guardian 3', 'www.guardian-3.com', { from: accounts[3], value: registrationDepositWei });
  await instance.register('Guardian 4', 'www.guardian-4.com', { from: accounts[4], value: registrationDepositWei });
  await instance.register('Guardian 5', 'www.guardian-5.com', { from: accounts[5], value: registrationDepositWei });
};
