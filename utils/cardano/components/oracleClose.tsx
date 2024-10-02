'use client'

import { Lucid, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { ownerPKH } from '../owner';
import { oracleCloseAction, oracleBurnAction } from '../redeemers';
import { oracleAddr, interestAddr, oracleVal, interestVal, oracleMint } from '../validators';
import { oracleUnit } from '../variables';

export default function testTx({wallet}: {wallet: string}) {
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [TxHash, setTxHash] = useState("");

  useEffect(() => {
    if (!lucid && cardanoWalletConnected) {
      initLucid(wallet).then((lucid: Lucid) => {
        setLucid(lucid);
      });
    }
  }, [lucid, cardanoWalletConnected, wallet]);

  const createTx = async () => {
    try {
      if (!lucid) {
        throw Error("Lucid not instantiated");
      }
      console.log(wallet);

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const utxo: UTxO = utxos[0]
      const iUtxos: UTxO[] = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
      const interestUtxo: UTxO = iUtxos[0]
      console.log(utxo)
      console.log(interestUtxo)

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], oracleCloseAction)
        .collectFrom([interestUtxo], oracleCloseAction)
        .attachSpendingValidator(oracleVal)
        .attachSpendingValidator(interestVal)
        .mintAssets({
          [oracleUnit]: -2n,
        }, oracleBurnAction)
        .attachMintingPolicy(oracleMint)
        .addSignerKey(ownerPKH)
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
        <button onClick={() => {createTx}}>Sign & Mint</button>
      )}
    </>
  );
};