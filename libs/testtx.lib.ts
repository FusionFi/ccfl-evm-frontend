'use client'

import { Lucid, TxHash } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { getLucid } from "@/libs/lucid.lib.ts";
import { Wallets } from "@/wallets/index.wallet";
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';


export const testTx = async (wallet: any): Promise<TxHash> => {
    // const [cardanoWalletConnected] = useCardanoWalletConnected();
    //const [lucid, setLucid] = useState<Lucid | null>(null);
    //   const [TxHash, setTxHash] = useState("");

    // useEffect(() => {
    //     if (!lucid && wallet) {
    //         initLucid(wallet).then((lucid: Lucid) => {
    //             setLucid(lucid);
    //         });
    //     }
    // }, [lucid, wallet]);

    const lucid = await getLucid();
    const _wallet = new Wallets[wallet.metadata.id]();
    const api = await _wallet.getApi();
    lucid.selectWallet(api);
    console.log(wallet)

    const tx = await lucid
        .newTx()
        .payToAddress(wallet.address, { lovelace: 10000000n })
        .complete()

    const signedTx = await tx.sign().complete()

    const txHash = await signedTx.submit()

    console.log(txHash);
    return txHash;

}