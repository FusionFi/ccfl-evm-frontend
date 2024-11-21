import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { ownerPKH, ownerSKey } from '../owner';
import { withdrawYieldAction } from '../evoRedeemers';
import { yieldAddr, collateralAddr, configAddr, withdrawAddr, collateralSpend, yieldSpend, withdrawVal, loanCS } from '../evoValidators';
import { loanUnit, configUnit } from '../variables';

export function yieldWithdrawTx(
  wallet: any, 
  loanTokenName: string, 
  yieldAmount: number
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
      const loanUnit = toUnit(loanCS, loanTokenName)

      const yieldUtxos: UTxO[] = await lucid.utxosAt(yieldAddr)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const collateralIn = cUtxo.assets.lovelace
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const inDatum = Data.from(cUtxo.datum!)
      const inYield = inDatum.fields[2]
      const outYield = inYield - BigInt(yieldAmount)

      const newDatum = Data.to(
        new Constr(0, [
          inDatum.fields[0],
          inDatum.fields[1],
          outYield
        ])
      )

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [0n]
        ])
      )

      const tx = await lucid
        .newTx()
        .collectFrom(
          [cUtxo],
          withdrawYieldAction
        )
        .collectFrom(
          yieldUtxos,
          withdrawYieldAction
        )
        .readFrom([configIn])
        .withdraw(withdrawAddr, 0n, withdrawRedeemer)
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: newDatum },
          {
            lovelace: (collateralIn + BigInt(yieldAmount)),
            [loanUnit]: 1n
          }
        )
        .attach.SpendingValidator(collateralSpend)
        .attach.SpendingValidator(yieldSpend)
        .attach.WithdrawalValidator(withdrawVal)
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