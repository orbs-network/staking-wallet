/* eslint-disable @typescript-eslint/camelcase */
import { IAppTranslations } from './translationsTypes';
import alertsJson from './locales/ko/alerts.json';
import approvableWizardStepTextsJson from './locales/ko/approvableWizardStep.json';
import balancesSectionTextsJson from './locales/ko/balancesSection.json';
import commonsTextsJson from './locales/ko/commons.json';
import connectWalletSectionTextsJson from './locales/ko/connectWalletSection.json';
import guardianChangingWizardTextsJson from './locales/ko/guardianChangingWizard.json';
import guardiansTableTextsJson from './locales/ko/guardiansTable.json';
import restakingWizardTextsJson from './locales/ko/restakingWizard.json';
import rewardsSectionTextsJson from './locales/ko/rewardsSection.json';
import sectionTitlesTextsJson from './locales/ko/sectionTitles.json';
import stakingWizardTextsJson from './locales/ko/stakingWizard.json';
import unstakingWizardTextsJson from './locales/ko/unstakingWizard.json';
import walletInfoSectionTextsJson from './locales/ko/walletInfoSection.json';
import withdrawingWizardTextsJson from './locales/ko/withdrawingWizard.json';
import wizardsCommonsTextsJson from './locales/ko/wizardsCommons.json';

export const KOREAN_TEXTS: IAppTranslations = {
  fontFamily: 'Montserrat',
  sectionTitles: sectionTitlesTextsJson,
  connectWalletSection: connectWalletSectionTextsJson,
  walletInfoSection: walletInfoSectionTextsJson,
  balancesSection: balancesSectionTextsJson,
  rewardsSection: rewardsSectionTextsJson,
  guardiansTable: guardiansTableTextsJson,
  wizardsCommons: wizardsCommonsTextsJson,
  approvableWizardStep: approvableWizardStepTextsJson,
  stakingWizard: stakingWizardTextsJson,
  guardianChangingWizard: guardianChangingWizardTextsJson,
  restakingWizard: restakingWizardTextsJson,
  unstakingWizard: unstakingWizardTextsJson,
  withdrawingWizard: withdrawingWizardTextsJson,
  alerts: alertsJson,
  commons: commonsTextsJson,
};
