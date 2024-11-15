import { Data, Lucid, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { makeConfigDatum } from '../evoDatums';
import { makeConfigUpdateAction } from '../evoRedeemers';
import { configAddr, configVal, yieldHash } from '../evoValidators';
import { configUnit } from '../variables';
import { ownerPKH, ownerSKey } from '../owner';

export function configUpdateTx(
  wallet: any,
  loanHash: string,
  collateralHash: string,
  rewardsCS: string,
  oracleHash: string,
  interestHash: string,
  collateralHashz: string[]
) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState("None");
  const configUpdateAction = makeConfigUpdateAction(loanHash, collateralHash, rewardsCS, oracleHash, interestHash, collateralHashz);
  const configDatum = makeConfigDatum(loanHash, collateralHash, rewardsCS, oracleHash, interestHash, yieldHash, collateralHashz);

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

      const utxos: UTxO[] = await lucid.utxosAtWithUnit(configAddr, configUnit)
      const utxo: UTxO = utxos[0]

      const tx = await lucid
        .newTx()
        .collectFrom([utxo], configUpdateAction)
        .attach.SpendingValidator(configVal)
        .pay.ToContract(
          configAddr,
          { kind: "inline", value: configDatum },
          { [configUnit]: 1n }
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