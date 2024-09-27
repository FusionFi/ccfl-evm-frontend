import * as BorrowActions from '@/actions/borrow.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface BorrowState {
  networks: any;
  asset: any;
  loading: boolean;
  error: any;
  user: any;
}

export const initialState: BorrowState = {
  networks: [],
  asset: {
    list: [],
    selected: '',
  },
  user: null,
  loading: false,
  error: null,
};

export default createReducer(initialState, builder =>
  builder
    .addCase(BorrowActions.resetState, state => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>resetState');
      state.networks = [];
      state.asset = {
        list: [],
        selected: '',
      };

      state.user = null;
      state.loading = false;
      state.error = false;
    })
    .addCase(BorrowActions.updateNetworks, (state, { payload: { networks } }) => {
      state.networks = [].concat(networks);
    })
    .addCase(BorrowActions.updateAssets, (state, { payload: { assets } }) => {
      state.asset.list = [].concat(assets);
    })
    .addCase(BorrowActions.updateUser, (state, { payload: { user } }) => {
      state.user = user;
    }),
);
