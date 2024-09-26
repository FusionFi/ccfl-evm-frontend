import AbiPool from '@/utils/contract/abi/ccflPool.json'
import { getGasPrice, waitForTransactionReceipt, switchChain, writeContract, connect, disconnect, getChainId, getAccount, getConnectors, readContract } from '@wagmi/core'
import { config } from '@/libs/wagmi.lib'
import BaseProvider from './base.provider'
import AbiERC20 from '@/utils/contract/abi/erc20.json'
import { createConfigWithCustomTransports } from '@/libs/wagmi.lib';
import BigNumber from 'bignumber.js';

class EVMProvider extends BaseProvider {

    constructor(params: any) {
        super({
            ...params,
            type: 'evm'
        })
    }

    async connect(connector: any) {
        const account = getAccount(config)

        if (account?.isConnected && account?.status == 'connected') {
            return {
                accounts: account.addresses,
                chainId: account.chainId
            }
        }

        const connectors = getConnectors(config);
        const _connector: any = connectors.find(item => item.name.toLowerCase() == connector.id.toLowerCase() || connector.id == item.type);

        return await connect(config, {
            connector: _connector
        })
    }

    async switchChain(chainId: any) {
        const connectors = getConnectors(config);
        console.log('connectors: ', connectors)
        return await switchChain(config, { chainId })
    }

    async disconnect() {
        const { connector } = getAccount(config)
        const result = await disconnect(config, {
            connector
        })
        return result;
    }

    async supply({ amount, contractAddress, abi }: any) {
        const result = await writeContract(config, {
            address: contractAddress,
            abi: abi || AbiPool,
            functionName: 'supply',
            args: [amount],
        })

        const tx = await waitForTransactionReceipt(config, {
            confirmations: 1,
            hash: result
        })

        return tx;
    }

    async approve({ abi, value, spender, contractAddress }: any) {
        const result = await writeContract(config, {
            address: contractAddress,
            abi: abi || AbiERC20,
            functionName: 'approve',
            args: [spender, value],
        })

        const tx = await waitForTransactionReceipt(config, {
            confirmations: 1,
            hash: result
        })

        return tx;
    }

    async fetchAllowance({ abi, owner, spender, chain, contractAddress, network }: any) {
        if (!contractAddress) {
            return 0;
        }

        const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
        const result = await readContract(config_, {
            abi: abi || AbiERC20,
            address: contractAddress,
            functionName: 'allowance',
            args: [owner, spender],
        })

        return result;
    }

    async estimateNormalTxFee({ chain, network }: any) {
        const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
        const gasPrice = await getGasPrice(config_)
        const result = new BigNumber(gasPrice.toString()).times(21000).toString();

        return result;
    }
}

export default EVMProvider;