import { Constr, Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { makeYieldDatum } from '../evoDatums';
import { ownerPKH, ownerSKey } from '../owner';
import { depositYieldAction } from '../evoRedeemers';
import { collateralAddr, configAddr, depositAddr, yieldAddr, yieldDeposit, collateralSpend, loanCS } from '../evoValidators';
import { loanUnit, configUnit } from '../variables';

export function yieldDepositTx(
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

      const loanUnit = toUnit(loanCS, loanTokenName)
      const timestamp = Date.now()

      const yieldAmt = BigInt(yieldAmount)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const inDatum = Data.from(cUtxo.datum!)
      const inYield = inDatum.fields[2]
      const outYield = inYield + yieldAmt
      const inCollateral = cUtxo.assets.lovelace

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

      const yieldDatum = makeYieldDatum(
        loanTokenName
      )

      const tx = await lucid
        .newTx()
        .collectFrom(
          [cUtxo],
          depositYieldAction
        )
        .readFrom([configIn])
        .withdraw(depositAddr, 0n, withdrawRedeemer)
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: newDatum },
          {
            lovelace: (inCollateral - outYield),
            [loanUnit]: 1n
          }
        )
        .pay.ToContract(
          yieldAddr,
          { kind: "inline", value: yieldDatum },
          { lovelace: yieldAmt }
        )
        .attach.WithdrawalValidator(yieldDeposit)
        .attach.SpendingValidator(collateralSpend)
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