'use client'

import { Lucid, toHex, toUnit, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { oracleDatum1, interestDatum } from '../datums';
import { ownerAddress, ownerPKH } from '../owner';
import { oracleMintAction } from '../redeemers';
import { configAddr, oracleCS, oracleMint, oracleAddr, interestAddr } from '../validators';
import { configUnit } from '../variables';

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

      const oracleDatum = oracleDatum1
      const utxos: UTxO[] = await lucid.utxosAt(ownerAddress)
      const utxo: UTxO = utxos[0]
      const configUtxos: UTxO[] = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn: UTxO = configUtxos[0]
      const oracleTN = utxo.txHash.slice(0, 30).concat(toHex(utxo.outputIndex))
      const oracleUnit = toUnit(oracleCS, oracleTN)

      const tx = await lucid
      .newTx()
      .collectFrom([utxo])
      .readFrom([configIn])
      .mintAssets({
        [oracleUnit]: 2n,
      }, oracleMintAction)
      .attachMintingPolicy(oracleMint)
      .payToContract(
        oracleAddr,
        { inline: oracleDatum },
        { [oracleUnit]: 1n }
      )
      .payToContract(
        interestAddr,
        { inline: interestDatum },
        { [oracleUnit]: 1n }
      )
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