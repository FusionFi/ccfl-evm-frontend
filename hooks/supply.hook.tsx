
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

export function useUserManager() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: any) => state.supply.user,
  );

  const updateUser = useCallback((user: any) => {
    dispatch(SupplyActions.updateUser({ user }));
  }, [dispatch]);

  return [{
    ...user,
    supplyMap: new Map(user?.supplies?.map((item: any) => [item.asset, item]))
  }, updateUser];
}

export function useAssetManager() {
  const dispatch = useDispatch();
  const asset = useSelector(
    (state: any) => state.supply.asset,
  );

  const updateAssets = useCallback((assets: any) => {
    dispatch(SupplyActions.updateAssets({ assets }));
  }, [dispatch]);

  return [{
    ...asset,
    listMap: new Map(asset?.list.map((item: any) => [item.symbol, item]))
  }, updateAssets];
}

export function useNetworkManager() {
  const dispatch = useDispatch();
  const _networks = useSelector(
    (state: any) => state.supply.networks,
  );

  const updateNetworks = useCallback((networks: any) => {
    dispatch(SupplyActions.updateNetworks({ networks }));
  }, [dispatch]);

  const list: any = new Map(_networks?.map((item: any) => [item.chainId, item]))

  return [list, updateNetworks];
}



