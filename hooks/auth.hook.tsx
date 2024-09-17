import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as AuthActions from '@/actions/auth.action';

export function useResetState() {
  const dispatch = useDispatch();
  const resetState = useCallback(() => {
    dispatch(AuthActions.resetState());
  }, [dispatch]);
  return [resetState];
}

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.auth);
  const updateAuth = useCallback(
    (auth: any) => {
      dispatch(AuthActions.updateAuth({ auth }));
    },
    [dispatch],
  );

  return [auth, updateAuth];
}

//TODO for mock only
export function useCardanoConnected() {
  const dispatch = useDispatch();
  const isCardanoConnected = useSelector((state: any) => state.auth.isCardanoConnected);
  const updateCardanoConnected = useCallback(
    (isCardanoConnected_: boolean) => {
      dispatch(AuthActions.updateCardanoConnected({ isCardanoConnected: isCardanoConnected_ }));
    },
    [dispatch],
  );

  return [isCardanoConnected, updateCardanoConnected];
}


export function useNetworkManager() {
  const dispatch = useDispatch();
  const chainId = useSelector((state: any) => state.auth.chainId);
  const updateNetwork = useCallback(
    (chainId: any) => {
      dispatch(AuthActions.updateNetwork({ chainId }));
    },
    [dispatch],
  );

  return [chainId, updateNetwork];
}