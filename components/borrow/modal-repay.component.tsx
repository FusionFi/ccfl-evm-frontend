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
import { getTokenBalance } from '@/utils/contract/erc20';
import service from '@/utils/backend/borrow';
import service_ccfl_repay from '@/utils/contract/ccflRepay.service';
import { useAccount } from 'wagmi';
import { toAmountShow, toUnitWithDecimal } from '@/utils/common';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  isFiat?: boolean;
  priceToken: any;
  loanItem: any;
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
  const [balance, setBalance] = useState(0) as any;
  const deptRemain =
    loanItem &&
    loanItem.debt_remain &&
    loanItem.decimals &&
    (toAmountShow(loanItem.debt_remain, loanItem.decimals, 2) as any);
  const [healthFactor, setHealthFactor] = useState(0) as any;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingHealthFactor, setLoadingHealthFactor] = useState<boolean>(false);

  console.log('loanItem', loanItem);

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step == 1) {
        setTokenValue(0);
      }
      setStep(step + 1);
    }, 1000);
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

  const getTokenBalance = async () => {
    try {
      setLoadingBalance(true);
      let res_balance = (await service.getCollateralBalance(address, chainId, currentToken)) as any;
      console.log('res_balance', res_balance);
      if (res_balance) {
        setBalance(
          res_balance.balance ? toAmountShow(res_balance.balance, res_balance.decimals, 2) : 0,
        );
      }
      setLoadingBalance(false);
    } catch (error) {
      setLoadingBalance(false);
      console.log('getTokenBalance error', error);
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
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      getHealthFactor();
    }
  }, [tokenValue]);

  useEffect(() => {
    if (isModalOpen) {
      setTokenValue(undefined);
      getTokenBalance();
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
                        ? (tokenValue * priceToken[currentToken]).toFixed(2)
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
                    {loadingBalance ? <LoadingOutlined className="mr-1" /> : balance}{' '}
                    {currentToken?.toUpperCase()}
                  </span>
                  {tokenValue && !(balance - tokenValue >= 0) && (
                    <span className="insufficient">
                      {balance - tokenValue}
                      {t('BORROW_MODAL_INSUFFICIENT_BALANCE')}
                    </span>
                  )}
                </div>
              </div>
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
                        <span>{(deptRemain - tokenValue).toFixed(2)}</span>
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
                  <span>$</span>
                  <span className="ml-1">0.00</span>
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
                      disabled={!tokenValue}
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
                        disabled={!tokenValue}
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
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
