import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum7 } from '../datums';
import { ownerPKH, ownerSKey } from '../owner';
import { loanLiquidateAction, makeOracleUpdateAction } from '../evoRedeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, oracleSpend, loanSpend, collateralSpend, liquidateAddr, liquidateVal, loanCS, oracleCS } from '../evoValidators';
import { loanUnit, configUnit, oracleUnit, timestamp, oracleTn, loanCurrency, supply } from '../variables';
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
      const oracleDatum = makeOracleDatum(exchangeRate, timestamp, loanCurrency, supply, 0)
      const oracleUpdateAction = makeOracleUpdateAction(exchangeRate, timestamp, supply, 0)

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

      const liquidateLoanDatum = makeLoanDatum(newLoanValue, newLoanValue, inDatum.fields[2], timestamp, oracleTokenName)

      const liquidateCollateralDatum = makeCollateralDatum(newLoanValue * 2, timestamp)

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
          { kind: "inline", value: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .attach.SpendingValidator(oracleSpend)
        .attach.SpendingValidator(loanSpend)
        .attach.SpendingValidator(collateralSpend)
        .withdraw(liquidateAddr, 0n, withdrawRedeemer)
        .attach.WithdrawalValidator(liquidateVal)
        .addSignerKey(ownerPKH)
        .complete()

      const infraSign = await tx.partialSign.withPrivateKey(ownerSKey)
      const partialSign = await tx.partialSign.withWallet()

      const assembledTx = await tx.assemble([infraSign, partialSign]).complete();

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