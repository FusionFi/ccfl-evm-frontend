import { useCallback, useState } from 'react';
import BigNumber from 'bignumber.js';

export function useApproval(provider: any) {
  const approve = useCallback(
    async (params: any) => {
      const tx = await provider.approve(params);

      return tx;
    },
    [provider],
  ) as any;

  return [approve];
}

export function useAllowance(provider: any) {
  const [allowance, setAllowance] = useState<any>(0);

  const refetch = useCallback(
    async (params: any) => {
      try {
        const result = await provider.fetchAllowance(params);
        setAllowance(new BigNumber(result || 0).toString());
      } catch (error) {
        console.error('fetch allowance failed: ', error);
      }
    },
    [provider, setAllowance],
  );

  return [allowance || 0, refetch];
}

export function useSupply(provider: any) {
  const supply = useCallback(
    async (params: any) => {
      const tx = await provider.supply(params);

      return tx;
    },
    [provider],
  ) as any;

  return [supply];
}

export function useTxFee(provider: any) {
  const [txFee, setTxFee] = useState<any>(0);

  const estimateNormalTxFee = useCallback(
    async (params: any) => {
      try {
        const result = await provider.estimateNormalTxFee(params);
        setTxFee(new BigNumber(result || 0).toString());
      } catch (error) {
        console.error('estimate tx fee failed: ', error);
      }
    },
    [provider, setTxFee],
  );

  return [txFee || 0, estimateNormalTxFee];
}

// start borrow part
export function useApprovalBorrow(provider: any) {
  const approveBorrow = useCallback(
    async (params: any) => {
      const tx = await provider.approveBorrow(params);

      return tx;
    },
    [provider],
  ) as any;

  return [approveBorrow];
}

export function useCreateLoan(provider: any) {
  const createLoan = useCallback(
    async (params: any) => {
      const tx = await provider.createLoan(params);

      return tx;
    },
    [provider],
  ) as any;

  return [createLoan];
}

export function useGetCollateralMinimum(provider: any) {
  const getCollateralMinimum = useCallback(
    async (params: any) => {
      const res = await provider.getCollateralMinimum(params);

      return res;
    },
    [provider],
  ) as any;

  return [getCollateralMinimum];
}

export function useGetHealthFactor(provider: any) {
  const getHealthFactor = useCallback(
    async (params: any) => {
      const res = await provider.getHealthFactor(params);

      return res;
    },
    [provider],
  ) as any;

  return [getHealthFactor];
}

export function useGetGasFeeApprove(provider: any) {
  const getGasFeeApprove = useCallback(
    async (params: any) => {
      const res = await provider.getGasFeeApprove(params);

      return res;
    },
    [provider],
  ) as any;

  return [getGasFeeApprove];
}

export function useGetGasFeeCreateLoan(provider: any) {
  const getGasFeeCreateLoan = useCallback(
    async (params: any) => {
      const res = await provider.getGasFeeCreateLoan(params);

      return res;
    },
    [provider],
  ) as any;

  return [getGasFeeCreateLoan];
}

export function useAllowanceBorrow(provider: any) {
  const allowanceBorrow = useCallback(
    async (params: any) => {
      const res = await provider.allowanceBorrow(params);

      return res;
    },
    [provider],
  ) as any;

  return [allowanceBorrow];
}

export function useRepayLoan(provider: any) {
  const createLoan = useCallback(
    async (params: any) => {
      const tx = await provider.repayLoan(params);

      return tx;
    },
    [provider],
  ) as any;

  return [createLoan];
}
//end borrow part
