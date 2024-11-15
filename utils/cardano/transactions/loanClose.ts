import { Constr, Data, fromText, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH, ownerSKey } from '../owner';
import { loanCloseAction, makeOracleUpdateAction, burnLoanAction, rewardsMintAction } from '../evoRedeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, rewardsCS, loanMint, rewardsMint, closeAddr, loanSpend, collateralSpend, oracleSpend, closeVal, loanCS, oracleCS } from '../evoValidators';
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
      const oracleUpdateAction = makeOracleUpdateAction(
        oracleExchangeRate, 
        timestamp, 
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
        .attach.SpendingValidator(loanSpend)
        .attach.SpendingValidator(collateralSpend)
        .attach.SpendingValidator(oracleSpend)
        .attach.WithdrawalValidator(closeVal)
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