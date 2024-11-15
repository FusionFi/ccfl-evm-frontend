import { Lucid, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { makeConfigDatum } from '../evoDatums';
import { configCloseAction, makeConfigUpdateAction } from '../evoRedeemers';
import { configMint, configAddr, configVal } from '../evoValidators';
import { configUnit } from '../variables';
import { ownerPKH, ownerSKey } from '../owner';

export function configBurnTx(wallet: any) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState("None");

  useEffect(() => {
    if (!lucid && wallet) {
      initLucid(wallet).then((lucid: Lucid) => {
        setLucid(lucid);
      });
    }
  }, [lucid, wallet]);

  const createTx = useCallback(async () => {
    try {
      if (!lucid) {
        throw Error("Lucid not instantiated");
      }
      console.log(wallet);

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const utxo: UTxO = utxos[0]

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], configCloseAction)
        .mintAssets({
          [configUnit]: -1n,
        }, configCloseAction)
        .attach.MintingPolicy(configMint)
        .attach.SpendingValidator(configVal)
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