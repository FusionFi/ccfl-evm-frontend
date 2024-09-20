import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import ModalComponent from '@/components/common/modal.component';
import { InputNumber } from 'antd';
import Image from 'next/image';
import { Button, Tooltip, Select, Checkbox } from 'antd';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import { useTranslation } from 'next-i18next';
import { TRANSACTION_STATUS, CONTRACT_ADDRESS } from '@/constants/common.constant';
import service from '@/utils/backend/borrow';
import service_ccfl_repay from '@/utils/contract/ccflRepay.service';
import { useAccount } from 'wagmi';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';

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
  const { address, connector, chainId } = useAccount();

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
    (toLessPart(toAmountShow(loanItem.debt_remain, loanItem.decimals), 2) as any);
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

  console.log('loanItem', loanItem);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const provider = await connector?.getProvider();
    if (step === 0) {
      try {
        setLoading(true);
        let tx = await service_ccfl_repay.approveRepay(
          provider,
          CONTRACT_ADDRESS,
          toUnitWithDecimal(tokenValue, loanItem.decimals),
          address,
          stableCoinData.address,
        );
        if (tx?.link) {
          setStep(1);
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
        let tx = await service_ccfl_repay.repayLoan(
          toUnitWithDecimal(tokenValue, loanItem.decimals),
          stableCoinData.address,
          provider,
          address,
          CONTRACT_ADDRESS,
          loanItem.loan_id,
        );
        if (tx?.link) {
          setStep(2);
          setTxHash(tx.link);
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
      let res_info = (await service.getTokenInfo(currentToken, chainId)) as any;
      let res_balance = (await service.getCollateralBalance(address, chainId, currentToken)) as any;

      console.log('res_info', res_info, res_balance);
      let token = stableCoinData;
      if (res_balance) {
        token.balance = res_balance.balance
          ? toLessPart(toAmountShow(res_balance.balance, res_balance.decimals), 2)
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

  const getHealthFactor = async () => {
    if (tokenValue && tokenValue > 0 && loanItem.decimals) {
      const provider = await connector?.getProvider();

      try {
        setLoadingHealthFactor(true);
        let healthFactor = (await service_ccfl_repay.getHealthFactor(
          provider,
          CONTRACT_ADDRESS,
          toUnitWithDecimal(tokenValue, loanItem.decimals),
          loanItem.loan_id,
        )) as any;
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

  const getGasFeeApprove = async () => {
    console.log('getGasFeeApprove', step, loanItem, tokenValue);

    if (step === 0) {
      if (
        tokenValue &&
        tokenValue > 0 &&
        loanItem.decimals &&
        loanItem.loan_id &&
        stableCoinData.address
      ) {
        const provider = await connector?.getProvider();
        try {
          setLoadingGasFee(true);
          let res = (await service_ccfl_repay.getGasFeeApprove(
            provider,
            address,
            toUnitWithDecimal(tokenValue, loanItem.decimals),
            stableCoinData.address,
            CONTRACT_ADDRESS,
          )) as any;
          let res_price = (await service.getPrice(chainId, 'ETH')) as any;

          console.log('gasFee approve', res, res_price);
          if (res && res.gasPrice && res_price && res_price.price) {
            let gasFee = res.gasPrice * res_price.price;
            setGasFee(gasFee);
          }
          if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
            setGasFee(0);
          }

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
        setGasFee(0);
      }
    }
  };

  const getGasFeeRepay = async () => {
    if (step === 1) {
      if (
        tokenValue &&
        tokenValue > 0 &&
        stableCoinData.address &&
        loanItem.decimals &&
        loanItem.loan_id
      ) {
        const provider = await connector?.getProvider();
        try {
          setLoadingGasFee(true);
          let res = (await service_ccfl_repay.getGasFeeRepayLoan(
            provider,
            address,
            CONTRACT_ADDRESS,
            toUnitWithDecimal(tokenValue, loanItem.decimals),
            stableCoinData.address,
            loanItem.loan_id,
          )) as any;
          let res_price = (await service.getPrice(chainId, 'ETH')) as any;
          console.log('handleGetFeeCreateLoan res', res);
          if (res && res.gasPrice && res_price && res_price.price) {
            let gasFee = res.gasPrice * res_price.price;
            setGasFee(gasFee);
          }

          if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
            setGasFee(0);
          }
          setErrorEstimate({
            nonEnoughBalanceWallet: res?.nonEnoughMoney,
            exceedsAllowance: res?.exceedsAllowance,
          });
          setLoadingGasFee(false);
        } catch (error: any) {
          setLoadingGasFee(false);
        }
      } else {
        setGasFee(0);
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
      getHealthFactor();
      getGasFeeApprove();
      getGasFeeRepay();
    }
  }, [tokenValue]);

  useEffect(() => {
    if (isModalOpen) {
      getTokenInfo();
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
                <div className="modal-borrow-title mb-2 ">{t('BORROW_MODAL_REPAY_AMOUNT')}</div>
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
                        ? toLessPart(tokenValue * priceToken[currentToken], 2)
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
                  <span>
                    {t('BORROW_MODAL_BORROW_WALLET_BALANCE')}:{' '}
                    {loadingBalance ? <LoadingOutlined className="mr-1" /> : stableCoinData.balance}{' '}
                    {currentToken?.toUpperCase()}
                  </span>
                  {tokenValue && !(stableCoinData.balance - tokenValue >= 0) && (
                    <span className="insufficient">
                      {stableCoinData.balance - tokenValue}
                      {t('BORROW_MODAL_INSUFFICIENT_BALANCE')}
                    </span>
                  )}
                </div>
              </div>
              {errorEstimate.nonEnoughBalanceWallet && (
                <div className="modal-borrow-error">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH')}
                </div>
              )}
              {errorEstimate.exceedsAllowance && (
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
                        <span>{toLessPart(deptRemain - tokenValue, 2)}</span>
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
                          <span className="">{healthFactor}</span>
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
                        errorEstimate.exceedsAllowance ||
                        healthFactor === 0 ||
                        gasFee === 0 ||
                        !loanItem ||
                        !stableCoinData.address ||
                        stableCoinData.balance === 0
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
                          errorEstimate.exceedsAllowance ||
                          healthFactor === 0 ||
                          gasFee === 0 ||
                          !loanItem ||
                          !stableCoinData.address ||
                          stableCoinData.balance === 0
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
