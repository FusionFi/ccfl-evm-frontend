'use client'

import { Constr, Data, Lucid, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { oracleDatum7 } from '../datums';
import { ownerPKH } from '../owner';
import { loanLiquidateAction, oracleUpdateAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, oracleVal, loanVal, collateralVal, liquidateAddr, liquidate } from '../validators';
import { loanUnit, configUnit, oracleUnit, timestamp, oracleTn } from '../variables';

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

      const oracleDatum = Data.from(oracleDatum7)
      const newLoanValue = 0n
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const inDatum = Data.from(lUtxo.datum)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      const liquidateDatum = Data.to(
        new Constr(0, [
          newLoanValue,
          newLoanValue,
          0n,
          timestamp,
          oracleTn
        ]))

      const liquidCollateralDatum = Data.to(
        new Constr(0, [
          newLoanValue * 2n,
          timestamp,
          0n
        ])
      )

      console.log(Data.from(lUtxo.datum))

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanLiquidateAction)
        .collectFrom([cUtxo], loanLiquidateAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .payToContract(
          loanAddr,
          { inline: liquidateDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { inline: liquidCollateralDatum },
          { lovelace: 2000000n, [loanUnit]: 1n }
        )
        .payToContract(
          oracleAddr,
          { inline: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .attachSpendingValidator(oracleVal)
        .attachSpendingValidator(loanVal)
        .attachSpendingValidator(collateralVal)
        .withdraw(liquidateAddr, 0n, withdrawRedeemer)
        .attachWithdrawalValidator(liquidate)
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