import { createAction } from '@reduxjs/toolkit';

export const resetState = createAction('supply/resetState');

export const updateNetworks = createAction<{ networks: any }>('supply/updateNetworks');
export const updateAssets = createAction<{ assets: any }>('supply/updateAssets');
export const selectNetwork = createAction<{ chainId: any }>('supply/selectNetwork');
export const updateUser = createAction<{ user: any }>('supply/updateUser');