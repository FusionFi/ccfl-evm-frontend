import { createAction } from '@reduxjs/toolkit';

export const resetState = createAction('auth/resetState');

export const updateAuth = createAction<{ auth: Object }>('auth/updateAuth');
export const updateCardanoConnected = createAction<{ isCardanoConnected: Boolean }>( // TODO for mock only
  'auth/updateCardanoConnected',
);
