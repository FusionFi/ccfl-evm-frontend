import http from '@/utils/backend/http.js';

const URL = process.env.NEXT_PUBLIC_API_URL;

const getAllPool = async () => {
  let res = await http.get(`${URL}/pool/all`);
  return res;
};

const getPrice = async (chainId, symbol) => {
  let res = await http.get(`${URL}/asset?chainId=${chainId}&symbol=${symbol}`);
  return res;
};

const service = {
  getAllPool,
  getPrice,
};
export default service;
