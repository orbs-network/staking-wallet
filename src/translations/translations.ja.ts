/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';
import alertsJson from './locales/ja/alerts.json';
import approvableWizardStepTextsJson from './locales/ja/approvableWizardStep.json';
import balancesSectionTextsJson from './locales/ja/balancesSection.json';
import commonsTextsJson from './locales/ja/commons.json';
import connectWalletSectionTextsJson from './locales/ja/connectWalletSection.json';
import guardiansSectionTextsJson from './locales/ja/guardiansSection.json';
import guardianChangingWizardTextsJson from './locales/ja/guardianChangingWizard.json';
import guardianSelectingWizardTextsJson from './locales/ja/guardianSelectingWizard.json';
import guardiansTableTextsJson from './locales/ja/guardiansTable.json';
import restakingWizardTextsJson from './locales/ja/restakingWizard.json';
import rewardsSectionTextsJson from './locales/ja/rewardsSection.json';
import sectionTitlesTextsJson from './locales/ja/sectionTitles.json';
import stakingWizardTextsJson from './locales/ja/stakingWizard.json';
import unstakingWizardTextsJson from './locales/ja/unstakingWizard.json';
import walletInfoSectionTextsJson from './locales/ja/walletInfoSection.json';
import withdrawingWizardTextsJson from './locales/ja/withdrawingWizard.json';
import wizardsCommonsTextsJson from './locales/ja/wizardsCommons.json';
import rewardsClaimingWizardTextsJson from './locales/ja/rewardsClaimingWizard.json';

export const JAPANESE_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: sectionTitlesTextsJson,
  connectWalletSection: connectWalletSectionTextsJson,
  walletInfoSection: walletInfoSectionTextsJson,
  balancesSection: balancesSectionTextsJson,
  rewardsSection: rewardsSectionTextsJson,
  guardiansSection: guardiansSectionTextsJson,

  // @ts-ignore
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
