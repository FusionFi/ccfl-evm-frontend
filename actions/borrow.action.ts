import { createAction } from '@reduxjs/toolkit';

// export const resetState = createAction('borrow/resetState');

export const updateNetworks = createAction<{ networks: any }>('borrow/updateNetworks');
// export const updateAssets = createAction<{ assets: any }>('borrow/updateAssets');
// export const updateUser = createAction<{ user: any }>('borrow/updateUser');
