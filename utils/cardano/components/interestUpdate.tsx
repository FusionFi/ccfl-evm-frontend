import React from 'react';
import { interestUpdateTx } from '../transactions/interestUpdate'; 

function InterestUpdateButton({ wallet }: { wallet: any }) {
  const { createTx, txHash } = interestUpdateTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Interest Update</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default InterestUpdateButton;