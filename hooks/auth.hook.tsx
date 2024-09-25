import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CHAIN_INFO, DEFAULT_CHAIN_ID, CARDANO_NETWORK_ID, SUPPORTED_CHAINS_MAP } from '@/constants/chains.constant';
import { ProviderType } from '@/providers/index.provider';

import * as AuthActions from '@/actions/auth.action';
import { makeProvider } from '@/providers/index.provider';

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

export function useConnectedNetworkManager() {
  const dispatch = useDispatch();

  const chainId = useSelector((state: any) => state.auth.chainId);
  const provider = useSelector((state: any) => state.auth.provider);

  const updateNetwork = useCallback(
    (chainId: any) => {
      console.log('🚀 ~ useNetworkManager ~ chainId:', chainId);
      dispatch(AuthActions.updateNetwork({ chainId }));
    },
    [dispatch],
  );

  const selectedChain = useMemo(() => {
    let _chain = CHAIN_INFO.get(chainId);
    if (!_chain) {
      if (provider?.type == ProviderType.Cardano) {
        _chain = SUPPORTED_CHAINS_MAP.get(CARDANO_NETWORK_ID);
      } else {
        _chain = SUPPORTED_CHAINS_MAP.get(DEFAULT_CHAIN_ID);
      }
    }
    return _chain;
  }, [provider, chainId]);

  return { updateNetwork, selectedChain, chainId };
}

export function useProviderManager() {
  const dispatch = useDispatch();
  const provider_ = useSelector((state: any) => state.auth.provider);

  const updateProvider = useCallback(
    (provider_: any) => {
      console.log('🚀 ~ useProviderManager ~ provider:', provider_);
      dispatch(AuthActions.updateProvider({ provider: provider_ }));
    },
    [dispatch],
  );

  const provider = makeProvider(provider_);

  return [provider, updateProvider];
}