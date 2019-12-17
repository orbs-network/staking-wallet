const TYPE_SCALE = 1.25; // https://type-scale.com/

function scaleUp(level: number): number {
  let result = 1;
  for (let i = 0; i < level; i++) {
    result = result * TYPE_SCALE;
  }
  return Math.round(result * 1_000) / 1000;
}

function scaleDown(level: number): number {
  let result = 1;
  for (let i = 0; i < level; i++) {
    result = result / TYPE_SCALE;
  }
  return Math.round(result * 1_000) / 1000;
}

const sizes = {
  SIZE_LARGE_6: `${scaleUp(6)}em`,
  SIZE_LARGE_5: `${scaleUp(5)}em`, // 3.052em  48.83px
  SIZE_LARGE_4: `${scaleUp(4)}em`, // 2.441em  39.06px
  SIZE_LARGE_3: `${scaleUp(3)}em`, // 1.953em  31.25px
  SIZE_LARGE_2: `${scaleUp(2)}em`, // 1.563em  25px
  SIZE_LARGE_1: `${scaleUp(1)}em`, // 1.25em   20px
  SIZE_BASIC: `1em`, // 1em      16px
  SIZE_SMALL_1: `${scaleDown(1)}em`, // 0.8em    12.8px
  SIZE_SMALL_2: `${scaleDown(2)}em`, // 0.64em   10.24px
  SIZE_SMALL_3: `${scaleDown(3)}em`, // 0.512em  8.19px
  SIZE_SMALL_4: `${scaleDown(4)}em`, // 0.41em   6.55px
  SIZE_SMALL_5: `${scaleDown(5)}em`, // 0.328em  5.24px
  SIZE_SMALL_6: `${scaleDown(6)}em`, // 0.262em  4.19px
};

const poppersBorderColor = '#3d3d3d';

const primaryColor = '#ededed';
const secondaryColor = '#6ec6d8';
const tooltipBorderColor = poppersBorderColor;
const tooltipBackgroundColor = 'black';
const poiPopUpBorderColor = poppersBorderColor;
const poiCardBackgroundColor = '#141414';
const poiCardBackgroundAlpha = 0.6;
const buttonHoverColor = secondaryColor;
const buttonDownColor = '#4696a7';

export const theme = {
  primaryColor,
  secondaryColor,
  buttonHoverColor,
  buttonDownColor,
  tooltipBorderColor,
  tooltipBackgroundColor,

  poiPopUpBorderColor,
  poiCardBackgroundColor,
  poiCardBackgroundAlpha,

  mainColor: 'rgb(96, 125, 131)',
  textColor: 'rgb(156, 156, 156)',

  buttonColor: '#030616',
  lightTextColor: primaryColor,
  darkTextColor: '#8a8a8a',
  sizes,
};
