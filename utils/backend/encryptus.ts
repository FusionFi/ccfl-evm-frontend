import http from '@/utils/backend/http';

const URL = process.env.NEXT_PUBLIC_API_URL;
const isTestnet = Boolean(process.env.NEXT_PUBLIC_IS_TESTNET || false);

const getKycLink = async (token: any, email: any) => {
  const res = await http.get(`${URL}/encryptus/partners/kycurl/${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res;
};

const service = {
  getKycLink,
};
export default service;
