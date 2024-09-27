import http from '@/utils/backend/http';

const URL = process.env.NEXT_PUBLIC_API_URL;
const isTestnet = Boolean(process.env.NEXT_PUBLIC_IS_TESTNET || false);

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
  let res = await http.get(
    `${URL}/asset?category=collateral&chainId=${chainId}&symbol=${symbol}&isMainnet=${!isTestnet}`,
  );
  return res;
};

const getTokenInfo = async (symbol: any, chainId: any) => {
  let res = await http.get(`${URL}/asset?chainId=${chainId}&symbol=${symbol}`);
  return res;
};

const getPoolAddress = async (chainId: any, symbol: any) => {
  let res = await http.get(`${URL}/contract?chainId=${chainId}&asset=${symbol}`);
  return res;
};

const getSetting = async (key: any) => {
  let res = await http.get(`${URL}/setting?key=${key}`);
  return res;
};

const fetchNetworks = async () => {
  const res = await http.get(`${URL}/network`, {
    params: {
      isMainnet: !isTestnet,
    },
  });

  return res;
};

const service = {
  getPool,
  getPrice,
  getLoans,
  getCollateralBalance,
  getCollateralInfo,
  getTokenInfo,
  getPoolAddress,
  getSetting,
  fetchNetworks,
};
export default service;
