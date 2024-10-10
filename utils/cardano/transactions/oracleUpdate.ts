import { Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH } from '../owner';
import { oracleUpdateAction } from '../redeemers';
import { oracleAddr, oracleVal } from '../validators';
import { oracleUnit } from '../variables';

export function oracleUpdateTx(
  wallet: any, 
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

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const utxo: UTxO = utxos[0]
      const oracleDatum = oracleDatum1

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], oracleUpdateAction)
        .payToContract(
          oracleAddr,
          { inline: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .attachSpendingValidator(oracleVal)
        .addSignerKey(ownerPKH)
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