
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as SupplyActions from '@/actions/supply.action';


export function useResetState() {
  const dispatch = useDispatch();
  const resetState = useCallback(() => {
    dispatch(SupplyActions.resetState());
  }, [dispatch]);

  return [resetState];
}

export function useAssetManager() {
  const dispatch = useDispatch();
  const asset = useSelector(
    (state: any) => state.supply.asset,
  );

  const updateAssets = useCallback((assets: any) => {
    dispatch(SupplyActions.updateAssets({ assets }));
  }, [dispatch]);

  return [asset, updateAssets];
}

export function useNetworkManager() {
  const dispatch = useDispatch();
  const network = useSelector(
    (state: any) => state.supply.network,
  );

  const updateNetworks = useCallback((networks: any) => {
    dispatch(SupplyActions.updateNetworks({ networks }));
  }, [dispatch]);

  const selectNetwork = useCallback((chainId: any) => {
    dispatch(SupplyActions.selectNetwork({ chainId }));
  }, [dispatch]);

  return [{
    ...network,
    listMap: new Map(network.list.map((item: any) => [item.chainId, item]))
  }, updateNetworks, selectNetwork];
}



