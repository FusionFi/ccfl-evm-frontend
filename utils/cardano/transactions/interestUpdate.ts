import { Lucid, UTxO, toUnit } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { ownerPKH, ownerSKey } from '../owner';
import { makeInterestUpdateAction } from '../evoRedeemers';
import { interestAddr, interestSpend, oracleCS } from '../evoValidators';
import { oracleUnit } from '../variables';
import { makeInterestDatum } from '../evoDatums';

export function interestUpdateTx(
  wallet: any, 
  oracleTokenName: string, 
  base: number, 
  optimal: number, 
  slope1: number, 
  slope2: number
) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState("None");
  const interestUpdateAction = makeInterestUpdateAction(base, optimal, slope1, slope2, 0);
  const interestDatum = makeInterestDatum(base, optimal, slope1, slope2, 0);

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

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
      const utxo: UTxO = utxos[0]

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], interestUpdateAction)
        .attach.SpendingValidator(interestSpend)
        .pay.ToContract(
          interestAddr,
          { kind: "inline", value: interestDatum },
          { [oracleUnit]: 1n },
        )
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