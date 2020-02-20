export interface IAppTranslations {
  fontFamily: string;
  sectionTitles: ISectionTitlesTranslations;
  walletInfoSection: IWalletInfoSectionTranslations;
}

export interface ISectionTitlesTranslations {
  walletInfo: string;
  balance: string;
  rewards: string;
  allGuardians: string;
}

export interface IWalletInfoSectionTranslations {
  address: string;
  copy: string;
  qr: string;
}
