import http from '@/utils/backend/http';

const URL = process.env.NEXT_PUBLIC_API_URL;

const getPool = async (chainId: any) => {
  let res = await http.get(`${URL}/pool/all/${chainId}`);

  return res;
};

const getPrice = async (chainId: any, symbol: any) => {
  let res = await http.get(`${URL}/price/${chainId}/${symbol}`);
  return res;
};

const getLoans = async (user_address: any, chainId: any, offset = 0, limit = 10) => {
  let res = await http.get(
    `${URL}/user/${user_address}/${chainId}/loan?offset=${offset}&limit=${limit}`,
  );
  return res;
};

const getCollateralBalance = async (user_address: any, chainId: any, asset: any) => {
  let res = await http.get(`${URL}/user/${user_address}/${chainId}/${asset}/balance`);
  return res;
};

const getCollateralInfo = async (symbol: any, chainId: any) => {
  let res = await http.get(`${URL}/asset?category=collateral&chainId=${chainId}&symbol=${symbol}`);
  return res;
};

const service = {
  getPool,
  getPrice,
  getLoans,
  getCollateralBalance,
  getCollateralInfo,
};
export default service;
