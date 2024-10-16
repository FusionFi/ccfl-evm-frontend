import React, { useState } from 'react';
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
import { TRANSACTION_STATUS } from '@/constants/common.constant';
import { getExchangeRate } from '@/utils/api/getExchangeRate';
import { loanBalanceTx } from '@/utils/cardano/transactions/loanBalance';

interface ModalWithdrawCollateralProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  oracleTokenName: string;
  loanTokenName: string;
  wallet: any;
}

interface IFormInput {}

export default function ModalWithdrawCollateralComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  oracleTokenName,
  loanTokenName,
  wallet
}: ModalWithdrawCollateralProps) {
  const { t } = useTranslation('common');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {},
  } = useForm<IFormInput>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(step + 2);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const exchangeRate = 1000 // getExchangeRate(currentToken);
  const [tokenValue, setTokenValue] = useState<number>(0);
  const { createTx, txHash } = loanBalanceTx(wallet, loanTokenName, tokenValue, oracleTokenName, exchangeRate);

  const status = 'SUCCESS';
  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_WITHDRAW_COLLATERAL')}`;
  };

  const handleApprove = async () => {
    if (!tokenValue) return;
    // await createTx();
    console.log('AddingCollateral: ', tokenValue);
  };

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
                      <span>5,000.00</span>
                      <span className="ml-1">{currentToken.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_YIELD_REWARD')}</div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>50.00</span>
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
        {step === 2 && (
          <div>
            <TransactionSuccessComponent
              handleCancel={handleCancel}
              currentToken={currentToken}
              setStep={setStep}
              isWithdrawCollateral={true}
              status={status}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
