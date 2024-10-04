import React from 'react';
import { configBurnTx } from '../transactions/configBurn'; 

function ConfigBurnButton({ wallet }: { wallet: any }) {
  const { createTx, txHash } = configBurnTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Config Burn</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default ConfigBurnButton;