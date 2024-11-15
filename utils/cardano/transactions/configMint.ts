import { Lucid, UTxO } from '@lucid-evolution/lucid';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
import { makeConfigDatum } from '../evoDatums';
import { makeConfigUpdateAction } from '../evoRedeemers';
import { configMint, configAddr, collateralHashz, loanHash, collateralHash, rewardsCS, oracleHash, interestHash, yieldHash } from '../evoValidators';
import { configUnit } from '../variables';
import { ownerPKH, ownerAddress, ownerSKey } from '../owner';

export function configMintTx(wallet: any) {
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

      const utxos: UTxO[] = await lucid.utxosAt(wallet.address);
      const utxo: UTxO = utxos[0]
      const configDatum = makeConfigDatum(
        loanHash,
        collateralHash,
        rewardsCS,
        oracleHash,
        interestHash,
        yieldHash,
        collateralHashz
      )
      const configUpdateAction = makeConfigUpdateAction(
        loanHash,
        collateralHash,
        rewardsCS,
        oracleHash,
        interestHash,
        collateralHashz
      )

      const tx = await lucid
        .newTx()
        .collectFrom([utxo])
        .mintAssets({
          [configUnit]: 1n,
        }, configUpdateAction)
        .attach.MintingPolicy(configMint)
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