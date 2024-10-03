'use client'

import { useCardanoConnected } from "@/hooks/auth.hook";
import { useCardanoWalletConnected } from "@/hooks/cardano-wallet.hook";
import { useNotification } from "@/hooks/notifications.hook";
import cardanoWalletReducer from "@/reducers/cardano-wallet.reducer";
import { AppState, AppStore } from "@/store/index.store";
import testTx from "@/utils/cardano/testTx";
import TestTxComponent from "@/utils/cardano/useTxComponent";
import { useState, useMemo } from "react";
import { useAccount } from "wagmi";

export default function Lucid() {
  const { address, isConnected } = useAccount();
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  const [isCardanoConnected] = useCardanoConnected();

  const isConnected_ = useMemo(() => {
    if (!!cardanoWalletConnected?.address) {
      return true;
    }

    if (isConnected && networkInfo) {
      return true;
    }
    return false
  }, [isConnected, cardanoWalletConnected?.address, networkInfo])

  console.log(cardanoWalletConnected, 'cardanoWalletConnected.address')

  //connect wallet
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();

  return (
    <>
    <main className="flex items-center justify-center">
      <div>
        <h1>Lucid</h1>
        <div>
          <h2>Lucid</h2>
          <p>Lucid is a Cardano wallet that uses Blockfrost to interact with the Cardano blockchain. It is a simple, easy-to-use wallet that allows you to send and receive ADA, as well as view your transaction history.</p>
        </div>
        <div className="flex">

        <div className="grid grid-cols-2 items-center justify-center w-full gap-4">
          <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
            <button onClick={() => {
              if (!isCardanoConnected) {
                showWarning('No wallet connected')
                return
              }
              console.log(cardanoWalletConnected.address)
              testTx(cardanoWalletConnected)
            }}>Connect Wallet</button>
          </div>
          <TestTxComponent wallet={cardanoWalletConnected} />
        </div>
        </div>
      </div>
    </main>
    </>
  )
}