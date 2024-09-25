import { createAction } from '@reduxjs/toolkit';

export const resetState = createAction('auth/resetState');

export const updateAuth = createAction<{ auth: Object }>('auth/updateAuth');
export const updateCardanoConnected = createAction<{ isCardanoConnected: Boolean }>( // TODO for mock only
  'auth/updateCardanoConnected',
);
export const updateNetwork = createAction<{ chainId: any }>( // TODO for mock only
  'auth/updateNetwork',
);
export const updateProvider = createAction<{
  provider: {
    type?: 'EVM' | 'Cardano',
    chainId?: any,
    account?: any,
    connector?: any
  }
}>( // TODO for mock only
  'auth/updateProvider',
);
