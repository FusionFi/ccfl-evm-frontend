import React from 'react';
import { configUpdateTx } from '../transactions/configUpdate'; 

function ConfigUpdateButton({ wallet }: { wallet: any }) {
  const { createTx, txHash } = configUpdateTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Config Update</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default ConfigUpdateButton;