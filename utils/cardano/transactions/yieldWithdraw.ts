import { Constr, Data, Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { ownerPKH } from '../owner';
import { withdrawYieldAction } from '../redeemers';
import { yieldAddr, collateralAddr, configAddr, withdrawAddr, collateralVal, yieldVal, withdraw } from '../validators';
import { loanUnit, configUnit } from '../variables';

export function yieldWithdrawTx(wallet: any) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState("None");
  // const ownerPKH = process.env.

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

      const yieldUtxos: UTxO[] = await lucid.utxosAt(yieldAddr)
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const collateralIn = cUtxo.assets.lovelace
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const inDatum = Data.from(cUtxo.datum)
      const inYield = inDatum.fields[2]
      const outYield = 0n

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
        .payToContract(
          collateralAddr,
          { inline: newDatum },
          {
            lovelace: (collateralIn + inYield),
            [loanUnit]: 1n
          }
        )
        .attachSpendingValidator(collateralVal)
        .attachSpendingValidator(yieldVal)
        .attachWithdrawalValidator(withdraw)
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