import React from 'react';
import { oracleMintTx } from '../transactions/oracleMint'; 
import { price1, loanCurrency, base, optimal, slope1, slope2, supply, term } from '../variables';

function OracleMintComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = oracleMintTx(wallet, price1, loanCurrency, base, optimal, slope1, slope2, supply, term);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Oracle Mint</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default OracleMintComponent;