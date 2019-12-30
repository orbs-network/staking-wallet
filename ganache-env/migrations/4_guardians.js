const OrbsGuardians = artifacts.require('OrbsGuardians');

module.exports = function(deployer, network, accounts) {
  const registrationDepositWei = 1000;
  const registrationMinTime = 60 * 3;

  deployer.deploy(OrbsGuardians, registrationDepositWei, registrationMinTime);
};
