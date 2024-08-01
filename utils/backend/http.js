import axios from 'axios';

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

// Add a response interceptor
http.interceptors.response.use(
  async response => {
    // Return JSON data
    return response?.data?.data || response?.data || response;
  },
  async error => {
    const err = (error.response && error.response.data) || error;
    // if (error.response && error.response.status === 401) {
    //   store.dispatch(AuthActions.resetState());
    // }

    if (error.response && error.response.status) {
      err.status = error.response.status;
    }

    return Promise.reject(err);
  },
);
export default http;
