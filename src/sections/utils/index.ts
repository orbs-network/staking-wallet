import { CSSProperties } from 'react';
export const getWalletAddressExtraStyle = (smOrLarger: boolean): CSSProperties => {
  const extraStyle: React.CSSProperties = {};

  // For smaller screens we want to emphasize the text
  if (!smOrLarger) {
    extraStyle.fontWeight = 'bold';
  }

  return extraStyle;
};
