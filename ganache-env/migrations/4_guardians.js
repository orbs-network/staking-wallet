const OrbsGuardians = artifacts.require('OrbsGuardians');

module.exports = async function(deployer, network, accounts) {
  const registrationDepositWei = 1000;
  const registrationMinTime = 60 * 3;

  await deployer.deploy(OrbsGuardians, registrationDepositWei, registrationMinTime);

  const instance = await OrbsGuardians.new(10, 0);
  await instance.register('Gil', 'www.gilamran.com', { from: accounts[1], value: 10 });
};
