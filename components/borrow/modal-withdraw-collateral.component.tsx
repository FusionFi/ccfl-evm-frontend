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
  WalletOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import { useTranslation } from 'next-i18next';
import { COLLATERAL_TOKEN } from '@/constants/common.constant';
import {
  CONTRACT_ADDRESS,
  TRANSACTION_STATUS,
  MIN_AMOUNT_KEY,
  ACTION_TYPE,
} from '@/constants/common.constant';
import { useWithdrawAllCollateral } from '@/hooks/provider.hook';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';

interface ModalWithdrawCollateralProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  loanItem: any;
  handleLoans: any;
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

  const [stableCoinData, setStableCoinData] = useState({
    yeild: 0,
    address: undefined,
  }) as any;
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

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const connector_provider = await connector?.getProvider();
    // if (step === 0) {
    //   try {
    //     setLoading(true);

    //     let tx = await approveBorrow({
    //       provider: connector_provider,
    //       contract_address: CONTRACT_ADDRESS,
    //       amount: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
    //       address: provider?.account,
    //       tokenContract: stableCoinData.address,
    //     });
    //     if (tx?.link) {
    //       setStep(1);
    //       setErrorTx(undefined);
    //       setErrorEstimate({
    //         nonEnoughBalanceWallet: false,
    //         exceedsAllowance: false,
    //       });
    //       setStatus(TRANSACTION_STATUS.SUCCESS);
    //     }
    //     if (tx?.error) {
    //       setStatus(TRANSACTION_STATUS.FAILED);
    //       setErrorTx(tx.error as any);
    //     }
    //     setLoading(false);
    //   } catch (error) {
    //     setStatus(TRANSACTION_STATUS.FAILED);
    //     setLoading(false);
    //   }
    // }

    try {
      setLoading(true);
      let IsFiat = false;

      //todo
      let tx = await withdrawAllCollateral({
        provider: connector_provider,
        account: provider?.account,
        contract_address: CONTRACT_ADDRESS,
        loanId: loanItem.loan_id,
        isGas: false,
        isETH: false,
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
        setStatus(TRANSACTION_STATUS.FAILED);
        setErrorTx(tx.error as any);
      }
      setLoading(false);
    } catch (error) {
      setStatus(TRANSACTION_STATUS.FAILED);
      setLoading(false);
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
    if (isModalOpen) {
      resetState();
    }
  }, [isModalOpen]);

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
                <div className="modal-borrow-sub-title mb-4">
                  {t('BORROW_MODAL_COLLATERAL_OVERVIEW')}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_COLLATERAL')}
                  </div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      {loanItem && (
                        <span>
                          {toLessPart(
                            toAmountShow(loanItem.collateral_amount, loanItem.collateral_decimals),
                            4,
                          )}
                        </span>
                      )}
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
                          ? toLessPart(
                              toAmountShow(loanItem.yield_earned, loanItem.collateral_decimals),
                              4,
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
                  <span>$</span>
                  <span className="ml-1">0.00</span>
                </div>
              </div>
              <div className="modal-borrow-footer">
                {step === 0 && (
                  <div className="approve-inner">
                    <Button
                      htmlType="submit"
                      type="primary"
                      disabled={false}
                      className="w-full"
                      loading={loading}>
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
              stableCoinAmount={loanItem?.collateral_asset}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
