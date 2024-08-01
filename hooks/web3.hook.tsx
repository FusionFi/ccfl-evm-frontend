import { getTokenBalance } from '@/utils/contract/erc20';
import { getBalanceCoin, getWeb3 } from '@/utils/contract/web3';

export function useWeb3() {
    return {
        getWeb3,
        getBalanceCoin,
        getTokenBalance
    };
}