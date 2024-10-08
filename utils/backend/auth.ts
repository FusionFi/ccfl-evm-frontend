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

const changePassword = async (params: any) => {
  const res = await http.post(`${URL}/user/change-password`, {
    token: params.token,
    password: params.password,
  });

  return res;
};

const getProfile = async (token: any) => {
  const res = await http.get(`${URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res;
};

const service = {
  signUp,
  signIn,
  changePassword,
  getProfile,
};
export default service;
