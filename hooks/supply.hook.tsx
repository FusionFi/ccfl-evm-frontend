
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
  const assets = useSelector(
    (state: any) => state.supply.assets,
  );

  const updateAssets = useCallback((assets: any) => {
    dispatch(SupplyActions.updateAssets({ assets }));
  }, [dispatch]);

  return [assets, updateAssets];
}

export function useNetworkManager() {
  const dispatch = useDispatch();
  const networks = useSelector(
    (state: any) => state.supply.networks,
  );

  const updateNetworks = useCallback((networks: any) => {
    dispatch(SupplyActions.updateNetworks({ networks }));
  }, [dispatch]);

  return [networks, updateNetworks];
}



