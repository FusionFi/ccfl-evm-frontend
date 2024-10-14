import * as AuthActions from '@/actions/auth.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface AuthState {
  auth: any;
  isCardanoConnected?: boolean;
  loading: boolean | null;
  error: any;
  chainId: any;
  provider: any;
}

export const initialState: AuthState = {
  auth: {},
  isCardanoConnected: false,
  chainId: 11155111,
  loading: false,
  error: null,
  provider: {},
};

export default createReducer(initialState, builder =>
  builder
    .addCase(AuthActions.resetState, state => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>resetState', initialState);
      state.auth = {};
      state.loading = false;
      state.error = null;
      state.provider = {};
    })
    .addCase(AuthActions.updateAuth, (state, { payload: { auth } }) => {
      console.log('🚀 ~ .addCase ~ auth:', auth);
      state.auth = Object.assign({}, state.auth, auth);
    })
    .addCase(AuthActions.updateNetwork, (state, { payload: { chainId } }) => {
      console.log('🚀 ~ .addCase ~ updateNetwork:', chainId);
      state.chainId = chainId;
    })
    .addCase(AuthActions.updateProvider, (state, { payload: { provider } }) => {
      console.log('🚀 ~ .addCase ~ updateProvider:', provider);
      state.provider = { ...state.provider, ...provider };
    })
    .addCase(AuthActions.updateCardanoConnected, (state, { payload: { isCardanoConnected } }) => {
      console.log('🚀 ~ .addCase ~ isCardanoConnected:', isCardanoConnected);
      state.isCardanoConnected = !!isCardanoConnected || false;
    })
    .addCase(AuthActions.refreshToken, (state, { payload: { access_token, refresh_token } }) => {
      console.log('🚀 ~ addCase .access_token ~ auth:', access_token);
      state.auth = { ...state.auth, access_token: access_token, refresh_token: refresh_token };
      console.log('🚀 ~ addCase .refreshToken ~ auth: final', state.auth);
    }),
);
