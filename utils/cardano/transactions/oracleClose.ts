import { Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { ownerPKH, ownerSKey } from '../owner';
import { oracleCloseAction, oracleBurnAction } from '../evoRedeemers';
import { oracleAddr, interestAddr, oracleSpend, interestSpend, oracleMint, oracleCS } from '../evoValidators';
import { oracleUnit } from '../variables';

export function oracleCloseTx(wallet: any, oracleTokenName: string) {
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
      const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const utxo: UTxO = utxos[0]
      const iUtxos: UTxO[] = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
      const interestUtxo: UTxO = iUtxos[0]

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], oracleCloseAction)
        .collectFrom([interestUtxo], oracleCloseAction)
        .attach.SpendingValidator(oracleSpend)
        .attach.SpendingValidator(interestSpend)
        .mintAssets({
          [oracleUnit]: -2n,
        }, oracleBurnAction)
        .attach.MintingPolicy(oracleMint)
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