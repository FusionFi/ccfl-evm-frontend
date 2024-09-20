import { useCallback } from 'react';
import { useWriteContract, useReadContract } from 'wagmi'
import AbiPool from '@/utils/contract/abi/ccflPool.json'
import { waitForTransactionReceipt } from '@wagmi/core'

export function useSupply({ contractAddress, config }: any) {
    const { writeContractAsync } = useWriteContract()

    const supply = useCallback(async ({ amount }: any) => {
        const result = await writeContractAsync({
            address: contractAddress,
            abi: AbiPool,
            functionName: 'supply',
            args: [amount],
        })

        const tx = await waitForTransactionReceipt(config, {
            confirmations: 1,
            hash: result
        })

        return tx;
    }, [writeContractAsync, contractAddress, config]) as any


    return [supply];
}
