'use client'

import { Data, Lucid, toHex, toUnit, UTxO } from 'lucid-cardano'
import { initLucid } from './blockfrost'
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import React, { useEffect, useState } from 'react';
import { oracleDatum1, loanDatum, collateralDatum } from '../datums';
import { ownerAddress, ownerPKH } from '../owner';
import { oracleUpdateAction, mintLoanAction } from '../redeemers';
import { loanCS, configAddr, oracleAddr, loanMint, loanAddr, collateralAddr, oracleVal } from '../validators';
import { loanAmt, configUnit, oracleUnit } from '../variables';

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

      const oracleOutDatum = Data.from(oracleDatum1) // Change the oracle datum here
      const deposit = loanAmt * 1000n / oracleOutDatum.fields[0]
      const utxos: UTxO[] = await lucid.utxosAt(ownerAddress)
      const utxo: UTxO = utxos[0]
      const loanTn = utxo.txHash.slice(0, 30).concat(toHex(utxo.outputIndex))
      const loanUnit = toUnit(loanCS, loanTn)
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]

      console.log(`Loan Unit: 
        ${loanUnit}
        `)
      console.log(`Collateral Value: `, deposit * 1000000n * 2n, `
        `)
      console.log(`Expected Collateral: `, ((loanAmt * 1000n) / oracleOutDatum.fields[0]) * 1000000n * 2n, `
      ` )

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .mintAssets({
          [loanUnit]: 2n,
        }, mintLoanAction)
        .attachMintingPolicy(loanMint)
        .payToContract(
          loanAddr,
          { inline: loanDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { inline: collateralDatum },
          { lovelace: (deposit * 1000000n * 2n), [loanUnit]: 1n }
        )
        .payToContract(
          oracleAddr,
          { inline: Data.to(oracleOutDatum) },
          { [oracleUnit]: 1n }
        )
        .attachSpendingValidator(oracleVal)
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