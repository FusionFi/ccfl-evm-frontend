import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import AssetComponent from '@/components/borrow/asset.component';
import LoansComponent from '@/components/borrow/loans.component';
import ModalBorrowComponent from '@/components/borrow/modal-borrow.component';
import ModalRepayComponent from '@/components/borrow/modal-repay.component';
import OverviewComponent from '@/components/common/overview.component';
import TitleComponent from '@/components/common/title.component';
import { CARDANO_NETWORK_ID, SUPPORTED_CHAINS_MAP } from '@/constants/chains.constant';
import { ASSET_LIST, COLLATERAL_TOKEN, TYPE_COMMON } from '@/constants/common.constant';
import { NETWORKS } from '@/constants/networks';
import { useNotification } from '@/hooks/notifications.hook';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { DataType } from '@/components/borrow/borrow';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import ModalBorrowFiatSuccessComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat-success.component';
import ModalBorrowFiatComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat.component';
import ModalCollateralComponent from '@/components/borrow/modal-collateral.component';
import ModalWithdrawCollateralComponent from '@/components/borrow/modal-withdraw-collateral.component';
import service from '@/utils/backend/borrow';
import { useNetworkManager } from '@/hooks/supply.hook';
import { ProviderType } from '@/providers/index.provider';

type LabelRender = SelectProps['labelRender'];
enum BorrowModalType {
  Crypto = 'crypto',
  Fiat = 'FIAT',
  FiatSuccess = 'fiat-success',
}

export default function BorrowPage() {
  const { t } = useTranslation('common');
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
  const [isFiat, setIsFiat] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  const { selectedChain, updateNetwork } = useConnectedNetworkManager();
  const [, updateNetworks] = useNetworkManager();
  const [provider] = useProviderManager();

  const handleNetworkChange = (item: any) => {
    try {
      const currentTab =
        selectedChain?.id == CARDANO_NETWORK_ID ? ProviderType.Cardano : ProviderType.EVM;
      const changedTab = item == CARDANO_NETWORK_ID ? ProviderType.Cardano : ProviderType.EVM;
      if (currentTab != changedTab) {
        eventBus.emit('openWeb3Modal', {
          tab: changedTab,
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
      let data = (await service.getPool(selectedChain?.id)) as any;
      let price = {
        USDT: null,
        USDC: null,
      };

      let priceUSDC = (await service.getPrice(selectedChain?.id, ASSET_LIST.USDC)) as any;
      let priceUSDT = (await service.getPrice(selectedChain?.id, ASSET_LIST.USDT)) as any;
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
      let data = (await service.getLoans(
        provider?.account,
        selectedChain?.id,
        offset,
        limit,
      )) as any;
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

  const showModal = (token: string, apr: string, decimals: string, loan_available: any) => {
    setModal({
      type: token == BorrowModalType.Fiat ? BorrowModalType.Fiat : BorrowModalType.Crypto,
      token,
      apr,
      decimals,
      loan_available,
    });
  };
  const showWithdrawCollateralModal = (token: string, record: any) => {
    setLoanItem(record);
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
      loan_available: 0,
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
    // {
    //   text: t('BORROW_OVERVIEW_FINANCE_HEALTH'),
    //   content: dataLoan?.finance_health ?? '',
    //   type: TYPE_COMMON.FINANCE_HEALTH,
    // },
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

  const fetchNetworkBorrow = async () => {
    try {
      const [_networks] = await Promise.all([service.fetchNetworks()]);
      updateNetworks(_networks);
    } catch (error) {
      console.error('fetchNetwork failed: ', error);
    }
  };

  const handleBorrowFiatOk = ({ paymentMethod }: any) => {
    setModal({
      type: BorrowModalType.FiatSuccess,
      paymentMethod,
    });
  };

  useEffect(() => {
    handlePrice();
    handleLoans();
  }, [selectedChain?.id, provider?.account]);

  useEffect(() => {
    fetchNetworkBorrow();
  }, []);

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
      {provider?.account && selectedChain?.id == provider?.chainId && !loading && (
        <div className="mb-4">
          <OverviewComponent itemLeft={itemLeft} itemRight={itemRight} />
        </div>
      )}
      <div className="flex gap-4 borrow-inner">
        {provider?.account && selectedChain?.id == provider?.chainId && (
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
            provider?.account && selectedChain?.id == provider?.chainId
              ? 'xl:basis-1/2'
              : 'xl:basis-full'
          } basis-full`}>
          <AssetComponent
            showModal={showModal}
            networkInfo={networkInfo}
            tokenList={tokenList}
            loadingAsset={loadingAsset}
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
        loan_available={modal.loan_available}
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
        handleLoans={handleLoans}
      />
      <ModalWithdrawCollateralComponent
        isModalOpen={isModalWithdrawCollateral}
        handleCancel={handleWithdrawCollateralCancel}
        currentToken={collateralToken}
        step={step}
        setStep={setStep}
        loanItem={loanItem}
        handleLoans={handleLoans}
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
