import { Constr, Data, Lucid, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1 } from '../datums';
import { ownerPKH } from '../owner';
import { loanCloseAction, oracleUpdateAction, burnLoanAction } from '../redeemers';
import { loanAddr, collateralAddr, configAddr, oracleAddr, loanMint, closeAddr, loanVal, collateralVal, oracleVal, close } from '../validators';
import { loanUnit, configUnit, oracleUnit } from '../variables';

export function loanBurnTx(wallet: any) {
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

      const oracleDatum = Data.from(oracleDatum1)
      const lUtxos: UTxO[] = await lucid.utxosAtWithUnit(loanAddr, loanUnit)
      const lUtxo: UTxO = lUtxos[0]
      const cUtxos: UTxO[] = await lucid.utxosAtWithUnit(collateralAddr, loanUnit)
      const cUtxo: UTxO = cUtxos[0]
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const exchange = oracleDatum[0]
      const inDatum = Data.from(lUtxo.datum)

      const withdrawRedeemer = Data.to(
        new Constr(0, [
          [0n]
        ])
      )

      // console.log(lUtxo)
      // console.log(cUtxo)

      const tx = await lucid
        .newTx()
        .collectFrom([lUtxo], loanCloseAction)
        .collectFrom([cUtxo], loanCloseAction)
        .readFrom([configIn])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .mintAssets({
          [loanUnit]: -2n,
        }, burnLoanAction)
        .attachMintingPolicy(loanMint)
        .payToContract(oracleAddr,
          { inline: Data.to(oracleDatum) },
          { [oracleUnit]: 1n }
        )
        .withdraw(closeAddr, 0n, withdrawRedeemer)
        .attachSpendingValidator(loanVal)
        .attachSpendingValidator(collateralVal)
        .attachSpendingValidator(oracleVal)
        .attachWithdrawalValidator(close)
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