import { Lucid } from '@lucid-evolution/lucid';
import { initLucid } from './blockfrost';
import { useEffect, useState, useCallback } from 'react';

export function useTestTx(wallet: any) {
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

      const tx = await lucid
        .newTx()
        .pay.ToAddress(wallet.address, { lovelace: 10000000n })
        .complete();
        
      const signedTx = await tx.sign.withWallet().complete();

      const txHash = await signedTx.submit();
      
      console.log(txHash);
      setTxHash(txHash);
      return txHash;
    } catch (e: any) {
      console.log(e);
    }
  }, [lucid, wallet]);

  return { createTx, txHash };
}