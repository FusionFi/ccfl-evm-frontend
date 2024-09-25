import EVMProvider from "./evm.provider";
import CardanoProvider from "./cardano.provider";
import BaseProvider from "./base.provider";

export const ProviderType = {
    Cardano: 'cardano',
    EVM: 'evm'
}

export const makeProvider = (params: any) => {
    const type = params?.type?.toLowerCase();

    const ProviderMap: any = {
        cardano: CardanoProvider,
        evm: EVMProvider
    }

    const Provider = ProviderMap[type]

    return Provider ? new Provider(params) : new BaseProvider(params);
}