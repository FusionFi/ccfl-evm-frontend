import * as AuthActions from '@/actions/auth.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface AuthState {
  auth: object;
  isCardanoConnected?: boolean;
  loading: boolean | null;
  error: any;
  chainId: any
}

export const initialState: AuthState = {
  auth: {},
  isCardanoConnected: false,
  chainId: 11155111,
  loading: false,
  error: null,
};

export default createReducer(initialState, builder =>
  builder
    .addCase(AuthActions.resetState, state => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>resetState');
      state.auth = {...initialState}
    })
    .addCase(AuthActions.updateAuth, (state, { payload: { auth } }) => {
      console.log('🚀 ~ .addCase ~ auth:', auth);
      state.auth = Object.assign({}, state.auth, auth);
    })
    .addCase(AuthActions.updateNetwork, (state, { payload: { chainId } }) => {
      console.log('🚀 ~ .addCase ~ updateNetwork:', chainId);
      state.chainId = chainId;
    })
    .addCase(AuthActions.updateCardanoConnected, (state, { payload: { isCardanoConnected } }) => {
      console.log('🚀 ~ .addCase ~ isCardanoConnected:', isCardanoConnected);
      state.isCardanoConnected = !!isCardanoConnected || false;
    }),
);
