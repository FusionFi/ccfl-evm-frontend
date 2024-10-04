import { Constr, Data, Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { interestPayAddr, ownerPKH } from '../owner';
import { loanRepayAction, oracleUpdateAction } from '../redeemers';
import { interestAddr, loanAddr, collateralAddr, configAddr, oracleAddr, repayAddr, loanVal, collateralVal, oracleVal, repay } from '../validators';
import { oracleUnit, loanUnit, configUnit, timestamp, interestCalc, rewards, term, oracleTn } from '../variables';

export function loanRepayTx(wallet: any) {
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

      const oracleDatum = Data.from(oracleDatum1)
      const interestUtxos = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
      const interestIn = interestUtxos[0]
      const exchange = oracleDatum.fields[0]
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const inDatum = Data.from(lUtxo.datum)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const collateralValue = 2000000n
      const remainingValue = 0n

      const loanValue = inDatum.fields[0]
      const interestTimeframe = Number(timestamp - inDatum.fields[3]) * interestCalc(5.5, 70, 4, 300, 1000000, 200000) /// 100 + 1)
      const accruedInterest = BigInt(Math.floor((Number(loanValue * 1000n / exchange) * interestTimeframe) / 1000000))

      const timeframe = 31556926000 / (Number(timestamp - inDatum.fields[3]))
      const interest = interestCalc(5.5, 70, 4, 300, 1000000, 200000)
      const recalc = (Number(loanValue) * interest) / timeframe
      const interestP = recalc * 1000 / Number(exchange)
      const payment = Math.floor(interestP * 1000000) + 1

      console.log(timestamp)
      console.log(timeframe)
      console.log(interest)
      console.log(recalc)
      console.log(interestP)
      console.log(payment)

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [1n]
        ])
      )

      // console.log(lUtxo)

      const loanDatum = Data.to(
        new Constr(0, [
          remainingValue,
          rewards,
          term,
          timestamp,
          oracleTn
        ])
      )

      const collateralDatum = Data.to(
        new Constr(0, [
          remainingValue,
          timestamp,
          0n
        ])
      )

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanRepayAction)
        .collectFrom([cUtxo], loanRepayAction)
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .readFrom([interestIn])
        .withdraw(repayAddr, 0n, withdrawRedeemer)
        .payToContract(
          loanAddr,
          { inline: loanDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { inline: collateralDatum },
          { lovelace: collateralValue, [loanUnit]: 1n }
        )
        .payToContract(
          oracleAddr,
          { inline: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .payToAddress(
          interestPayAddr,
          { lovelace: (BigInt(payment) + 2000000n) },
        )
        .attachSpendingValidator(loanVal)
        .attachSpendingValidator(collateralVal)
        .attachSpendingValidator(oracleVal)
        .attachWithdrawalValidator(repay)
        .addSignerKey(process.env.NEXT_PUBLIC_OWNER_PKH!)
        .complete()
      
      const txString = await tx.toString()

      const infraSign = await lucid.fromTx(txString).partialSignWithPrivateKey(process.env.NEXT_PUBLIC_OWNER_SKEY!)
      const partialSign = await lucid.fromTx(txString).partialSign()
      
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