import { Connector } from "@/connectors/index.connector";
import Networks from '@/constants/cardano-network.constant'
import BaseProvider from './base.provider'

const CARDANO_NETWORK_ID: any = process.env.NEXT_PUBLIC_CARDANO_NETWORK_ID

import { Lucid } from "lucid-cardano";

class CardanoProvider extends BaseProvider {
    constructor(params: any) {
        super({
            ...params,
            type: 'cardano'
        })
    }

    async connect(connector: any) {
        const _connector: any = new Connector[connector.id]();
        if (!_connector.provider) {
            return window.open(_connector.extensionLink);
        }
        const api = await _connector.enable();

        const networkId = await _connector.getNetworkId();

        if (networkId != CARDANO_NETWORK_ID) {
            throw new Error(
                `Set network to "${Networks[CARDANO_NETWORK_ID]}" in your ${connector.id} _connector to use`
            );
        }

        const lucid = await Lucid.new();
        lucid.selectWallet(api);

        const address = await lucid.wallet.address();

        // TODO: listen events
        return {
            accounts: [address],
            chainId: networkId,
        };
    }

    async switchChain() {
        return true;
    }

    async disconnect() {
        this.connector?.unsubscribeEvents();
    }

    getChainId() {
        return 0;
    }

    async supply(params: any) {
        console.log('supply params: ', params)
        return true;
    }
}

export default CardanoProvider;