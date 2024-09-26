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
        this.account = account || '';
        this.chainId = chainId || '';
    }

    async fetchAllowance(params: any): Promise<any> {
        console.log('[fetchAllowance]  params: ', params)
        return 0;
    }

    async estimateNormalTxFee(params: any): Promise<any> {
        console.log('[estimateNormalTxFee]  params: ', params)
        return 0;
    }

    subscribeEvents(dispatch: any) {
        return true;
    }

    unsubscribeEvents() {
        return true;
    }
}

export default BaseProvider;