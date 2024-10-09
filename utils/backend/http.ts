import { store } from '@/store/index.store';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthActions from '@/actions/auth.action';
import eventBus from '@/hooks/eventBus.hook';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEPTURE_API_URL,
  timeout: 60000,
});

// Add a request interceptor
http.interceptors.request.use(
  config => {
    // const state = JSON.parse(
    //   localStorage.getItem(`persist:${process.env.NEXT_PUBLIC_KEY_STORE}`) ||
    //     null,
    // );
    // const auth = JSON.parse(state?.auth || null);
    // const tech = auth?.auth?.tech;
    // if (tech?.message && tech?.signature && tech?.data?.address) {
    //   config.headers.authorize = `${tech?.message}:${tech?.signature}`;
    //   config.headers.address = tech?.data?.address;
    // }
    // get from store
    // let stateStore = store.getState();
    // console.log(stateStore.auth, 'auth from store');
    // const techStore = stateStore?.auth?.auth?.tech;
    // if (
    //   techStore?.message &&
    //   techStore?.signature &&
    //   techStore?.data?.address
    // ) {
    //   config.headers.authorize = `${techStore?.message}:${techStore?.signature}`;
    //   config.headers.address = techStore?.data?.address;
    // }
    return config;
  },
  error => Promise.reject(error),
);

let isAlreadyFetchingAccessToken = false;

// Add a response interceptor
http.interceptors.response.use(
  async response => {
    // Return JSON data
    return response?.data?.data || response?.data || response;
  },
  async error => {
    const err = (error.response && error.response.data) || error;
    const { config } = error;
    const originalRequest = config;

    if (error.response && error.response.status === 401) {
      // store.dispatch(AuthActions.resetState());
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        alert('Session expired');
        eventBus.emit('openSignInModal');
      }
    }

    if (error.response && error.response.status) {
      err.status = error.response.status;
    }

    return Promise.reject(err);
  },
);
export default http;
