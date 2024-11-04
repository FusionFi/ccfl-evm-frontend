import { Lucid, toHex, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, interestDatum } from '../datums';
import { ownerAddress, ownerPKH } from '../owner';
import { oracleMintAction } from '../redeemers';
import { configAddr, oracleCS, oracleMint, oracleAddr, interestAddr } from '../validators';
import { borrowed, configUnit, term } from '../variables';
import { makeinterestDatum, makeOracleDatum } from '../evoDatums';

export function oracleMintTx(
  wallet: any, 
  oracleTokenName: string, 
  exchangeRate: number, 
  currency: string, 
  base: number, 
  optimal: number, 
  slope1: number, 
  slope2: number, 
  supply: number,
  term: number
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

      const oracleDatum = makeOracleDatum(
        exchangeRate, 
        currency, 
        base, 
        supply,
        borrowed,
      )

      const interestDatum = makeinterestDatum(
        currency, 
        optimal, 
        slope1, 
        slope2,
        term,
      )
      const utxos: UTxO[] = await lucid.utxosAt(wallet.address)
      const utxo: UTxO = utxos[0]
      const configUtxos: UTxO[] = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn: UTxO = configUtxos[0]
      const oracleTN = utxo.txHash.slice(0, 30).concat(toHex(new Uint8Array([utxo.outputIndex])))
      const oracleUnit = toUnit(oracleCS, oracleTN)

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .readFrom([configIn])
        .mintAssets({
          [oracleUnit]: 2n,
        }, oracleMintAction)
        .attach.MintingPolicy(oracleMint)
        .pay.ToContract(
          oracleAddr,
          { kind: "inline", value: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .pay.ToContract(
          interestAddr,
          { kind: "inline", value: interestDatum },
          { [oracleUnit]: 1n }
        )
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