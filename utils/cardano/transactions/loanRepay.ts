import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { collateralDatum, loanDatum, oracleDatum1 } from '../datums';
import { interestPayAddr, ownerPKH } from '../owner';
import { loanRepayAction, oracleUpdateAction } from '../redeemers';
import { interestAddr, loanAddr, collateralAddr, configAddr, oracleAddr, repayAddr, loanVal, collateralVal, oracleVal, repay, loanCS, oracleCS } from '../validators';
import { oracleUnit, loanUnit, configUnit, timestamp, interestCalc, rewards, term, oracleTn, loanAmt } from '../variables';
import { makeOracleDatum, makeCollateralDatum, makeLoanDatum } from '../evoDatums';

export function loanRepayTx(
  wallet: any, 
  loanTokenName: string, 
  repayAmt: number, 
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

      const interestUtxos = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
      const interestIn = interestUtxos[0]
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const loanInDatum = Data.from(lUtxo.datum!)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const collateralInValue = cUtxo.assets.lovelace
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const remainingValue = loanInDatum.fields[0] - BigInt(repayAmt)

      const loanValue = loanInDatum.fields[0]
      const interestTimeframe = Number(timestamp - loanInDatum.fields[3]) * interestCalc(5.5, 70, 4, 300, 1000000, 200000) /// 100 + 1)
      const accruedInterest = BigInt(Math.floor(((loanValue * 1000 / exchangeRate) * interestTimeframe) / 1000000))

      const timeframe = 31556926000 / (Number(timestamp - loanInDatum.fields[3]))
      const interest = interestCalc(5.5, 70, 4, 300, 1000000, 200000)
      const recalc = (Number(loanValue) * interest) / timeframe
      const interestP = recalc * 1000 / Number(exchangeRate)
      const payment = Math.floor(interestP * 1000000) + 1

      // console.log(timestamp)
      // console.log(timeframe)
      // console.log(interest)
      // console.log(recalc)
      // console.log(interestP)
      // console.log(payment)

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      const collateralOutValue = collateralInValue - BigInt(repayAmt / exchangeRate * 1000) + 2000000n
      const collateralOutDatum = makeCollateralDatum(collateralOut, timestamp)
      const loanOutDatum = makeLoanDatum(
        loanAmt, 
        loanInDatum.fields[1], 
        loanInDatum.fields[2], 
        timestamp, 
        oracleTokenName
      )

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanRepayAction)
        .collectFrom([cUtxo], loanRepayAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .readFrom([interestIn])
        .withdraw(repayAddr, 0n, withdrawRedeemer)
        .pay.ToContract(
          loanAddr,
          { kind: "inline", value: loanOutDatum },
          { [loanUnit]: 1n }
        )
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: collateralOutDatum },
          { lovelace: collateralOutValue, [loanUnit]: 1n }
        )
        .pay.ToContract(
          oracleAddr,
          { kind: "inline", value: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .pay.ToAddress(
          interestPayAddr,
          { lovelace: (BigInt(payment) + 2000000n) },
        )
        .attach.SpendingValidator(loanVal)
        .attach.SpendingValidator(collateralVal)
        .attach.SpendingValidator(oracleVal)
        .attach.WithdrawalValidator(repay)
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