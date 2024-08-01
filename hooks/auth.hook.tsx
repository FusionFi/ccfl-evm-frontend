
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
  const auth = useSelector(
    (state: any) => state.auth.auth,
  );
  const updateAuth = useCallback((auth: any) => {
    dispatch(AuthActions.updateAuth({ auth }));
  }, [dispatch]);

  return [auth, updateAuth];
}



