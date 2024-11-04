import { Data, Lucid, toHex, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { oracleDatum1, loanDatum, collateralDatum } from '../datums';
import { oracleUpdateAction, mintLoanAction } from '../redeemers';
import { loanCS, configAddr, oracleAddr, loanMint, loanAddr, collateralAddr, oracleVal, oracleCS } from '../validators';
import { loanAmt, configUnit, oracleUnit } from '../variables';
import { makeCollateralDatum, makeLoanDatum, makeOracleDatum } from '../evoDatums';

export function loanMintTx(
  wallet: any,
  loanAmt: number, 
  oracleTokenName: string, 
  collateralAmount: number,
  exchangeRate: number
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
      
      const minDeposit = (loanAmt * 1000 / exchangeRate) * 1000000 * 2
      if (!(collateralAmount >= minDeposit)) {
        throw Error("Insufficient collateral")
      }

      const configUtxos = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const configIn = configUtxos[0]
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      const oracleExchangeRate = exchangeRate * 1000
      const oracleInDatum = Data.from(oracleUtxo.datum!)
      const oracleDatum = makeOracleDatum(
        oracleExchangeRate, 
        timestamp, 
        oracleInDatum.fields[2], 
        oracleInDatum.fields[3], 
        oracleInDatum.fields[4]
      ) 

      const utxos: UTxO[] = await lucid.utxosAt(wallet.address)
      const utxo: UTxO = utxos[0]
      const loanTn = utxo.txHash.slice(0, 30).concat(toHex(new Uint8Array([utxo.outputIndex])))
      const loanUnit = toUnit(loanCS, loanTn)

      const term = timestamp + (1000 * 60 * 60 * 24 * 365)
      const loanDatum = makeLoanDatum(loanAmt, loanAmt, term, timestamp, oracleTokenName)
      const collateralDatum = makeCollateralDatum(collateralAmount, timestamp)
      // console.log(`Loan Unit: 
      //   ${loanUnit}
      //   `)
      // console.log(`Collateral Value: `, deposit * 1000000 * 2, `
      //   `)
      // console.log(`Expected Collateral: `, ((loanAmt * 1000) / oracleOutDatum.fields[0]) * 1000000 * 2, `
      // ` )

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .mintAssets({
          [loanUnit]: 2n,
        }, mintLoanAction)
        .attach.MintingPolicy(loanMint)
        .payToContract(
          loanAddr,
          { kind: "inline", value: loanDatum },
          { [loanUnit]: 1n }
        )
        .payToContract(
          collateralAddr,
          { kind: "inline", value: collateralDatum },
          { lovelace: BigInt(collateralAmount), [loanUnit]: 1n }
        )
        .payToContract(
          oracleAddr,
          { kind: "inline", value: oracleDatum },
          { [oracleUnit]: 1n }
        )
        .attach.SpendingValidator(oracleVal)
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