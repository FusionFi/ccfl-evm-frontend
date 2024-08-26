import http from '@/utils/backend/http.js';

const URL = process.env.NEXT_PUBLIC_API_URL;

const getPool = async chainId => {
  let res = await http.get(`${URL}/pool/all/${chainId}`);

  return res;
};

const getPrice = async (chainId, symbol) => {
  let res = await http.get(`${URL}/price/${chainId}/${symbol}`);
  return res;
};

const getLoans = async (user_address, chainId) => {
  let res = await http.get(`${URL}/user/${user_address}/${chainId}/loan`);
  return res;
};

const service = {
  getPool,
  getPrice,
  getLoans,
};
export default service;
