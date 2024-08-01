import BigNumber from 'bignumber.js';

const DEFAULT_FORMAT = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
};

export const toFormat = (num, ftm) => {
  if (!num) return 0;
  const x = new BigNumber(num);
  BigNumber.config({ FORMAT: Object.assign({}, DEFAULT_FORMAT, ftm) });
  return x.toFormat();
};

export const getTextMulti = (number, text) => {
  let _number = toFormat(number);
  if (!text) return _number;
  _number = _number && _number != 'NaN' ? _number : number;
  return Number(number) == 1 ? `${_number} ${text}` : `${_number} ${text}s`;
};
