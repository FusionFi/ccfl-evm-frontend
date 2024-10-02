'use client'

import { Constr, Data, Lucid, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';

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

      const oracleDatum = Data.from(oracleDatum1) // set to oracleDatum1 by default
      const oracleExchangeRate = oracleDatum.fields[0]
      const adaValue = loanAmt * 1000n / oracleExchangeRate
      const deposit = adaValue * 1000000n
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const inDatum = Data.from(cUtxo.datum)
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const minValue = (deposit * 2n) - inDatum.fields[2]

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      // console.log(inDatum)
      // console.log(Data.from(loanDatum))

      // console.log(Data.from(cUtxo.datum))
      // console.log(Data.from(collateralDatum))

      // console.log(lUtxo)
      // console.log(cUtxo)

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanBalanceAction)
        .collectFrom([cUtxo], loanBalanceAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .withdraw(balanceAddr, 0n, withdrawRedeemer)
        .payToContract(
          loanAddr,
          { inline: loanDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { inline: collateralDatum },
          {
            lovelace: minValue,
            [loanUnit]: 1n,
          }
        )
        .payToContract(
          oracleAddr,
          { inline: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .attachSpendingValidator(loanVal)
        .attachSpendingValidator(collateralVal)
        .attachSpendingValidator(oracleVal)
        .attachWithdrawalValidator(balance)
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