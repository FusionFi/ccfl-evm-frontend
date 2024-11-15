import React from 'react';
import { oracleUpdateTx } from '../transactions/oracleUpdate'; 
import { oracleTokenName, price1 } from '../variables';

function OracleUpdateComponent({ wallet }: { wallet: any }) {
  const { createTx, txHash } = oracleUpdateTx(wallet, price1, oracleTokenName);

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={createTx}>Oracle Update</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default OracleUpdateComponent;