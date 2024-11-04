import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum7 } from '../datums';
import { ownerPKH } from '../owner';
import { loanLiquidateAction, oracleUpdateAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, oracleVal, loanVal, collateralVal, liquidateAddr, liquidate, loanCS, oracleCS } from '../validators';
import { loanUnit, configUnit, oracleUnit, timestamp, oracleTn } from '../variables';
import { makeCollateralDatum, makeLoanDatum, makeOracleDatum } from '../evoDatums';

export function loanLiquidateTx(
  wallet: any, 
  loanTokenName: string,
  loanAmount: number,
  liquidationAmt: number, 
  oracleTokenName: string, 
  exchangeRate: number
) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState("None");

  useEffect(() => {
    if (!lucid && wallet) {
      initLucid(wallet).then((Lucid: Lucid) => {
        setLucid(Lucid);
      });
    }
  }, [lucid, wallet]);

  const createTx = useCallback(async () => {
    try {
      if (!lucid) {
        throw Error("Lucid not instantiated");
      }
      console.log(wallet);
      const timestamp = Date.now()
      const oracleExchangeRate = exchangeRate * 1000

      const oracleUnit = toUnit(oracleCS, oracleTokenName)
      const loanUnit = toUnit(loanCS, loanTokenName)

      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const oracleDatum = makeOracleDatum(exchangeRate, timestamp, oracleTn, liquidationAmt, 0n)
      
      const newLoanValue = loanAmount - liquidationAmt
      
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const inDatum = Data.from(lUtxo.datum!)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      const liquidateLoanDatum = makeLoanDatum(newLoanValue, newLoanValue, inDatum.fields[2], timestamp, oracleTn)
      // const liquidateDatum = Data.to(
      //   new Constr(0, [
      //     newLoanValue,
      //     newLoanValue,
      //     0n,
      //     timestamp,
      //     oracleTn
      //   ]))

      const liquidateCollateralDatum = makeCollateralDatum(newLoanValue * 2, timestamp)
      // const liquidCollateralDatum = Data.to(
      //   new Constr(0, [
      //     newLoanValue * 2n,
      //     timestamp,
      //     0n
      //   ])
      // )

      console.log(Data.from(lUtxo.datum))

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanLiquidateAction)
        .collectFrom([cUtxo], loanLiquidateAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .pay.ToContract(
          loanAddr,
          { kind: "inline", value: liquidateLoanDatum },
          { [loanUnit]: 1n }
        )
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: liquidateCollateralDatum },
          { lovelace: 2000000n, [loanUnit]: 1n }
        )
        .pay.ToContract(
          oracleAddr,
          { kind: "inline", value: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .attach.SpendingValidator(oracleVal)
        .attach.SpendingValidator(loanVal)
        .attach.SpendingValidator(collateralVal)
        .withdraw(liquidateAddr, 0n, withdrawRedeemer)
        .attach.WithdrawalValidator(liquidate)
        .addSignerKey(process.env.NEXT_PUBLIC_OWNER_PKH!)
        .complete()
      
      const txString = await tx.toString()

      const infraSign = await lucid.fromTx(txString).partialSign.withPrivateKey(process.env.NEXT_PUBLIC_OWNER_SKEY!)
      const partialSign = await lucid.fromTx(txString).partialSign.withWallet()
      
      const assembledTx = await lucid.fromTx(txString).assemble([infraSign, partialSign]).complete();

      const txHash = await assembledTx.submit();
      
      console.log(txHash);
      setTxHash(txHash);
      return txHash;
    } catch (e: any) {
      console.log(e);
    }
  }, [lucid, wallet]);

  return { createTx, txHash };
}