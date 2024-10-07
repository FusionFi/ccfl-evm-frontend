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

const signIn = async (params: any) => {
  const res = await http.post(`${URL}/user/signin/email`, {
    email: params.email,
    password: params.password,
  });

  return res;
};

const service = {
  signUp,
  signIn,
};
export default service;
