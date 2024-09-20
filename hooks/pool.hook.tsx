import { useCallback } from 'react';
import { useWriteContract, useReadContract } from 'wagmi'
import AbiPool from '@/utils/contract/abi/ccflPool.json'

export function useSupply({ contractAddress }: any) {
    const { writeContractAsync } = useWriteContract()

    const supply = useCallback(async ({ amount }: any) => {
        return await writeContractAsync({
            address: contractAddress,
            abi: AbiPool,
            functionName: 'supply',
            args: [amount],
        })
    }, [writeContractAsync, contractAddress]) as any


    return [supply];
}
