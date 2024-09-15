import { createAction } from '@reduxjs/toolkit';

export const updateWallet = createAction<{ wallet: Object }>("cardano-wallet/update");
export const connectWallet = createAction<{ wallet: Object }>("cardano-wallet/connect");
export const disconnectWallet = createAction("cardano-wallet/disconnect");
