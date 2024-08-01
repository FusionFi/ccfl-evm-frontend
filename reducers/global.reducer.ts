import {
  updateChain,
  updateRehydrate,
  updateSidebar,
  updateTheme
} from '@/actions/global.action';
import { themes } from '@/themes/constant.theme';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  rehydrated: false,
  complete: true,
  siderbar: {},
  theme: themes.light,
  chainInfo: {},
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateRehydrate, (state) => {
      state.rehydrated = false;
      state.complete = true;
    })
    .addCase(updateSidebar, (state, { payload: { siderbar } }) => {
      state.siderbar = Object.assign({}, state.siderbar, siderbar);
    })
    .addCase(updateTheme, (state, { payload: { theme } }) => {
      state.theme = theme;
    })
    .addCase(updateChain, (state, { payload: { chainInfo } }) => {
      state.chainInfo = Object.assign({}, state.chainInfo, chainInfo);
    })


);
