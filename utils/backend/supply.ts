import http from '@/utils/backend/http';
import { DEFAULT_CHAIN_ID } from '@/constants/chains.constant'

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

const fetchAssets = async (params: any) => {
  const chainId = params?.chainId || DEFAULT_CHAIN_ID
  const res = await http.get(
    `${URL}/asset`, {
    params: {
      category: 'supply',
      isMainnet: !isTestnet,
      chainId
    }
  });

  return res;
};

const fetchUserSupply = async (params: any) => {
  const chainId = params?.chainId || DEFAULT_CHAIN_ID
  const address = params.address
  const res = await http.get(`${URL}/user/${address}/${chainId}/supply`);

  return res;
};

const fetchPools = async (params: any) => {
  const chainId = params?.chainId || DEFAULT_CHAIN_ID
  const res = await http.get(`${URL}/pool/all/${chainId}`);

  return res || [];
};

const service = {
  fetchNetworks,
  fetchAssets,
  fetchUserSupply,
  fetchPools
};

export default service;
