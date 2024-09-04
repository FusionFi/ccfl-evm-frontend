import http from '@/utils/backend/http.js';
import crypto from 'crypto'

const SUMSUB_BASE_URL = process.env.NEXT_PUBLIC_SUMSUB_BASE_URL || 'https://try.readme.io/https://api.sumsub.com';
const SUMSUB_APP_TOKEN = process.env.NEXT_PUBLIC_SUMSUB_APP_TOKEN || 'sbx:ZbuTIJ5iwlUhNlf5xmviu5Bq.9ihhJSSsGpkdav5hr2bQXMHJyErj4YoA';
const SUMSUB_SECRET_KEY = process.env.NEXT_PUBLIC_SUMSUB_SECRET_KEY || 'NEKiYebzQwSwgDIbYDQQ4pKdBFzrsmRB';

function createSignature(config) {
  console.log('Creating a signature for the request...');

  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}

http.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
})

const generateExternalLink = async params => {
  const { levelName, externalUserId, ttlInSecs = 1800 } = params;
  const res = await http({
    baseURL: SUMSUB_BASE_URL,
    url: `/resources/sdkIntegrations/levels/${encodeURIComponent(levelName)}/websdkLink?externalUserId=${externalUserId}&ttlInSecs=${ttlInSecs}`,
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN,
    },
  });

  return res;
};

const service = {
  generateExternalLink,
};
export default service;
