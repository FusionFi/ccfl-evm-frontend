import http from '@/utils/backend/http.js';

const URL = process.env.NEXT_PUBLIC_API_URL;
const isTestnet = Boolean(process.env.NEXT_PUBLIC_IS_TESTNET || false)

const fetchNetworks = async () => {
  const res = await http.get(
    `${URL}/network`, {
    params: {
      isMainnet: !isTestnet
    }
  });

  return res;
};

const fetchAssets = async () => {
  const res = await http.get(
    `${URL}/asset`, {
    params: {
      category: 'supply',
      isMainnet: !isTestnet
    }
  });

  return res;
};

const service = {
  fetchNetworks,
  fetchAssets
};

export default service;
