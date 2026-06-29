const WALLET_LEGAL_AGREEMENT_KEY = 'orbs.walletConnection.legalAgreementAccepted';

export const walletLegalAgreement = {
  getAccepted(): boolean {
    try {
      return window.localStorage.getItem(WALLET_LEGAL_AGREEMENT_KEY) === 'true';
    } catch (error) {
      return false;
    }
  },

  setAccepted(accepted: boolean) {
    try {
      window.localStorage.setItem(WALLET_LEGAL_AGREEMENT_KEY, accepted ? 'true' : 'false');
    } catch (error) {}
  },
};
