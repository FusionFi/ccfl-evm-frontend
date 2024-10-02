import React from 'react';
import { useTestTx } from './useTestTx'; // Adjust the import path as needed

function TestTxComponent({ wallet }: { wallet: string }) {
  const { createTx, txHash } = useTestTx(wallet);

  return (
    <div>
      <button onClick={createTx}>Create Transaction</button>
      <p>Transaction Hash: {txHash}</p>
    </div>
  );
}

export default TestTxComponent;