class BaseProvider {
  public type: string;
  public connector: any;
  public chainId: any;
  public account: any;

  constructor({ type, connector, account, chainId }: any) {
    this.type = type;
    this.account = account || '';
    this.chainId = chainId || '';
  }

  async fetchAllowance(params: any): Promise<any> {
    console.log('[fetchAllowance]  params: ', params);
    return 0;
  }

  async estimateNormalTxFee(params: any): Promise<any> {
    console.log('[estimateNormalTxFee]  params: ', params);
    return 0;
  }

  subscribeEvents(dispatch: any) {
    return true;
  }

  unsubscribeEvents() {
    return true;
  }

  // start borrow part
  async approveBorrow(params: any): Promise<any> {
    console.log('[approveBorrow]  params: ', params);
    return true;
  }
  async createLoan(params: any): Promise<any> {
    console.log('[createLoan]  params: ', params);
    return true;
  }
  async getCollateralMinimum(params: any): Promise<any> {
    console.log('[getCollateralMinimum]  params: ', params);
    return 0;
  }
  async getHealthFactor(params: any): Promise<any> {
    console.log('[getHealthFactor]  params: ', params);
    return 0;
  }
  async getGasFeeApprove(params: any): Promise<any> {
    console.log('[getGasFeeApprove]  params: ', params);
    return 0;
  }
  async allowanceBorrow(params: any): Promise<any> {
    console.log('[allowanceBorrow]  params: ', params);
    return 0;
  }
  async repayLoan(params: any): Promise<any> {
    console.log('[repayLoan]  params: ', params);
    return true;
  }
  async addCollateral(params: any): Promise<any> {
    console.log('[addCollateral]  params: ', params);
    return true;
  }
  async withdrawAllCollateral(params: any): Promise<any> {
    console.log('[withdrawAllCollateral]  params: ', params);
    return true;
  }
  //end borrow part
}

export default BaseProvider;
