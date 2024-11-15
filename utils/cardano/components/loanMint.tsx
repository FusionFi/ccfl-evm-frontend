import React from 'react';
import { loanMintTx } from '../transactions/loanMint'; 
import { collateralAmt, loanAmt, oracleTokenName, price1 } from '../variables';

function LoanMintComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = loanMintTx(wallet, loanAmt, oracleTokenName, collateralAmt, price1);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Loan Mint</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default LoanMintComponent;