import React from 'react';
import { loanLiquidateTx } from '../transactions/loanLiquidate'; 
import { loanAmt, loanTokenName, oracleTokenName, price1 } from '../variables';

function LoanLiquidatComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = loanLiquidateTx(wallet, loanTokenName, loanAmt, 50, oracleTokenName, price1);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Loan Liquidate</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default LoanLiquidatComponent;