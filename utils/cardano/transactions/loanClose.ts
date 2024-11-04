import { Constr, Data, fromText, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH } from '../owner';
import { loanCloseAction, oracleUpdateAction, burnLoanAction, rewardsMintAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, rewardsCS, loanMint, rewardsMint, closeAddr, loanVal, collateralVal, oracleVal, close, loanCS, oracleCS } from '../validators';
import { loanUnit, configUnit, oracleUnit } from '../variables';
import { makeOracleDatum } from '../evoDatums';

export function loanCloseTx(
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
      const timestamp = Date.now()

      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUnit = toUnit(oracleCS, oracleTokenName)
      const loanUnit = toUnit(loanCS, loanTokenName)

      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const oracleInDatum = Data.from(oracleUtxo.datum!)
      const oracleExchangeRate = exchangeRate * 1000
      const oracleDatum = makeOracleDatum(
        oracleExchangeRate, 
        timestamp, 
        oracleInDatum.fields[2], 
        oracleInDatum.fields[3], 
        oracleInDatum.fields[4]
      )
      
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const inDatum = Data.from(lUtxo.datum!)
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
        .attach.MintingPolicy(loanMint)
        .attach.MintingPolicy(rewardsMint)
        .pay.ToContract(oracleAddr,
          { kind: "inline", value: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .withdraw(closeAddr, 0n, withdrawRedeemer)
        .attach.SpendingValidator(loanVal)
        .attach.SpendingValidator(collateralVal)
        .attach.SpendingValidator(oracleVal)
        .attach.WithdrawalValidator(close)
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