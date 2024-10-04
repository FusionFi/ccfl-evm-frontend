import React from 'react';
import { oracleCloseTx } from '../transactions/oracleClose'; 

function OracleCloseComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = oracleCloseTx(wallet);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Oracle Close</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default OracleCloseComponent;