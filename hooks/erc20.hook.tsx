import { useCallback } from 'react';
import { useWriteContract, useReadContract } from 'wagmi'
import AbiERC20 from '@/utils/contract/abi/erc20.json'

export function useApproval({ contractAddress, abi }: any) {
    const { data: hash, writeContractAsync } = useWriteContract()

    if (!abi) {
        abi = AbiERC20;
    }
    const approve = useCallback(async ({ spender, value }: any) => {
        return await writeContractAsync({
            address: contractAddress,
            abi,
            functionName: 'approve',
            args: [spender, value],
        })
    }, [writeContractAsync, contractAddress, abi]) as any


    return [hash, approve];
}

export function useAllowance({ contractAddress, abi, owner, spender, config }: any) {
    if (!abi) {
        abi = AbiERC20;
    }

    const result = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'allowance',
        args: [owner, spender],
        config
    })

    const allowance: any = result?.data || 0
    return [allowance];
}

