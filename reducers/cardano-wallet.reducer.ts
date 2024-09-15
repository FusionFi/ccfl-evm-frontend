import * as Actions from '@/actions/cardano-wallet.action';
import { createReducer } from '@reduxjs/toolkit';

/**
 * CALL API ACTIONS
 */
// Define an async thunk for API call

export interface CardanoWalletState {
  loading: boolean | null;
  error: any;
  wallet: any
}

export const initialState: CardanoWalletState = {
  wallet: {},
  loading: false,
  error: null,
};

export default createReducer(initialState, builder =>
  builder
    .addCase(Actions.updateWallet, (state, { payload: { wallet } }) => {
      console.log('🚀 ~ .addCase ~ wallet:', wallet);
      state.wallet = Object.assign({}, state.wallet, wallet);
    })
    .addCase(Actions.connectWallet, (state, { payload: { wallet } }) => {
      state.wallet = Object.assign({}, wallet);
    })
    .addCase(Actions.disconnectWallet, (state) => {
      console.log('disconnect cadano')
      state.wallet = Object.assign({}, initialState.wallet);
    })
);
