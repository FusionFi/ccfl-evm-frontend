import React from 'react';
import { makeVariables } from '../transactions/makeVariables'; 

function GenerateValidatorsComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = makeVariables(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Sign Transaction</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default GenerateValidatorsComponent;