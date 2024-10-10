import { Constr, Data, Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, loanDatum, collateralDatum } from '../datums';
import { loanBalanceAction, oracleUpdateAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, balanceAddr, loanVal, collateralVal, oracleVal, balance } from '../validators';
import { loanAmt, loanUnit, configUnit, oracleUnit } from '../variables';

export function loanBalanceTx(
  wallet: any, 
  loanTokenName: string, 
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

      const oracleDatum = Data.from(oracleDatum1) // set to oracleDatum1 by default
      const oracleExchangeRate = oracleDatum.fields[0]
      const adaValue = loanAmt * 1000n / oracleExchangeRate
      const deposit = adaValue * 1000000n
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const inDatum = Data.from(cUtxo.datum!)
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