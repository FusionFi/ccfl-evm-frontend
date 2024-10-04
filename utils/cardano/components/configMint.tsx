import React from 'react';
import { configMintTx } from '../transactions/configMint'; 

function ConfigMintButton({ wallet }: { wallet: any }) {
  const { createTx, txHash } = configMintTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Config Mint</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default ConfigMintButton;