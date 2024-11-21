import { Data, Lucid, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH, ownerSKey } from '../owner';
import { makeOracleUpdateAction } from '../evoRedeemers';
import { oracleAddr, oracleCS, oracleSpend } from '../evoValidators';
import { oracleUnit } from '../variables';
import { makeOracleDatum } from '../evoDatums';

export function oracleUpdateTx(
  wallet: any, 
  exchangeRate: number,
  oracleTokenName: string,
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
      const oracleUnit = toUnit(oracleCS, oracleTokenName)      

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const utxo: UTxO = utxos[0]

      const oracleExchangeRate = exchangeRate //exchangeRate * 1000
      const oracleInDatum = Data.from(utxo.datum!)
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

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], oracleUpdateAction)
        .pay.ToContract(
          oracleAddr,
          { kind: "inline", value: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .attach.SpendingValidator(oracleSpend)
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