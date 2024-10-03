import { Lucid } from 'lucid-cardano';
import { initLucid } from './blockfrost';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
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
        .payToAddress(wallet, { lovelace: 10000000n })
        .complete();
        
      const signedTx = await tx.sign().complete();

      const txHash = await signedTx.submit();
      
      console.log(txHash);
      setTxHash(txHash);
      return txHash;
    } catch (e: any) {
      console.log(e);
      // createToaster(e.toString(), "alert");
    }
  }, [lucid, wallet]);

  return { createTx, txHash };
}