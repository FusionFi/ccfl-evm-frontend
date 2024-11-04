'use-client'

import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
// import SelectComponent from '@/components/common/select.component';
import AssetComponent from '@/components/borrow/asset.component';
import LoansComponent from '@/components/borrow/loans.component';
import ModalBorrowComponent from '@/components/borrow/modal-borrow.component';
import ModalRepayComponent from '@/components/borrow/modal-repay.component';
import OverviewComponent from '@/components/common/overview.component';
import TitleComponent from '@/components/common/title.component';
import { CHAIN_INFO } from '@/constants/chains.constant';
import { COLLATERAL_TOKEN, TYPE_COMMON } from '@/constants/common.constant';
import { NETWORKS, STAKE_DEFAULT_NETWORK } from '@/constants/networks';
import { useNotification } from '@/hooks/notifications.hook';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAccount, useSwitchChain } from 'wagmi';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook'
import { useCardanoConnected, useNetworkManager } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';

import ModalBorrowFiatSuccessComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat-success.component';
import ModalBorrowFiatComponent from '@/components/borrow/modal-borrow-fiat/modal-borrow-fiat.component';
import ModalCollateralComponent from '@/components/borrow/modal-collateral.component';
import ModalWithdrawCollateralComponent from '@/components/borrow/modal-withdraw-collateral.component';
import { SUPPORTED_CHAINS } from '@/constants/chains.constant';
import { initLucid, getBalance, getPkh } from '@/utils/cardano/blockfrost';
import { Lucid } from 'lucid-cardano';
import { getLoans } from '@/utils/api/cardanoApi';

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
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKEN[0].name);
  const [step, setStep] = useState(0);
  const [token, setToken] = useState(COLLATERAL_TOKEN[0].name);
  const { address, isConnected } = useAccount();
  const [isFiat, setIsFiat] = useState(false);
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  const [isCardanoConnected] = useCardanoConnected();
  const [loanTokenName, setLoanTokenName] = useState('');
  const [oracleTokenName, setOracleTokenName] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  const [loans, setLoans] = useState<any[]>([]);
  const [pkh, setPkh] = useState<string | null>(null);

  const [chainId, updateNetwork] = useNetworkManager();

  const isConnected_ = useMemo(() => {
    if (!!cardanoWalletConnected?.address) {
      return true;
    }

    if (isConnected && networkInfo) {
      balance
      return true;
    }
    return false
  }, [isConnected, cardanoWalletConnected?.address, networkInfo])

  console.log(cardanoWalletConnected, 'cardanoWalletConnected.address')

  //connect wallet
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();

  const handleNetworkChange = (item: any) => {
    try {
      console.log(item, 'item')
      console.log(chainId, 'chainId')
      const currentTab = chainId == 'ADA' ? 'cardano' : 'evm';
      const changedTab = item == 'ADA' ? 'cardano' : 'evm';
      if (currentTab != changedTab) {
        eventBus.emit('openWeb3Modal', {
          tab: item == 'ADA' ? 'cardano' : 'evm',
          chainId: item
        })
      } else {
        updateNetwork(item)
      }
    } catch (error) {
      console.error('handle network changing failed: ', error)
    }
  }

  const selectedChain = useMemo(() => {
    let _chain = CHAIN_INFO.get(chainId);
    if (!_chain) {
      if (isCardanoConnected) {
        _chain = CHAIN_MAP.get('ADA')
      } else {
        _chain = CHAIN_MAP.get(11155111)

      }
    }
    return _chain;
  }, [chainId, isCardanoConnected]);

  const balance = useMemo(async () => {
    if (!lucid) {
      initLucid(cardanoWalletConnected).then((lucid: Lucid) => {
        setLucid(lucid);
      });
    }
    if (cardanoWalletConnected && lucid) {
      const balance = await getBalance(lucid, cardanoWalletConnected.address);
      setWalletBalance(Number(balance ?? 0)); // Ensure the value is a number
    }
  }, [cardanoWalletConnected, lucid]);

  const showModal = (token: string) => {
    setModal({
      type: token == BorrowModalType.Fiat ? BorrowModalType.Fiat : BorrowModalType.Crypto,
      token,
    });
  };

  const showWithdrawCollateralModal = (token: string, loanTokenName: string, oracleTokenName: string, ) => {
    setCollateralToken(token);
    setLoanTokenName(loanTokenName);
    setOracleTokenName(oracleTokenName);
    console.log(walletBalance, 'walletBalance')
    setIsModalWithdrawCollateral(true);
  };

  const showRepayModal = (token: string, repaymentCurrency: string, loanTokenName: string, oracleTokenName: string) => {
    if (repaymentCurrency) {
      setIsFiat(true);
      setCurrentToken(repaymentCurrency);
      setLoanTokenName(loanTokenName);
      setOracleTokenName(oracleTokenName);
    } else {
      setIsFiat(false);
      setCurrentToken(token);
      setLoanTokenName(loanTokenName);
      setOracleTokenName(oracleTokenName);
    }
    console.log(walletBalance, 'walletBalance')

    setIsModalRepayOpen(true);
  };

  const showCollateralModal = (token: string, loanTokenName: string, oracleTokenName: string) => {
    console.log(walletBalance, 'walletBalance')
    setCollateralToken(token);
    setLoanTokenName(loanTokenName);
    setOracleTokenName(oracleTokenName);
    setIsModalCollateralOpen(true);
  };

  const handleCancel = () => {
    setModal({
      type: '',
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
      content: ' 1,875.00',
      type: TYPE_COMMON.USD,
    },
    {
      text: t('BORROW_OVERVIEW_COLLATERAL'),
      content: ' 1,875.00',
      type: TYPE_COMMON.USD,
    },
  ];

  const itemRight = [
    {
      text: t('BORROW_APY'),
      content: '0.07',
      type: TYPE_COMMON.PERCENT,
    },
    {
      text: t('BORROW_OVERVIEW_FINANCE_HEALTH'),
      content: '1.66',
      type: TYPE_COMMON.FINANCE_HEALTH,
    },
  ];

  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    let _chain: any = CHAIN_MAP.get(value);

    if (!_chain) {
      if (isCardanoConnected) {
        _chain = CHAIN_MAP.get('ADA')
      } else {
        _chain = CHAIN_MAP.get(11155111)

      }
    }

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
      const rs = await switchChain({ chainId: STAKE_DEFAULT_NETWORK?.chain_id_decimals });
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

  const getLoanData = useCallback(async () => {
    if (isCardanoConnected && lucid) {
      const pkh = getPkh(lucid, cardanoWalletConnected.address);
      if (!pkh) {
        return console.log('pkh not found')
      }
      setPkh(pkh)
      const loans = await getLoans(pkh);
      console.log(loans, 'loans')
      setLoans(loans)
    }
  }, [cardanoWalletConnected, isCardanoConnected]);

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

  const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map(item => [item.id, item]));

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
              options={[...(CHAIN_MAP.values() as any)].map(item => ({
                value: item.id,
              }))}
              optionRender={(option: any) => {
                const _chain: any = CHAIN_MAP.get(option.value);
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
      {isConnected_ && (
        <div className="mb-4">
          <OverviewComponent itemLeft={itemLeft} itemRight={itemRight} />
        </div>
      )}
      <div className="flex gap-4 borrow-inner">
        {isConnected_ && (
          <div className="xl:basis-1/2 basis-full">
            <LoansComponent
              showModal={showModal}
              showRepayModal={showRepayModal}
              showCollateralModal={showCollateralModal}
              showWithdrawCollateralModal={showWithdrawCollateralModal}
            />
          </div>
        )}
        <div
          className={`${isConnected_ ? 'xl:basis-1/2' : 'xl:basis-full'} basis-full`}>
          <AssetComponent
            showModal={showModal}
            isConnected={isConnected_}
            switchNetwork={switchNetwork}
            networkInfo={networkInfo}
          />
        </div>
      </div>
      <ModalBorrowComponent
        isModalOpen={BorrowModalType.Crypto == modal.type}
        handleCancel={handleCancel}
        currentToken={modal.token}
        step={step}
        setStep={setStep}
        token={token}
        setToken={setToken}
        oracleTokenName={oracleTokenName}
        wallet={cardanoWalletConnected}
        balance={walletBalance}
      />
      <ModalRepayComponent
        isModalOpen={isModalRepayOpen}
        handleCancel={handleRepayCancel}
        currentToken={currentToken}
        step={step}
        setStep={setStep}
        isFiat={isFiat}
        oracleTokenName={oracleTokenName}
        loanTokenName={loanTokenName}
        loanAmount={loanAmount}
        wallet={cardanoWalletConnected}
        balance={walletBalance}
      />
      <ModalCollateralComponent
        isModalOpen={isModalCollateralOpen}
        handleCancel={handleCollateralCancel}
        currentToken={collateralToken}
        step={step}
        setStep={setStep}
        oracleTokenName={oracleTokenName}
        loanTokenName={loanTokenName}
        wallet={cardanoWalletConnected}
        balance={walletBalance}
      />
      <ModalWithdrawCollateralComponent
        isModalOpen={isModalWithdrawCollateral}
        handleCancel={handleWithdrawCollateralCancel}
        currentToken={collateralToken}
        step={step}
        setStep={setStep}
        oracleTokenName={oracleTokenName}
        loanTokenName={loanTokenName}
        wallet={cardanoWalletConnected}
        loanAmount={loanAmount}
        balance={walletBalance}
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
        oracleTokenName={oracleTokenName}
        wallet={cardanoWalletConnected}
        balance={walletBalance}
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
