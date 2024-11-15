import { useDispatch, useSelector } from "react-redux";
import { Blockfrost, Lucid } from "@lucid-evolution/lucid";
import { useCallback } from "react";
import { Wallets } from "@/wallets/index.wallet";
import Networks from '@/constants/cardano-network.constant'
import * as Actions from "@/actions/cardano-wallet.action";
import * as AuthActions from "@/actions/auth.action";
import { initLucid } from "@/utils/cardano/blockfrost";

const CARDANO_NETWORK_ID: any = 0// process.env.NEXT_PUBLIC_CARDANO_NETWORK_ID

export function useCardanoWalletConnect(): [(wallet: Object) => void] {
  const dispatch = useDispatch();

  const connectWallet = useCallback(async (item: any) => {
    try {
      const wallet = new Wallets[item.id]();
      if (!wallet.provider) {
        return window.open(wallet.extensionLink);
      }
      const api = await wallet.enable();

      const networkId = await wallet.getNetworkId();

      if (networkId != CARDANO_NETWORK_ID) {
        throw new Error(
          `Set network to "${Networks[CARDANO_NETWORK_ID]}" in your ${item.id} wallet to use`
        );
      }

      const lucid = await initLucid(item);
      lucid.selectWallet.fromAPI(api);

      const address = await (await lucid.wallet()).address()

      wallet.subscribeEvents({
        dispatch,
        lucid,
        api,
      });

      dispatch(
        Actions.connectWallet({
          wallet: {
            address,
            metadata: item,
            networkId: networkId,
          },
        })
      );

      dispatch(
        AuthActions.updateNetwork({
          chainId: 'ADA',
        })
      );
    } catch (error) {
      console.error(`connect wallet=${item.id} failed: `, error)
      alert(error);
    }
  }, []);

  return [connectWallet];
}

export function useCardanoWalletDisconnect() {
  const dispatch = useDispatch();

  const wallet = useSelector(
    (state: any) => state.cardanoWallet.wallet
  );

  const disconnectWallet = useCallback(() => {
    if (wallet.metadata && wallet.metadata.id) {
      const _wallet = new Wallets[wallet.metadata.id]();
      _wallet.unsubscribeEvents();
    }
    dispatch(Actions.disconnectWallet());
  }, [wallet]);

  return [disconnectWallet];
}

export function useCardanoWalletConnected() {
  const wallet = useSelector(
    (state: any) => state.cardanoWallet.wallet
  );

  return [wallet];
}
