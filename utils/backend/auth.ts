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

const checkUserName = async (username: any) => {
  const res = await http.post(
    `${URL}/user/check/username
`,
    {
      username: username,
    },
  );

  return res;
};

const checkEmail = async (email: any) => {
  const res = await http.post(
    `${URL}/user/check/email

`,
    {
      email: email,
    },
  );

  return res;
};

const checkOldPassword = async (username: any, password: any, token: any) => {
  const res = await http.post(
    `${URL}/user/check/old-password

`,
    {
      username: username,
      password: password,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res;
};

const service = {
  signUp,
  signIn,
  changePassword,
  getProfile,
  checkUserName,
  checkEmail,
  checkOldPassword,
};
export default service;
