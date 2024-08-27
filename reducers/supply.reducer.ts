import * as SupplyActions from '@/actions/supply.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call


export interface AuthState {
  networks: any;
  assets: any;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  networks: [],
  assets: [],
  loading: false,
  error: null,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(SupplyActions.resetState, (state) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>resetState');
      state.networks = Object.assign({}, initialState.networks);
      state.loading = initialState.loading;
      state.error = initialState.error;
    })
    .addCase(SupplyActions.updateNetworks, (state, { payload: { networks } }) => {
      state.networks = [].concat(networks);
    })
    .addCase(SupplyActions.updateAssets, (state, { payload: { assets } }) => {
      state.assets = [].concat(assets);
    })
  
);
