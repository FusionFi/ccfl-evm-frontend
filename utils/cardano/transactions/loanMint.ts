import { Data, Lucid, toHex, toUnit, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { makeOracleUpdateAction, makeLoanMintAction } from '../evoRedeemers';
import { loanCS, configAddr, oracleAddr, loanMint, loanAddr, collateralAddr, oracleSpend, oracleCS } from '../evoValidators';
import { configUnit } from '../variables';
import { makeCollateralDatum, makeLoanDatum, makeOracleDatum } from '../evoDatums';
import { ownerPKH, ownerSKey } from '../owner';

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
      console.log(configIn)
      const oracleUtxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
      const oracleUtxo: UTxO = oracleUtxos[0]
      console.log(oracleUtxo)
      const oracleExchangeRate = exchangeRate // exchangeRate * 1000
      const oracleInDatum = Data.from(oracleUtxo.datum!)
      const oracleDatum = makeOracleDatum(
        oracleExchangeRate, 
        timestamp, 
        oracleInDatum.fields[2], 
        oracleInDatum.fields[3], 
        (oracleInDatum.fields[4] + BigInt(loanAmt))
      ) 
      const oracleUpdateAction = makeOracleUpdateAction(
        oracleExchangeRate, 
        timestamp, 
        oracleInDatum.fields[3], 
        (oracleInDatum.fields[4] + BigInt(loanAmt))
      )

      const utxos: UTxO[] = await lucid.utxosAt(wallet.address)
      const utxo: UTxO = utxos[0]
      console.log(utxo)
      const loanTn = utxo.txHash.slice(0, 30).concat(toHex(new Uint8Array([utxo.outputIndex])))
      const loanUnit = toUnit(loanCS, loanTn)
      console.log(loanUnit)

      const term = timestamp + (1000 * 60 * 60 * 24 * 365)
      const loanDatum = makeLoanDatum(loanAmt, loanAmt, term, timestamp, oracleTokenName)
      const collateralEQ = loanAmt * 2
      const collateralDatum = makeCollateralDatum(collateralEQ, timestamp)
      const mintLoanAction = makeLoanMintAction(loanAmt, loanAmt, term, timestamp)

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .collectFrom([oracleUtxo], oracleUpdateAction)
        .readFrom([configIn])
        .mintAssets({
          [loanUnit]: 2n,
        }, mintLoanAction)
        .attach.MintingPolicy(loanMint)
        .pay.ToContract(
          loanAddr,
          { kind: "inline", value: loanDatum },
          { [loanUnit]: 1n }
        )
        .pay.ToContract(
          collateralAddr,
          { kind: "inline", value: collateralDatum },
          { lovelace: BigInt(collateralAmount), [loanUnit]: 1n }
        )
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