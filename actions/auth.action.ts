import { createAction } from '@reduxjs/toolkit';

export const resetState = createAction('auth/resetState');

export const updateAuth = createAction<{ auth: any }>('auth/updateAuth');
export const updateCardanoConnected = createAction<{ isCardanoConnected: Boolean }>( // TODO for mock only
  'auth/updateCardanoConnected',
);
export const updateNetwork = createAction<{ chainId: any }>('auth/updateNetwork'); // TODO for mock only
export const updateProvider = createAction<{
  provider: {
    type?: 'EVM' | 'Cardano';
    chainId?: any;
    account?: any;
    connector?: any;
  };
}>('auth/updateProvider'); // TODO for mock only
export const refreshToken = createAction<{ access_token: any; refresh_token: any }>(
  'auth/refreshToken',
);
