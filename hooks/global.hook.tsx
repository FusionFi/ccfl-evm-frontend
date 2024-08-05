import { CHAIN_INFO } from '@/constants/chains.constant';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as GlobalActions from '@/actions/global.action';

export function useSiderbarManager(): [Object, (profile: Object) => void] {
  const dispatch = useDispatch();
  const siderbar = useSelector((state: any) => state.global.siderbar);

  const updateSidebar = useCallback(
    (siderbar: any) => {
      dispatch(GlobalActions.updateSidebar({ siderbar }));
    },
    [dispatch],
  );

  return [siderbar, updateSidebar];
}

export function useThemeManager(): [Object, (profile: Object) => void] {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.global.theme);

  const updateTheme = useCallback(
    (theme: any) => {
      dispatch(GlobalActions.updateTheme({ theme }));
    },
    [dispatch],
  );

  return [theme, updateTheme];
}

export function useChain() {
  const dispatch = useDispatch();
  const chainInfo = useSelector((state: any) => state.global.chainInfo);

  const updateChain = useCallback(
    (chainId: number) => {
      let chain = CHAIN_INFO.get(chainId);
      dispatch(GlobalActions.updateChain({ chainInfo: chain }));
    },
    [dispatch],
  );
  return [chainInfo, updateChain];
}
