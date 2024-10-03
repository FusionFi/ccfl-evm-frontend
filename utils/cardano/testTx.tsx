'use client'

import { Lucid } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { getLucid } from "@/libs/lucid.lib.ts";
import { Wallets } from "@/wallets/index.wallet";
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';

export default function TestTx({ wallet }: { wallet: any }) {
  // const [cardanoWalletConnected] = useCardanoWalletConnected();
  //const [lucid, setLucid] = useState<Lucid | null>(null);
  const [TxHash, setTxHash] = useState("");

  // useEffect(() => {
  //   if (!lucid && wallet) {
  //     initLucid(wallet).then((lucid: Lucid) => {
  //       setLucid(lucid);
  //     });
  //   }
  // }, [lucid, wallet]);

  const createTx = async () => {

    const lucid = await getLucid();
    const _wallet = new Wallets[wallet.metadata.id]();
    const api = await _wallet.getApi();
    lucid.selectWallet(api);
    console.log(lucid)

    try {
      if (!lucid) {
        throw Error("Lucid not instantiated");
      }
      console.log(wallet);

      const tx = await lucid
        .newTx()
        .payToAddress(wallet, { lovelace: 10000000n })
        .complete()

      const signedTx = await tx.sign().complete()

      const txHash = await signedTx.submit()

      console.log(txHash);
      setTxHash(txHash);
      return txHash;
    } catch (e: any) {
      console.log(e);
    }
  }

  return (
    <>
      {TxHash !== 'None' ? (
        <p className="text-sm text-wrap break-words">{TxHash}</p>
      ) : (
        <button onClick={() => { createTx }}>Sign & Mint</button>
      )}
    </>
  );
};