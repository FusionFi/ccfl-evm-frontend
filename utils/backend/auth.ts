import http from '@/utils/backend/http';

const URL = process.env.NEXT_PUBLIC_API_URL;
const isTestnet = Boolean(process.env.NEXT_PUBLIC_IS_TESTNET || false);

const signUp = async (params: any) => {
  const res = await http.post(`${URL}/user/signup`, {
    username: params.userName,
    password: params.password,
    email: params.email,
  });

  return res;
};

const service = {
  signUp,
};
export default service;
