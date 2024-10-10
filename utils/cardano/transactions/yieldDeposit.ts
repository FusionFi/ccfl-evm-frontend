import { Constr, Data, Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { yieldDatum } from '../datums';
import { ownerPKH } from '../owner';
import { depositYieldAction } from '../redeemers';
import { collateralAddr, configAddr, depositAddr, yieldAddr, deposit, collateralVal } from '../validators';
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

      const yieldAmt = 1000000n
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const inDatum = Data.from(cUtxo.datum)
      const inYield = inDatum.fields[2]
      const outYield = inYield + yieldAmt
      const inCollateral = cUtxo.assets.lovelace
      console.log(inCollateral)

      console.log(inDatum)

      const newDatum = Data.to(
        new Constr(0, [
          inDatum.fields[0],
          inDatum.fields[1],
          outYield
        ])
      )

      console.log(Data.from(newDatum))

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [0n]
        ])
      )

      const tx = await lucid
        .newTx()
        .collectFrom(
          [cUtxo],
          depositYieldAction
        )
        .readFrom([configIn])
        .withdraw(depositAddr, 0n, withdrawRedeemer)
        .payToContract(
          collateralAddr,
          { inline: newDatum },
          {
            lovelace: (inCollateral - outYield),
            [loanUnit]: 1n
          }
        )
        .payToContract(
          yieldAddr,
          { inline: yieldDatum },
          { lovelace: yieldAmt }
        )
        .attachWithdrawalValidator(deposit)
        .attachSpendingValidator(collateralVal)
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