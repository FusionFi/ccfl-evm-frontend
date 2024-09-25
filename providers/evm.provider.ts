import AbiPool from '@/utils/contract/abi/ccflPool.json'
import { waitForTransactionReceipt, switchChain, writeContract, connect, disconnect, getChainId, getAccount, getConnectors, reconnect } from '@wagmi/core'
import { config } from '@/libs/wagmi.lib'
import BaseProvider from './base.provider'

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
        return await switchChain(config, { chainId })
    }


    getChainId() {
        try {
            return getChainId(config);
        } catch (error) {
            return null;
        }
    }

    async disconnect() {
        const { connector } = getAccount(config)
        const result = await disconnect(config, {
            connector
        })
        return result;
    }

    async supply({ amount, contractAddress }: any) {
        const result = await writeContract(config, {
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
    }
}

export default EVMProvider;