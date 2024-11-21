import { Lucid, toHex, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { ownerAddress, ownerPKH, ownerSKey } from '../owner';
import { makeOracleMintAction } from '../evoRedeemers';
import { configAddr, oracleCS, oracleMint, oracleAddr, interestAddr } from '../evoValidators';
import { borrowed, configUnit, term } from '../variables';
import { makeInterestDatum, makeOracleDatum } from '../evoDatums';

export function oracleMintTx(
  wallet: any, 
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

      const oracleMintAction = makeOracleMintAction(
        exchangeRate, 
        Date.now(),
        currency, 
        supply,
        0,
        base,
        optimal,
        slope1,
        slope2,
        term
      )

      const oracleDatum = makeOracleDatum(
        exchangeRate, 
        Date.now(),
        currency, 
        supply,
        0,
      )

      const interestDatum = makeInterestDatum(
        base, 
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
      console.log(oracleTN)
      const oracleUnit = toUnit(oracleCS, oracleTN)

      console.log('Oracle Unit: ', oracleUnit)

      console.log('Config UTxO: ', configIn)

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