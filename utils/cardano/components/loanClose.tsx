'use client'

import { Constr, Data, fromText, Lucid, toUnit, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH } from '../owner';
import { loanCloseAction, oracleUpdateAction, burnLoanAction, rewardsMintAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, rewardsCS, loanMint, rewardsMint, closeAddr, loanVal, collateralVal, oracleVal } from '../validators';
import { loanUnit, configUnit, oracleUnit } from '../variables';

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

      const oracleDatum = Data.from(oracleDatum1)
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const exchange = oracleDatum[0]
      const inDatum = Data.from(lUtxo.datum)
      const rewardsQty = inDatum.fields[1]
      const rewardsTn = fromText("")
      const rewardsUnit = toUnit(rewardsCS, rewardsTn)

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [0n]
        ])
      )

      // console.log(lUtxo)
      // console.log(cUtxo)

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanCloseAction)
        .collectFrom([cUtxo], loanCloseAction)
        .readFrom([configIn])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .mintAssets({
          [loanUnit]: -2n,
        }, burnLoanAction)
        .mintAssets({
          [rewardsUnit]: rewardsQty,
        }, rewardsMintAction)
        .attachMintingPolicy(loanMint)
        .attachMintingPolicy(rewardsMint)
        .payToContract(oracleAddr,
          { inline: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .withdraw(closeAddr, 0n, withdrawRedeemer)
        .attachSpendingValidator(loanVal)
        .attachSpendingValidator(collateralVal)
        .attachSpendingValidator(oracleVal)
        .attachWithdrawalValidator(close)
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