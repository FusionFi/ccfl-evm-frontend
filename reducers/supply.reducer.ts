import * as SupplyActions from '@/actions/supply.action';
import { createReducer } from '@reduxjs/toolkit';
import { DEFAULT_CHAIN_ID } from '@/constants/chains.constant';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface SupplyState {
  network: any;
  asset: any;
  loading: boolean;
  error: any;
  user: any;
}

export const initialState: SupplyState = {
  network: {
    list: [],
    selected: DEFAULT_CHAIN_ID,
  },
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
      state = { ...initialState };
    })
    .addCase(SupplyActions.updateNetworks, (state, { payload: { networks } }) => {
      state.network.list = [].concat(networks);
    })
    .addCase(SupplyActions.updateAssets, (state, { payload: { assets } }) => {
      state.asset.list = [].concat(assets);
    })
    .addCase(SupplyActions.updateUser, (state, { payload: { user } }) => {
      state.user = user;
    })
    .addCase(SupplyActions.selectNetwork, (state, { payload: { chainId } }) => {
      state.network.selected = chainId;
    }),
);
