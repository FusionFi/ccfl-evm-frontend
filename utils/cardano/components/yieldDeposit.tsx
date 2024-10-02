'use client'

import { Constr, Data, Lucid, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { yieldDatum } from '../datums';
import { ownerPKH } from '../owner';
import { depositYieldAction } from '../redeemers';
import { collateralAddr, configAddr, depositAddr, yieldAddr, deposit, collateralVal } from '../validators';
import { loanUnit, configUnit } from '../variables';

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

      const yieldAmt = 1000000n
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const inDatum = Data.from(cUtxo.datum)
      const inYield = inDatum.fields[2]
      const outYield = inYield + yieldAmt
      const inCollateral = cUtxo.assets.lovelace
      console.log(inCollateral)

      console.log(inDatum)

      const newDatum = Data.to(
        new Constr(0, [
          inDatum.fields[0],
          inDatum.fields[1],
          outYield
        ])
      )

      console.log(Data.from(newDatum))

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [0n]
        ])
      )

      const tx = await lucid
        .newTx()
        .collectFrom(
          [cUtxo],
          depositYieldAction
        )
        .readFrom([configIn])
        .withdraw(depositAddr, 0, withdrawRedeemer)
        .payToContract(
          collateralAddr,
          { inline: newDatum },
          {
            lovelace: (inCollateral - outYield),
            [loanUnit]: 1n
          }
        )
        .payToContract(c
          yieldAddr,
          { inline: yieldDatum },
          { lovelace: yieldAmt }
        )
        .attachWithdrawalValidator(deposit)
        .attachSpendingValidator(collateralVal)
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