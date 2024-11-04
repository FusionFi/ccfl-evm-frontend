import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, loanDatum, collateralDatum } from '../datums';
import { loanBalanceAction, oracleUpdateAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, balanceAddr, loanVal, collateralVal, oracleVal, balance, oracleCS, loanCS } from '../validators';
import { loanAmt, loanUnit, configUnit, oracleUnit } from '../variables';
import { makeCollateralDatum, makeLoanDatum, makeOracleDatum } from '../evoDatums';

export function loanBalanceTx(
  wallet: any, 
  loanTokenName: string, 
  loanAmt: number,
  tokenValue: number,
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

      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUnit = toUnit(oracleCS, oracleTokenName)
      const loanUnit = toUnit(loanCS, loanTokenName)
      
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const oracleExchangeRate = exchangeRate * 1000
      const oracleInDatum = Data.from(oracleUtxo.datum!)
      const oracleDatum = makeOracleDatum(
        oracleExchangeRate, 
        timestamp, 
        oracleInDatum.fields[2], 
        oracleInDatum.fields[3], 
        oracleInDatum.fields[4]
      ) 
      
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const loanInDatum = Data.from(lUtxo.datum!)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const collateralInValue = cUtxo.assets.lovelace
      const collateralInDatum = Data.from(cUtxo.datum!)
      
      const adaValue = loanAmt * 1000 / oracleExchangeRate
      const deposit = adaValue * 1000000

      const minValue = (deposit * 2) - collateralInDatum.fields[2]

      if (minValue < tokenValue) {
        throw Error("Insufficient collateral");
      }

      const collateralOut = collateralInValue + BigInt(tokenValue)
      const collateralOutDatum = makeCollateralDatum(collateralOut, timestamp)
      const loanOutDatum = makeLoanDatum(
        loanAmt, 
        loanInDatum.fields[1], 
        loanInDatum.fields[2], 
        timestamp, 
        oracleTokenName
      )

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanBalanceAction)
        .collectFrom([cUtxo], loanBalanceAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .withdraw(balanceAddr, 0n, withdrawRedeemer)
        .pay.ToContract(
          loanAddr,
          { kind: "inline", value: loanOutDatum },
          { [loanUnit]: 1n }
        )
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: collateralOutDatum },
          {
            lovelace: collateralOut,
            [loanUnit]: 1n,
          }
        )
        .pay.ToContract(
          oracleAddr,
          { kind: "inline", value: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .attach.SpendingValidator(loanVal)
        .attach.SpendingValidator(collateralVal)
        .attach.SpendingValidator(oracleVal)
        .attach.WithdrawalValidator(balance)
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