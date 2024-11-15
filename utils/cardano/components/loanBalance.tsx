import React from 'react';
import { loanBalanceTx } from '../transactions/loanBalance'; 
import { loanTokenName, loanAmt, oracleTokenName, price1 } from '../variables';

function LoanBalanceComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = loanBalanceTx(wallet, loanTokenName, loanAmt, 1000, oracleTokenName, price1);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Loan Balance</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default LoanBalanceComponent;