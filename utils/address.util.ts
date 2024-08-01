import { getAddress } from '@ethersproject/address';

export const truncate = (addr, prelength = 6, sublength = 6) => {
  if (!addr) {
    return '';
  }
  const l = addr.length;
  if (l < prelength) {
    return addr;
  }
  const pre = addr.substring(0, prelength);
  const end = addr.substring(l - sublength, l);
  return `${pre}...${end}`;
};

export const isAddress = (addr: any) => {
  if (!addr) {
    return false;
  }
  try {
    return getAddress(addr);
  } catch {
    return false;
  }
};
