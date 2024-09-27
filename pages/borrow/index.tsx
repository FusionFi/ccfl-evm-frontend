import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
// import SelectComponent from '@/components/common/select.component';
import AssetComponent from '@/components/borrow/asset.component';
import LoansComponent from '@/components/borrow/loans.component';
import ModalBorrowComponent from '@/components/borrow/modal-borrow.component';
import ModalRepayComponent from '@/components/borrow/modal-repay.component';
import OverviewComponent from '@/components/common/overview.component';
import TitleComponent from '@/components/common/title.component';
import { CHAIN_INFO, SUPPORTED_CHAINS } from '@/constants/chains.constant';
import { ASSET_LIST, COLLATERAL_TOKEN, TYPE_COMMON } from '@/constants/common.constant';
import { NETWORKS } from '@/constants/networks';
import { useNotification } from '@/hooks/notifications.hook';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAccount, useSwitchChain } from 'wagmi';
// import { getNetwork } from '@wagmi/core';
import { DataType } from '@/components/borrow/borrow';
import { useCardanoConnected, useConnectedNetworkManager } from '@/hooks/auth.hook';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import eventBus from '@/hooks/eventBus.hook';

import ModalBorrowFiatSuccessComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat-success.component';
import ModalBorrowFiatComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat.component';
import ModalCollateralComponent from '@/components/borrow/modal-collateral.component';
import ModalWithdrawCollateralComponent from '@/components/borrow/modal-withdraw-collateral.component';
import service from '@/utils/backend/borrow';

type LabelRender = SelectProps['labelRender'];
enum BorrowModalType {
  Crypto = 'crypto',
  Fiat = 'FIAT',
  FiatSuccess = 'fiat-success',
}

