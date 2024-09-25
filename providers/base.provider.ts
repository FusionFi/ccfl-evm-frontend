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
}

export default BaseProvider;