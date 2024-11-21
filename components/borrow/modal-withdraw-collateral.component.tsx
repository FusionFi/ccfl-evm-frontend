import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ModalComponent from '@/components/common/modal.component';

import { Button, Tooltip } from 'antd';
import { InfoCircleOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import { useTranslation } from 'next-i18next';
import { CONTRACT_ADDRESS, TRANSACTION_STATUS } from '@/constants/common.constant';
import { useWithdrawAllCollateral } from '@/hooks/provider.hook';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import { useAccount } from 'wagmi';
import { formatNumber, toAmountShow, toLessPart } from '@/utils/common';
import service from '@/utils/backend/borrow';
import { getExchangeRate } from '@/utils/api/getExchangeRate';
import { loanBalanceTx } from '@/utils/cardano/transactions/loanBalance';

interface ModalWithdrawCollateralProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  loanItem: any;
  handleLoans: any;
  oracleTokenName: string; // Cardano
  loanTokenName: string; // Cardano
  loanAmount: number; // Cardano
  wallet: any; // Cardano
  balance: number; // Cardano
}

interface IFormInput {}

export default function ModalWithdrawCollateralComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  loanItem,
  handleLoans,
  oracleTokenName,
  loanTokenName,
  loanAmount,
  wallet,
  balance,
}: ModalWithdrawCollateralProps) {
  const { t } = useTranslation('common');
  const [provider] = useProviderManager();
  const { connector } = useAccount();
  const { selectedChain } = useConnectedNetworkManager();

  //start hook
  const [withdrawAllCollateral] = useWithdrawAllCollateral(provider);
  //end hook

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {},
  } = useForm<IFormInput>({
    defaultValues: {},
  });

  const [errorTx, setErrorTx] = useState() as any;
  const [txHash, setTxHash] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState(0);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
  }) as any;
  const [status, setStatus] = useState(TRANSACTION_STATUS.SUCCESS);
  const [stableCoinValue, setStableCoinValue] = useState(0);
  const [exchangeRate, setExchange] = useState(0); // Cardano 
  const [tokenValue, setTokenValue] = useState<number>(0); // Cardano 
  const [minCollateral, setMinCollateral] = useState(0); // CArdano 
  const { createTx, txHashADA } = loanBalanceTx(wallet, loanTokenName, loanAmount, tokenValue, oracleTokenName, exchangeRate);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const connector_provider = await connector?.getProvider();

    try {
      setLoading(true);
      let IsFiat = false;

      let tx = await withdrawAllCollateral({
        provider: connector_provider,
        account: provider?.account,
        contract_address: CONTRACT_ADDRESS,
        loanId: loanItem.loan_id,
        isETH: false,
        isGas: false,
      });
      if (tx?.link) {
        setStep(1);
        setTxHash(tx.link);
        setErrorTx(undefined);
        setErrorEstimate({
          nonEnoughBalanceWallet: false,
          exceedsAllowance: false,
        });
        setStatus(TRANSACTION_STATUS.SUCCESS);
      }
      if (tx?.error) {
        setStep(1);
        setStatus(TRANSACTION_STATUS.FAILED);
        setErrorTx(tx.error as any);
      }
      setLoading(false);
    } catch (error) {
      setStep(1);
      setErrorTx(error);
      setStatus(TRANSACTION_STATUS.FAILED);
      setLoading(false);
    }
  };

  const getGasFeeWithdrawCollateral = async () => {
    const connector_provider = await connector?.getProvider();
    try {
      setLoadingGasFee(true);
      let res = (await withdrawAllCollateral({
        provider: connector_provider,
        account: provider?.account,
        contract_address: CONTRACT_ADDRESS,
        loanId: loanItem.loan_id,
        isETH: false,
        isGas: true,
      })) as any;
      let res_price = (await service.getPrice(selectedChain?.id, 'ETH')) as any;
      console.log('getGasFeeWithdrawCollateral res', res);
      if (res && res.gasPrice && res_price && res_price.price) {
        let gasFee = res.gasPrice * res_price.price;
        setGasFee(gasFee);
      }

      setErrorEstimate({
        nonEnoughBalanceWallet: res?.nonEnoughMoney,
        exceedsAllowance: res?.exceedsAllowance,
      });
      setLoadingGasFee(false);
    } catch (error: any) {
      setLoadingGasFee(false);
    }
  };

  const renderTitle = () => {
    if (step === 1) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_WITHDRAW_COLLATERAL')}`;
  };

  const resetState = () => {
    setLoading(false);
    setStatus(TRANSACTION_STATUS.SUCCESS);
    setGasFee(0);
    setErrorTx(undefined);
    setTxHash(undefined);
    setErrorEstimate({
      nonEnoughBalanceWallet: false,
      exceedsAllowance: false,
    });
  };
  console.log('loanItem1', loanItem);

  useEffect(() => {
    if (isModalOpen && loanItem && loanItem.collateral_amount && loanItem.collateral_decimals) {
      setStableCoinValue(
        toLessPart(toAmountShow(loanItem.collateral_amount, loanItem.collateral_decimals), 4),
      );
    }
  }, [loanItem]);

  useEffect(() => {
    if (isModalOpen) {
      resetState();
      getGasFeeWithdrawCollateral();
    }
  }, [isModalOpen]);

  // vV Cardano Vv //

  const exchangeApi = async () => {
    try {
      const res = await getExchangeRate('cardano');
      console.log(res);
      setExchange(res * 1000);
      return setMinCollateral((loanAmount / res) * 2);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setTokenValue(0);
      exchangeApi();
    }
  }, [isModalOpen]);

  const handleApprove = async () => {
    if (!tokenValue) return;
    await createTx();
  };

  // ^ Cardano ^ //

  return (
    <div>
      <ModalComponent
        title={renderTitle()}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        closeIcon={step === 1 ? false : <CloseOutlined />}>
        {step !== 1 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-borrow-content">
              <div className="modal-borrow-overview">
                {errorEstimate.nonEnoughBalanceWallet && (
                  <div className="modal-borrow-error">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH_GAS')}
                  </div>
                )}
                {errorEstimate.exceedsAllowance && (
                  <div className="modal-borrow-error">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_EXCEEDS_ALLOWANCE')}
                  </div>
                )}
                <div className="modal-borrow-sub-title mb-4">
                  {t('BORROW_MODAL_COLLATERAL_OVERVIEW')}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_COLLATERAL')}
                  </div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>{formatNumber(stableCoinValue)}</span>
                      <span className="ml-1">{currentToken.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_YIELD_REWARD')}</div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>
                        {' '}
                        {loanItem?.yield_earned
                          ? formatNumber(
                              toLessPart(
                                toAmountShow(loanItem.yield_earned, loanItem.collateral_decimals),
                                4,
                              ),
                            )
                          : 0}
                      </span>
                      <span className="ml-1">{currentToken.toUpperCase()}</span>
                    </div>
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
                    <span className="ml-1">{formatNumber(toLessPart(gasFee, 2))}</span>
                  )}
                </div>
              </div>
              <div className="modal-borrow-footer">
                {step === 0 && (
                  <div className="approve-inner">
                    <Button
                      htmlType="submit"
                      type="primary"
                      disabled={
                        loading ||
                        loadingGasFee ||
                        errorEstimate.nonEnoughBalanceWallet ||
                        errorEstimate.exceedsAllowance ||
                        !provider?.account ||
                        !loanItem ||
                        !loanItem?.loan_id ||
                      }
                      className="w-full"
                      loading={loading}
                      onClick={handleApprove}>
                      {t('BORROW_MODAL_WITHDRAW_MY_COLLATERAL')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
        {step === 1 && (
          <div>
            <TransactionSuccessComponent
              handleCancel={handleCancel}
              currentToken={currentToken}
              setStep={setStep}
              isWithdrawCollateral={true}
              status={status}
              errorTx={errorTx}
              handleLoans={handleLoans}
              txLink={txHash}
              stableCoinAmount={stableCoinValue}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
