/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';
import alertsJson from './locales/en/alerts.json';
import approvableWizardStepTextsJson from './locales/en/approvableWizardStep.json';
import balancesSectionTextsJson from './locales/en/balancesSection.json';
import commonsTextsJson from './locales/en/commons.json';
import connectWalletSectionTextsJson from './locales/en/connectWalletSection.json';
import guardiansSectionTextsJson from './locales/en/guardiansSection.json';
import guardianChangingWizardTextsJson from './locales/en/guardianChangingWizard.json';
import guardianSelectingWizardTextsJson from './locales/en/guardianSelectingWizard.json';
import guardiansTableTextsJson from './locales/en/guardiansTable.json';
import restakingWizardTextsJson from './locales/en/restakingWizard.json';
import rewardsSectionTextsJson from './locales/en/rewardsSection.json';
import sectionTitlesTextsJson from './locales/en/sectionTitles.json';
import stakingWizardTextsJson from './locales/en/stakingWizard.json';
import unstakingWizardTextsJson from './locales/en/unstakingWizard.json';
import rewardsClaimingWizardTextsJson from './locales/en/rewardsClaimingWizard.json';
import walletInfoSectionTextsJson from './locales/en/walletInfoSection.json';
import withdrawingWizardTextsJson from './locales/en/withdrawingWizard.json';
import wizardsCommonsTextsJson from './locales/en/wizardsCommons.json';

export const ENGLISH_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: sectionTitlesTextsJson,
  connectWalletSection: connectWalletSectionTextsJson,
  walletInfoSection: walletInfoSectionTextsJson,
  balancesSection: balancesSectionTextsJson,
  rewardsSection: rewardsSectionTextsJson,
  guardiansSection: guardiansSectionTextsJson,
  guardiansTable: guardiansTableTextsJson,
  wizardsCommons: wizardsCommonsTextsJson,
  approvableWizardStep: approvableWizardStepTextsJson,
  stakingWizard: stakingWizardTextsJson,
  guardianChangingWizard: guardianChangingWizardTextsJson,
  guardianSelectingWizard: guardianSelectingWizardTextsJson,
  restakingWizard: restakingWizardTextsJson,
  unstakingWizard: unstakingWizardTextsJson,
  withdrawingWizard: withdrawingWizardTextsJson,
  rewardsClaimingWizard: rewardsClaimingWizardTextsJson,
  alerts: alertsJson,
  commons: commonsTextsJson,
};