export default function BorrowPage() {
  const { t } = useTranslation('common');
  const { switchChain } = useSwitchChain();
  const [modal, setModal] = useState({} as any);
  const [isModalRepayOpen, setIsModalRepayOpen] = useState(false);
  const [isModalCollateralOpen, setIsModalCollateralOpen] = useState(false);
  const [isModalWithdrawCollateral, setIsModalWithdrawCollateral] = useState(false);

  const [currentToken, setCurrentToken] = useState('');

  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKEN[0].name);
  const [step, setStep] = useState(0);
  const [token, setToken] = useState(COLLATERAL_TOKEN[0].name);

  const [dataLoan, setDataLoan] = useState<DataType>();
  const [loading, setLoading] = useState(false);

  const { address, isConnected, chainId: wagmiChainId } = useAccount();
  const [isFiat, setIsFiat] = useState(false);
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  const [isCardanoConnected] = useCardanoConnected();

  const { selectedChain, updateNetwork, chainId } = useConnectedNetworkManager();

  const isConnected_ = useMemo(() => {
    if (!!cardanoWalletConnected?.address || isConnected) {
      return true;
    }

    return false;
  }, [isConnected, cardanoWalletConnected?.address, networkInfo]);

  //connect wallet
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();

  const handleNetworkChange = (item: any) => {
    try {
      console.log(item, 'item');
      console.log(chainId, 'chainId');
      const currentTab = chainId == 'ADA' ? 'cardano' : 'evm';
      const changedTab = item == 'ADA' ? 'cardano' : 'evm';
      if (currentTab != changedTab) {
        eventBus.emit('openWeb3Modal', {
          tab: item == 'ADA' ? 'cardano' : 'evm',
          chainId: item,
        });
      } else {
        updateNetwork(item);
      }
    } catch (error) {
      console.error('handle network changing failed: ', error);
    }
  };

  const [tokenList, setTokenList] = useState<any[]>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [price, setPrice] = useState<any>();
  const [pagination, setPagination] = useState<any>({
    current: 1,
    offset: 0,
    pageSize: 10,
  });
  const [loanItem, setLoanItem] = useState<any>(undefined);

  const handlePrice = async () => {
    try {
      setLoadingAsset(true);
      let data = (await service.getPool(chainId)) as any;
      let price = {
        USDT: null,
        USDC: null,
      };

      let priceUSDC = (await service.getPrice(chainId, ASSET_LIST.USDC)) as any;
      let priceUSDT = (await service.getPrice(chainId, ASSET_LIST.USDT)) as any;
      price.USDC = priceUSDC?.price;
      price.USDT = priceUSDT?.price;
      setPrice(price);

      if (data && data[0] && priceUSDC) {
        data[0].usd = data[0].loan_available * priceUSDC.price;
      }
      if (data && data[1] && priceUSDT) {
        data[1].usd = data[1].loan_available * priceUSDT.price;
      }

      setTokenList(data);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoadingAsset(false);
    }
  };

  const handleLoans = async (offset = 0, limit = 10) => {
    try {
      setLoading(true);
      let data = (await service.getLoans(address, chainId, offset, limit)) as any;
      if (data) {
        setDataLoan(data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const onChangePagination = (page: any, pageSize: any) => {
    console.log('onShowSizeChange', page, pageSize);
    setPagination({
      current: page,
      offset: (page - 1) * pageSize,
      pageSize: pageSize,
    });
    handleLoans((page - 1) * pageSize, pageSize);
  };

  useEffect(() => {
    handlePrice();
    handleLoans();
  }, [chainId, address]);

  useEffect(() => {
    handleLoans();
  }, [address]);

  const showModal = (token: string, apr: string, decimals: string) => {
    setModal({
      type: token == BorrowModalType.Fiat ? BorrowModalType.Fiat : BorrowModalType.Crypto,
      token,
      apr,
      decimals,
    });
  };
  const showWithdrawCollateralModal = (token: string) => {
    setCollateralToken(token);
    setIsModalWithdrawCollateral(true);
  };
  const showRepayModal = (token: string, repaymentCurrency: string, record: any) => {
    if (repaymentCurrency) {
      setIsFiat(true);
      setCurrentToken(repaymentCurrency);
    } else {
      setIsFiat(false);
      setCurrentToken(token);
    }
    setLoanItem(record);
    setIsModalRepayOpen(true);
  };
  const showCollateralModal = (token: string, record: any) => {
    setLoanItem(record);
    setCollateralToken(token);
    setIsModalCollateralOpen(true);
  };

  const handleCancel = () => {
    setModal({
      type: '',
      token: '',
      apr: '',
      decimals: '',
    });
    setStep(0);
    setToken(COLLATERAL_TOKEN[0].name);
  };
  const handleRepayCancel = () => {
    setCurrentToken('');
    setIsModalRepayOpen(false);
    setStep(0);
  };
  const handleCollateralCancel = () => {
    setCollateralToken('');
    setIsModalCollateralOpen(false);
    setStep(0);
  };
  const handleWithdrawCollateralCancel = () => {
    setCollateralToken('');
    setIsModalWithdrawCollateral(false);
    setStep(0);
  };

  const itemLeft = [
    {
      text: t('BORROW_OVERVIEW_BALANCE'),
      content: dataLoan?.total_loan ? dataLoan?.total_loan : 0,
      type: TYPE_COMMON.USD,
    },
    {
      text: t('BORROW_OVERVIEW_COLLATERAL'),
      content: dataLoan?.total_collateral ? dataLoan?.total_collateral : 0,
      type: TYPE_COMMON.USD,
    },
  ];

  const itemRight = [
    {
      text: t('BORROW_OVERVIEW_APR'),
      content: dataLoan?.net_apr ?? '',
      type: TYPE_COMMON.PERCENT,
    },
    {
      text: t('BORROW_OVERVIEW_FINANCE_HEALTH'),
      content: dataLoan?.finance_health ?? '',
      type: TYPE_COMMON.FINANCE_HEALTH,
    },
  ];
  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    const _chain: any = SUPPORTED_CHAINS_MAP.get(value);
    console.log('🚀 ~ SupplyOverviewComponent ~ _chain:', _chain);

    return (
      <div className="flex items-center">
        <Image
          src={_chain?.logo}
          alt={_chain?.name}
          width={24}
          height={24}
          style={{
            height: 24,
            width: 24,
          }}
          className="mr-2"
        />
        {_chain?.name}
      </div>
    );
  };

  //connect wallet
  const switchNetwork = async () => {
    try {
      const provider = { rpcUrl: selectedChain?.rpc };
      const rs = await switchChain({ chainId: selectedChain?.id });

      console.log('🚀 ~ switchNetwork ~ rs:', rs);
      updateNetwork(selectedChain?.id);
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };

  const initNetworkInfo = useCallback(() => {
    if (chainId) {
      const networkCurrent = NETWORKS.find(item => item.chain_id_decimals === chainId);
      setNetworkInfo(networkCurrent || null);
    }
  }, [chainId]);

  useEffect(() => {
    if (address) {
      // getBalance();
      initNetworkInfo();
    }
  }, [address, initNetworkInfo]);

  const handleBorrowFiatOk = ({ paymentMethod }: any) => {
    setModal({
      type: BorrowModalType.FiatSuccess,
      paymentMethod,
    });
  };
  const SUPPORTED_CHAINS_MAP = new Map(SUPPORTED_CHAINS.map(item => [item.id, item]));
  return (
    <div className={twMerge('borrow-page-container', cssClass.borrowPage)}>
      <div className="borrow-header">
        <TitleComponent text={t('BORROW_OVERVIEW_TITLE')}>
          <div className="select-wrapper ml-6">
            <Select
              labelRender={labelRender}
              defaultValue={{
                value: selectedChain?.id,
              }}
              value={{
                value: selectedChain?.id,
              }}
              onChange={handleNetworkChange}
              options={[...(SUPPORTED_CHAINS_MAP.values() as any)].map(item => ({
                value: item.id,
              }))}
              optionRender={(option: any) => {
                const _chain: any = SUPPORTED_CHAINS_MAP.get(option.value);
                return (
                  <div className="chain-dropdown-item-wrapper">
                    <Image
                      src={_chain?.logo}
                      alt={_chain?.name}
                      width={12}
                      height={12}
                      style={{
                        height: 12,
                        width: 12,
                      }}
                      className="mr-2"
                    />
                    {_chain?.name}
                  </div>
                );
              }}
              suffixIcon={<CaretDownOutlined />}
            />
          </div>
        </TitleComponent>
      </div>
      {isConnected_ &&
        networkInfo &&
        networkInfo.id &&
        networkInfo.id === wagmiChainId &&
        !loading && (
          <div className="mb-4">
            <OverviewComponent itemLeft={itemLeft} itemRight={itemRight} />
          </div>
        )}
      <div className="flex gap-4 borrow-inner">
        {isConnected_ && networkInfo && networkInfo.id && networkInfo.id === wagmiChainId && (
          <div className="xl:basis-1/2 basis-full">
            <LoansComponent
              showModal={showModal}
              showRepayModal={showRepayModal}
              showCollateralModal={showCollateralModal}
              dataLoan={dataLoan?.loans?.data}
              loading={loading}
              showWithdrawCollateralModal={showWithdrawCollateralModal}
              totalLoan={dataLoan?.loans?.total}
              onChangePagination={onChangePagination}
              pagination={pagination}
            />
          </div>
        )}
        <div
          className={`${
            isConnected_ && networkInfo && networkInfo.id && networkInfo.id === wagmiChainId
              ? 'xl:basis-1/2'
              : 'xl:basis-full'
          } basis-full`}>
          <AssetComponent
            showModal={showModal}
            isConnected={isConnected_}
            switchNetwork={switchNetwork}
            networkInfo={networkInfo}
            tokenList={tokenList}
            loadingAsset={loadingAsset}
            wagmiChainId={wagmiChainId}
          />
        </div>
      </div>
      <ModalBorrowComponent
        isModalOpen={BorrowModalType.Crypto == modal.type}
        handleCancel={handleCancel}
        stableCoin={modal.token}
        step={step}
        setStep={setStep}
        token={token}
        setToken={setToken}
        apr={modal.apr}
        decimalStableCoin={modal.decimals}
        priceStableCoin={price}
        handleLoans={handleLoans}
      />
      <ModalRepayComponent
        isModalOpen={isModalRepayOpen}
        handleCancel={handleRepayCancel}
        currentToken={currentToken}
        step={step}
        setStep={setStep}
        isFiat={isFiat}
        priceToken={price}
        loanItem={loanItem}
        handleLoans={handleLoans}
      />
      <ModalCollateralComponent
        isModalOpen={isModalCollateralOpen}
        handleCancel={handleCollateralCancel}
        currentToken={collateralToken}
        step={step}
        setStep={setStep}
        loanItem={loanItem}
      />
      <ModalWithdrawCollateralComponent
        isModalOpen={isModalWithdrawCollateral}
        handleCancel={handleWithdrawCollateralCancel}
        currentToken={collateralToken}
        step={step}
        setStep={setStep}
      />
      <ModalBorrowFiatComponent
        isModalOpen={BorrowModalType.Fiat == modal.type}
        handleCancel={handleCancel}
        handleOk={handleBorrowFiatOk}
        currentToken={modal.token}
        step={step}
        setStep={setStep}
        token={token}
        setToken={setToken}
      />

      <ModalBorrowFiatSuccessComponent
        isModalOpen={BorrowModalType.FiatSuccess == modal.type}
        paymentMethod={modal.paymentMethod}
        handleCancel={handleCancel}
      />
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
