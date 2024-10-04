import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import ModalComponent from '@/components/common/modal.component';
import { WalletIcon } from '@/components/icons/wallet.icon';
import {
  CONTRACT_ADDRESS,
  TRANSACTION_STATUS,
  MIN_AMOUNT_KEY,
  ACTION_TYPE,
} from '@/constants/common.constant';
import service from '@/utils/backend/borrow';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';
import {
  ArrowRightOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import {
  useApprovalBorrow,
  useGetHealthFactor,
  useAllowanceBorrow,
  useRepayLoan,
  useGetGasFeeApprove,
} from '@/hooks/provider.hook';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import BigNumber from 'bignumber.js';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  isFiat?: boolean;
  priceToken: any;
  loanItem: any;
  handleLoans?: any;
}

interface IFormInput {
  numberfield: number;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  isFiat,
  priceToken,
  loanItem,
  handleLoans,
}: ModalBorrowProps) {
  const { t } = useTranslation('common');
  const [provider] = useProviderManager();
  const { connector } = useAccount();
  const { selectedChain } = useConnectedNetworkManager();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      numberfield: 0,
    },
  });

  const [tokenValue, setTokenValue] = useState();
  const [status, setStatus] = useState(TRANSACTION_STATUS.SUCCESS);
  const [stableCoinData, setStableCoinData] = useState({
    balance: 0,
    address: undefined,
  }) as any;
  const deptRemain =
    loanItem &&
    loanItem.debt_remain &&
    loanItem.decimals &&
    (toLessPart(toAmountShow(loanItem.debt_remain, loanItem.decimals), 6, true) as any);
  const [healthFactor, setHealthFactor] = useState(0) as any;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingHealthFactor, setLoadingHealthFactor] = useState<boolean>(false);
  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState(0);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
  }) as any;
  const [errorTx, setErrorTx] = useState() as any;
  const [txHash, setTxHash] = useState();
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);
  const [minimum, setMinimum] = useState(undefined) as any;
  const [allowanceNumber, setAllowanceNumber] = useState() as any;

  // console.log('loanItem', loanItem);

  //start hook
  const [approveBorrow] = useApprovalBorrow(provider);
  const [repayLoan] = useRepayLoan(provider);
  const [getHealthFactor] = useGetHealthFactor(provider);
  const [getGasFeeApprove] = useGetGasFeeApprove(provider);
  const [allowanceBorrow] = useAllowanceBorrow(provider);
  //end hook

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const connector_provider = await connector?.getProvider();
    if (step === 0) {
      try {
        setLoading(true);
        // let tx = await service_ccfl_repay.approveRepay(
        //   provider,
        //   CONTRACT_ADDRESS,
        //   toUnitWithDecimal(tokenValue, loanItem.decimals),
        //   address,
        //   stableCoinData.address,
        // );
        let tx = await approveBorrow({
          provider: connector_provider,
          contract_address: CONTRACT_ADDRESS,
          amount: toUnitWithDecimal(tokenValue, loanItem.decimals),
          address: provider?.account,
          tokenContract: stableCoinData.address,
        });
        if (tx?.link) {
          setStep(1);
          setErrorTx(undefined);
          setErrorEstimate({
            nonEnoughBalanceWallet: false,
            exceedsAllowance: false,
          });
          setStatus(TRANSACTION_STATUS.SUCCESS);
        }
        if (tx?.error) {
          setStatus(TRANSACTION_STATUS.FAILED);
          setErrorTx(tx.error as any);
        }
        setLoading(false);
      } catch (error) {
        setStatus(TRANSACTION_STATUS.FAILED);
        setLoading(false);
      }
    }
    if (step == 1) {
      try {
        setLoading(true);
        let IsFiat = false;
        // let tx = await service_ccfl_repay.repayLoan(
        //   toUnitWithDecimal(tokenValue, loanItem.decimals),
        //   stableCoinData.address,
        //   provider,
        //   provider?.account,
        //   CONTRACT_ADDRESS,
        //   loanItem.loan_id,
        // );
        let tx = await repayLoan({
          amount: toUnitWithDecimal(tokenValue, loanItem.decimals),
          stableCoin: stableCoinData.address,
          provider: connector_provider,
          account: provider?.account,
          contract_address: CONTRACT_ADDRESS,
          loanId: loanItem.loan_id,
          isGas: false,
        });
        if (tx?.link) {
          setStep(2);
          setTxHash(tx.link);
          setErrorTx(undefined);
          setErrorEstimate({
            nonEnoughBalanceWallet: false,
            exceedsAllowance: false,
          });
          setStatus(TRANSACTION_STATUS.SUCCESS);
        }
        if (tx?.error) {
          setStatus(TRANSACTION_STATUS.FAILED);
          setErrorTx(tx.error as any);
        }
        setLoading(false);
      } catch (error) {
        setStatus(TRANSACTION_STATUS.FAILED);
        setLoading(false);
      }
    }
  };

  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_BORROW_REPAY')} ${currentToken?.toUpperCase()}`;
  };

  const getTokenInfo = async () => {
    try {
      setLoadingBalance(true);
      let res_info = (await service.getTokenInfo(currentToken, selectedChain?.id)) as any;
      let res_balance = (await service.getCollateralBalance(
        provider?.account,
        selectedChain?.id,
        currentToken,
      )) as any;

      console.log('res_info', res_info, res_balance);
      let token = stableCoinData;
      if (res_balance) {
        token.balance = res_balance.balance
          ? toLessPart(toAmountShow(res_balance.balance, res_balance.decimals), 6)
          : 0;
      }
      if (res_info && res_info[0]) {
        token.address = res_info[0].address;
      }
      setStableCoinData(token);
      setLoadingBalance(false);
    } catch (error) {
      setLoadingBalance(false);
      console.log('getTokenInfo error', error);
    }
  };

  const inputMaxAmount = () => {
    setTokenValue(deptRemain);
  };

  const handleGetHealthFactor = async () => {
    if (tokenValue && tokenValue > 0 && loanItem.decimals) {
      const connector_provider = await connector?.getProvider();

      try {
        setLoadingHealthFactor(true);
        // let healthFactor = (await service_ccfl_repay.getHealthFactor(
        //   connector_provider,
        //   CONTRACT_ADDRESS,
        //   toUnitWithDecimal(tokenValue, loanItem.decimals),
        //   loanItem.loan_id,
        // )) as any;
        let healthFactor = (await getHealthFactor({
          type: ACTION_TYPE.REPAY,
          provider: connector_provider,
          contract_address: CONTRACT_ADDRESS,
          amount: toUnitWithDecimal(tokenValue, loanItem.decimals),
          loanId: loanItem.loan_id,
        })) as any;
        console.log('healthFactor', healthFactor);
        if (healthFactor) {
          setHealthFactor(healthFactor);
        }
        setLoadingHealthFactor(false);
      } catch (error) {
        setLoadingHealthFactor(false);
        console.log('getHealthFactor error', error);
      }
    } else {
      setHealthFactor(undefined);
    }
  };

  const handleGetGasFeeApprove = async () => {
    console.log('handleGetGasFeeApprove', step, loanItem, tokenValue);
    setTimeout(async () => {
      if (step === 0) {
        if (
          tokenValue &&
          tokenValue > 0 &&
          loanItem.decimals &&
          loanItem.loan_id &&
          stableCoinData.address &&
          allowanceNumber &&
          allowanceNumber < tokenValue
        ) {
          const connector_provider = await connector?.getProvider();
          try {
            setLoadingGasFee(true);
            let res = (await getGasFeeApprove({
              provider: connector_provider,
              account: provider?.account,
              amount: toUnitWithDecimal(tokenValue, loanItem.decimals),
              tokenAddress: stableCoinData.address,
              contract_address: CONTRACT_ADDRESS,
            })) as any;
            let res_price = (await service.getPrice(selectedChain?.id, 'ETH')) as any;

            console.log('gasFee approve', res, res_price);
            if (res && res.gasPrice && res_price && res_price.price) {
              let gasFee = res.gasPrice * res_price.price;
              setGasFee(gasFee);
            }
            // if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
            //   setGasFee(0);
            // }

            setErrorEstimate({
              nonEnoughBalanceWallet: res?.nonEnoughMoney,
              exceedsAllowance: res?.exceedsAllowance,
            });
            setLoadingGasFee(false);
          } catch (error) {
            setLoadingGasFee(false);
            console.log('getGasFeeApprove error', error);
          }
        } else {
          // setGasFee(0);
        }
      }
    }, 500);
  };

  const getGasFeeRepay = async () => {
    setTimeout(async () => {
      if (step === 1) {
        if (
          tokenValue &&
          tokenValue > 0 &&
          stableCoinData.address &&
          loanItem.decimals &&
          loanItem.loan_id &&
          allowanceNumber &&
          allowanceNumber >= tokenValue
        ) {
          const connector_provider = await connector?.getProvider();
          try {
            setLoadingGasFee(true);
            let res = (await repayLoan({
              amount: toUnitWithDecimal(tokenValue, loanItem.decimals),
              stableCoin: stableCoinData.address,
              provider: connector_provider,
              account: provider?.account,
              contract_address: CONTRACT_ADDRESS,
              loanId: loanItem.loan_id,
              isGas: true,
            })) as any;
            let res_price = (await service.getPrice(selectedChain?.id, 'ETH')) as any;
            console.log('handleGetFeeCreateLoan res', res);
            if (res && res.gasPrice && res_price && res_price.price) {
              let gasFee = res.gasPrice * res_price.price;
              setGasFee(gasFee);
            }

            // if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
            //   setGasFee(0);
            // }
            setErrorEstimate({
              nonEnoughBalanceWallet: res?.nonEnoughMoney,
              exceedsAllowance: res?.exceedsAllowance,
            });
            setLoadingGasFee(false);
          } catch (error: any) {
            setLoadingGasFee(false);
          }
        } else {
          // setGasFee(0);
        }
      }
    }, 500);
  };

  const handleMinimumRepayment = async () => {
    try {
      // const connector_provider = await connector?.getProvider();
      // let res_pool = (await service.getPoolAddress(selectedChain?.id, currentToken)) as any;

      // let res = (await service_ccfl_repay.getMinimumRepayment(
      //   provider,
      //   res_pool && res_pool[0] ? res_pool[0].address : CONTRACT_ADDRESS,
      //   loanItem.loan_id,
      // )) as any;

      setLoadingMinimum(true);
      let res = (await service.getSetting(MIN_AMOUNT_KEY.MIN_AMOUNT_REPAY)) as any;

      if (res && res[0]?.value) {
        setMinimum(res[0]?.value);
      } else {
        setMinimum(undefined);
      }
      setLoadingMinimum(false);
    } catch (error) {
      setLoadingMinimum(false);
    }
  };

  const handleCheckAllowance = async () => {
    if (
      tokenValue &&
      tokenValue > 0 &&
      provider?.account &&
      stableCoinData?.address &&
      loanItem?.decimals
    ) {
      const connector_provider = await connector?.getProvider();
      try {
        let res_pool = (await service.getPoolAddress(selectedChain?.id, currentToken)) as any;

        console.log(
          'handleCheckAllowance',
          tokenValue,
          provider?.account,
          res_pool,
          res_pool[0].address,
          stableCoinData.address,
        );

        let res = (await allowanceBorrow({
          provider: connector_provider,
          tokenAddress: stableCoinData.address,
          account: provider?.account,
          spender: CONTRACT_ADDRESS,
        })) as any;

        const isNotNeedToApprove = new BigNumber(
          toAmountShow(res, loanItem.decimals),
        ).isGreaterThanOrEqualTo(tokenValue);

        console.log(
          'allowance repay',
          res,
          toAmountShow(res, loanItem.decimals),
          tokenValue,
          isNotNeedToApprove,
        );

        setAllowanceNumber(toAmountShow(res, loanItem.decimals));
        if (isNotNeedToApprove) {
          setStep(1);
        } else {
          setStep(0);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const resetState = () => {
    setLoading(false);
    setHealthFactor(undefined);
    setStatus(TRANSACTION_STATUS.SUCCESS);
    setGasFee(0);
    setErrorTx(undefined);
    setTxHash(undefined);
    setErrorEstimate({
      nonEnoughBalanceWallet: false,
      exceedsAllowance: false,
    });
    setTokenValue(undefined);
  };

  useEffect(() => {
    if (isModalOpen) {
      handleCheckAllowance();
    }
  }, [tokenValue, step]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetHealthFactor();
      handleGetGasFeeApprove();
      getGasFeeRepay();
    }
  }, [tokenValue]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetGasFeeApprove();
      getGasFeeRepay();
    }
  }, [step]);

  useEffect(() => {
    if (isModalOpen) {
      getTokenInfo();
      handleMinimumRepayment();
      resetState();
    }
  }, [isModalOpen]);

  return (
    <div>
      <ModalComponent
        title={renderTitle()}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        closeIcon={step === 2 ? false : <CloseOutlined />}>
        {step !== 2 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-borrow-content">
              <div className="px-6 py-4 ">
                <div className="modal-borrow-title mb-2 flex items-center">
                  {t('BORROW_MODAL_REPAY_AMOUNT')}
                  <div className="wallet-balance">
                    <WalletIcon className="mr-2" /> <span>{t('FORM_BALANCE')}: </span>{' '}
                    {loadingBalance ? <LoadingOutlined className="mr-1" /> : stableCoinData.balance}{' '}
                    {currentToken?.toUpperCase()}{' '}
                  </div>
                </div>
                <div className={`modal-borrow-amount ${loading ? 'loading' : ''}`}>
                  <div className="flex items-center">
                    <Controller
                      name="numberfield"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          placeholder={t('BORROW_MODAL_BORROW_ENTER_AMOUNT')}
                          className="flex-1"
                          controls={false}
                          value={tokenValue}
                          onChange={(value: any) => {
                            setTokenValue(value);
                          }}
                        />
                      )}
                    />
                    <div className="flex">
                      <Image
                        src={`/images/common/${currentToken}.png`}
                        alt={currentToken}
                        width={24}
                        height={24}
                      />
                      <span className="modal-borrow-token ml-2">{currentToken?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="modal-borrow-usd">
                      ≈ $
                      {tokenValue && priceToken[currentToken]
                        ? toLessPart(tokenValue * priceToken[currentToken], 2, true)
                        : 0}
                    </span>
                    <Button
                      disabled={loading}
                      className="modal-borrow-max"
                      onClick={inputMaxAmount}>
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button>
                    {errors.numberfield && <div>{errors.numberfield.message}</div>}
                  </div>
                </div>
                <div className="modal-borrow-balance">
                  {minimum !== 0 && (
                    <span>
                      {t('FORM_MINIMUM_REPAYMENT')}:{' '}
                      {loadingMinimum ? <LoadingOutlined className="mr-1" /> : minimum}{' '}
                      {currentToken?.toUpperCase()}
                    </span>
                  )}
                  {tokenValue && !(stableCoinData.balance - tokenValue >= 0) && (
                    <span className="insufficient">{t('BORROW_MODAL_INSUFFICIENT_BALANCE')}</span>
                  )}
                </div>
              </div>
              {errorEstimate.nonEnoughBalanceWallet && (
                <div className="modal-borrow-error">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH_GAS')}
                </div>
              )}
              {errorEstimate.exceedsAllowance && step === 1 && (
                <div className="modal-borrow-error">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_EXCEEDS_ALLOWANCE')}
                </div>
              )}
              <div className="modal-borrow-overview">
                <div className="modal-borrow-sub-title">{t('BORROW_MODAL_REPAY_OVERVIEW')}</div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_REMAINING')}
                  </div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>{deptRemain}</span>
                      <span className="ml-1">{isFiat ? 'USD' : currentToken?.toUpperCase()}</span>
                    </div>
                    {tokenValue && tokenValue > 0 && (
                      <div className="modal-borrow-repay remain">
                        <ArrowRightOutlined className="mx-1" />
                        <span>{deptRemain - tokenValue}</span>
                        <span className="ml-1">{isFiat ? 'USD' : currentToken?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center modal-borrow-health">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_BORROW_HEALTH')}</div>
                  <div className="flex">
                    <span>{loanItem?.health}</span>
                    {tokenValue && tokenValue > 0 ? (
                      <div className="flex">
                        {(healthFactor || loadingHealthFactor) && (
                          <ArrowRightOutlined className="mx-1" />
                        )}
                        {loadingHealthFactor ? (
                          <LoadingOutlined className="mr-1" />
                        ) : (
                          <span className="">
                            {deptRemain - tokenValue === 0 ? '∞' : healthFactor}
                          </span>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-borrow-gas">
                <div className="modal-borrow-sub-content">
                  {t('BORROW_MODAL_BORROW_GAS')}
                  <sup>
                    <Tooltip placement="top" title={'a'} className="ml-1">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </sup>
                </div>
                <div className="modal-borrow-gas-value">
                  <span>$</span>{' '}
                  {loadingGasFee ? (
                    <LoadingOutlined className="mr-1" />
                  ) : (
                    <span className="ml-1">{toLessPart(gasFee, 2)}</span>
                  )}
                </div>
              </div>
              <div className="modal-borrow-footer">
                {step === 0 && (
                  <div className="approve-inner">
                    <div className="modal-borrow-question">
                      <Tooltip placement="top" title={'a'}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                      {t('BORROW_MODAL_BORROW_WHY')}
                    </div>
                    <Button
                      htmlType="submit"
                      type="primary"
                      disabled={
                        !tokenValue ||
                        loadingBalance ||
                        loadingHealthFactor ||
                        loading ||
                        loadingGasFee ||
                        errorEstimate.nonEnoughBalanceWallet ||
                        (errorEstimate.exceedsAllowance && step === 1) ||
                        healthFactor === 0 ||
                        gasFee === 0 ||
                        !loanItem ||
                        !stableCoinData.address ||
                        stableCoinData.balance === 0 ||
                        (minimum && tokenValue < minimum) ||
                        (tokenValue && !(stableCoinData.balance - tokenValue >= 0))
                      }
                      className="w-full"
                      loading={loading}>
                      {t('BORROW_MODAL_BORROW_APPROVE', {
                        currentToken: currentToken?.toUpperCase(),
                      })}
                    </Button>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <div className="px-6 py-4">
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={
                          !tokenValue ||
                          loadingBalance ||
                          loadingHealthFactor ||
                          loading ||
                          loadingGasFee ||
                          errorEstimate.nonEnoughBalanceWallet ||
                          (errorEstimate.exceedsAllowance && step === 1) ||
                          healthFactor === 0 ||
                          gasFee === 0 ||
                          !loanItem ||
                          !stableCoinData.address ||
                          stableCoinData.balance === 0 ||
                          (minimum && tokenValue < minimum) ||
                          (tokenValue && !(stableCoinData.balance - tokenValue >= 0))
                        }
                        className="w-full"
                        loading={loading}>
                        {t('BORROW_MODAL_BORROW_PAY', {
                          currentToken: currentToken?.toUpperCase(),
                        })}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
        {step === 2 && (
          <div>
            <TransactionSuccessComponent
              handleCancel={handleCancel}
              currentToken={currentToken}
              setStep={setStep}
              isRepay={true}
              status={status}
              errorTx={errorTx}
              handleLoans={handleLoans}
              txLink={txHash}
              stableCoinAmount={tokenValue}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
