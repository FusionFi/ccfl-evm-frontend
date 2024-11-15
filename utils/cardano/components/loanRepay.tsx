import React from 'react';
import { loanRepayTx } from '../transactions/loanRepay'; 
import { loanTokenName, oracleTokenName, price1 } from '../variables';

function LoanRepayComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = loanRepayTx(wallet, loanTokenName, 100, oracleTokenName, price1);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Loan Repay</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default LoanRepayComponent;