import * as SupplyActions from '@/actions/supply.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface SupplyState {
  networks: any;
  asset: any;
  loading: boolean;
  error: any;
  user: any;
}

export const initialState: SupplyState = {
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
    .addCase(SupplyActions.resetState, state => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>resetState');
      state.networks = [];
      state.asset = {
        list: [],
        selected: '',
      }

      state.user = null;
      state.loading = false;
      state.error = false;
    })
    .addCase(SupplyActions.updateNetworks, (state, { payload: { networks } }) => {
      state.networks = [].concat(networks);
    })
    .addCase(SupplyActions.updateAssets, (state, { payload: { assets } }) => {
      state.asset.list = [].concat(assets);
    })
    .addCase(SupplyActions.updateUser, (state, { payload: { user } }) => {
      state.user = user;
    })
);
