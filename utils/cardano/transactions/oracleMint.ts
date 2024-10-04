import { Lucid, toHex, toUnit, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, interestDatum } from '../datums';
import { ownerAddress, ownerPKH } from '../owner';
import { oracleMintAction } from '../redeemers';
import { configAddr, oracleCS, oracleMint, oracleAddr, interestAddr } from '../validators';
import { configUnit } from '../variables';

export function oracleMintTx(wallet: any) {
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

      const oracleDatum = oracleDatum1
      const utxos: UTxO[] = await lucid.utxosAt(wallet.address)
      const utxo: UTxO = utxos[0]
      const configUtxos: UTxO[] = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn: UTxO = configUtxos[0]
      const oracleTN = utxo.txHash.slice(0, 30).concat(toHex(utxo.outputIndex))
      const oracleUnit = toUnit(oracleCS, oracleTN)

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .readFrom([configIn])
        .mintAssets({
          [oracleUnit]: 2n,
        }, oracleMintAction)
        .attachMintingPolicy(oracleMint)
        .payToContract(
          oracleAddr,
          { inline: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .payToContract(
          interestAddr,
          { inline: interestDatum },
          { [oracleUnit]: 1n }
        )
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