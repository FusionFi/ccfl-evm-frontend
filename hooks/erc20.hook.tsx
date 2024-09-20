import { useCallback } from 'react';
import { useWriteContract, useReadContract } from 'wagmi'
import AbiERC20 from '@/utils/contract/abi/erc20.json'
import { waitForTransactionReceipt } from '@wagmi/core'

export function useApproval({ contractAddress, abi, config }: any) {
    const { data: hash, writeContractAsync } = useWriteContract()

    if (!abi) {
        abi = AbiERC20;
    }
    const approve = useCallback(async ({ spender, value }: any) => {
        const result = await writeContractAsync({
            address: contractAddress,
            abi,
            functionName: 'approve',
            args: [spender, value],
        })

        const tx = await waitForTransactionReceipt(config, {
            confirmations: 1,
            hash: result
        })

        return tx;
    }, [writeContractAsync, contractAddress, abi, config]) as any

    return [hash, approve];
}

export function useAllowance({ contractAddress, abi, owner, spender, config }: any) {
    if (!abi) {
        abi = AbiERC20;
    }

    const { data, refetch } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'allowance',
        args: [owner, spender],
        config
    })

    const allowance: any = data || 0
    return [allowance, refetch];
}

