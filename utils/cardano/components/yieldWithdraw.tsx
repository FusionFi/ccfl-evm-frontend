import React from 'react';
import { yieldWithdrawTx } from '../transactions/yieldWithdraw'; 
import { loanTokenName, yieldAmount } from '../variables';

function YieldWithdrawComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = yieldWithdrawTx(wallet, loanTokenName, yieldAmount);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Yield Withdraw</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default YieldWithdrawComponent;