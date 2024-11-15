import React from 'react';
import { loanCloseTx } from '../transactions/loanClose'; 
import { loanTokenName, oracleTokenName, price1 } from '../variables';

function LoanCloseComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = loanCloseTx(wallet, loanTokenName, oracleTokenName, price1);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Loan Close</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default LoanCloseComponent;