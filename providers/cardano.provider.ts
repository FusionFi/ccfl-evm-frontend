import { Connector } from '@/connectors/index.connector';
import Networks from '@/constants/cardano-network.constant';
import BaseProvider from './base.provider';

const CARDANO_NETWORK_ID: any = process.env.NEXT_PUBLIC_CARDANO_NETWORK_ID;

import { Lucid } from 'lucid-cardano';

class CardanoProvider extends BaseProvider {
  constructor(params: any) {
    super({
      ...params,
      type: 'cardano',
    });

    if (params?.connector?.id) {
      this.connector = new Connector[params?.connector.id]();
    }
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
        `Set network to "${Networks[CARDANO_NETWORK_ID]}" in your ${connector.id} _connector to use`,
      );
    }

    const lucid = await Lucid.new();
    lucid.selectWallet(api);

    const address = await lucid.wallet.address();
    this.connector = _connector;

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

  async approve(params: any) {
    // TODO: update here
    console.log('[approve]  params: ', params);
    return true;
  }

  async fetchAllowance(params: any): Promise<any> {
    // TODO: update here
    console.log('[fetchAllowance]  params: ', params);
    return true;
  }

  async estimateNormalTxFee(params: any): Promise<any> {
    // TODO: update here
    console.log('[estimateNormalTxFee]  params: ', params);
    return true;
  }

  async supply(params: any) {
    // TODO: update here
    console.log('[supply] params: ', params);
    return true;
  }

  subscribeEvents(dispatch: any): any {
    this.connector?.subscribeEvents(dispatch);
  }

  unsubscribeEvents(): any {
    this.connector?.unsubscribeEvents();
  }

  // start borrow part
  async approveBorrow(params: any): Promise<any> {
    // TODO: update here
    console.log('[approveBorrow]  params: ', params);
    return true;
  }
  async createLoan(params: any): Promise<any> {
    // TODO: update here
    console.log('[createLoan]  params: ', params);
    return true;
  }
  async getCollateralMinimum(params: any): Promise<any> {
    // TODO: update here
    console.log('[getCollateralMinimum]  params: ', params);
    return 0;
  }
  async getHealthFactor(params: any): Promise<any> {
    // TODO: update here
    console.log('[getHealthFactor]  params: ', params);
    return 0;
  }
  async getGasFeeApprove(params: any): Promise<any> {
    // TODO: update here
    console.log('[getGasFeeApprove]  params: ', params);
    return 0;
  }
  async allowanceBorrow(params: any): Promise<any> {
    // TODO: update here
    console.log('[allowanceBorrow]  params: ', params);
    return 0;
  }
  async repayLoan(params: any): Promise<any> {
    // TODO: update here
    console.log('[repayLoan]  params: ', params);
    return true;
  }
  //end borrow part
}

export default CardanoProvider;
