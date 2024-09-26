class BaseProvider {
    public type: string;
    public connector: any;
    public chainId: any;
    public account: any;

    constructor({
        type,
        connector,
        account,
        chainId
    }: any) {
        this.type = type;
        this.connector = connector;
        this.account = account || '';
        this.chainId = chainId || '';
    }

    async fetchAllowance(params: any) {
        // TODO: update here
        console.log('[fetchAllowance]  params: ', params)
        return 0;
    }

    async estimateNormalTxFee(params: any) {
        // TODO: update here
        console.log('[estimateNormalTxFee]  params: ', params)
        return 0;
    }
}

export default BaseProvider;