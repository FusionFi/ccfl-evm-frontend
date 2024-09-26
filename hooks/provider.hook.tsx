import { useCallback, useState } from 'react';
import BigNumber from 'bignumber.js';

export function useApproval(provider: any) {
    const approve = useCallback(async (params: any) => {
        const tx = await provider.approve(params)

        return tx;
    }, [provider]) as any

    return [approve];
}

export function useAllowance(provider: any) {

    const [allowance, setAllowance] = useState<any>(0);

    const refetch = useCallback(async (params: any) => {
        try {
            console.log('refetch: ', params)
            const result = await provider.fetchAllowance(params)
            setAllowance(new BigNumber(result || 0).toString())
        } catch (error) {
            console.error('fetch allowance failed: ', error)
        }
    }, [
        provider, setAllowance
    ])

    return [allowance || 0, refetch];
}

export function useSupply(provider: any) {
    const supply = useCallback(async (params: any) => {
        const tx = await provider.supply(params)

        return tx;
    }, [provider]) as any

    return [supply];
}

export function useTxFee(provider: any) {

    const [txFee, setTxFee] = useState<any>(0);

    const estimateNormalTxFee = useCallback(async (params: any) => {
        try {
            const result = await provider.estimateNormalTxFee(params)
            setTxFee(new BigNumber(result || 0).toString())
        } catch (error) {
            console.error('estimate tx fee failed: ', error)
        }
    }, [
        provider, setTxFee
    ])

    return [txFee || 0, estimateNormalTxFee];
}