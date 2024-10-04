import { Data, Lucid, toHex, toUnit, UTxO } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, loanDatum, collateralDatum } from '../datums';
import { oracleUpdateAction, mintLoanAction } from '../redeemers';
import { loanCS, configAddr, oracleAddr, loanMint, loanAddr, collateralAddr, oracleVal } from '../validators';
import { loanAmt, configUnit, oracleUnit } from '../variables';

export function loanMintTx(wallet: any) {
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

      const oracleOutDatum = Data.from(oracleDatum1) // Change the oracle datum here
      const deposit = loanAmt * 1000n / oracleOutDatum.fields[0]
      const utxos: UTxO[] = await lucid.utxosAt(wallet.address)
      const utxo: UTxO = utxos[0]
      const loanTn = utxo.txHash.slice(0, 30).concat(toHex(utxo.outputIndex))
      const loanUnit = toUnit(loanCS, loanTn)
      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]

      console.log(`Loan Unit: 
        ${loanUnit}
        `)
      console.log(`Collateral Value: `, deposit * 1000000n * 2n, `
        `)
      console.log(`Expected Collateral: `, ((loanAmt * 1000n) / oracleOutDatum.fields[0]) * 1000000n * 2n, `
      ` )

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .mintAssets({
          [loanUnit]: 2n,
        }, mintLoanAction)
        .attachMintingPolicy(loanMint)
        .payToContract(
          loanAddr,
          { inline: loanDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { inline: collateralDatum },
          { lovelace: (deposit * 1000000n * 2n), [loanUnit]: 1n }
        )
        .payToContract(
          oracleAddr,
          { inline: Data.to(oracleOutDatum) },
          { [oracleUnit]: 1n }
        )
        .attachSpendingValidator(oracleVal)
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