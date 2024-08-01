import http from '@/utils/backend/http.js';

const URL = process.env.NEXT_PUBLIC_NEPTURE_API_URL;

const getWithdrawHistory = async params => {
  const { user_address, limit, offset } = params;
  let res = await http.get(
    `${URL}/api/v1/neptune/withdrawals?user_address=${user_address}&limit=${limit}&offset=${offset}`,
  );
  return res;
};

const service = {
  getWithdrawHistory,
};
export default service;
