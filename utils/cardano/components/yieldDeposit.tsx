import React from 'react';
import { yieldDepositTx } from '../transactions/yieldDeposit'; 

function YieldDepositComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = yieldDepositTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Yield Deposit</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default YieldDepositComponent;