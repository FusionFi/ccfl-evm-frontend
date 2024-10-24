import React, { useState, useEffect, useCallback } from 'react';
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
import { loanMint } from '@/utils/cardano/validators';
import { loanMintTx } from '@/utils/cardano/transactions/loanMint';
import { getExchangeRate } from '@/utils/api/getExchangeRate';
import { initLucid } from '@/utils/cardano/blockfrost';
import { Lucid } from 'lucid-cardano';


interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  token: any;
  setToken: any;
  oracleTokenName: string;
  wallet: any;
  balance: number;
}

interface IFormInput {
  numberfield: number;
  collateralField: number;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  token,
  setToken,
  oracleTokenName,
  wallet,
  balance,
}: ModalBorrowProps) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      numberfield: 0,
      collateralField: 0,
    },
  });
  const { t } = useTranslation('common');

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step == 1) {
        setTokenValue(0);
        setCollateralValue(0);
      }
      setStep(step + 1);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [isYield, setYield] = useState(false);
  const [walletBalance, setWalletBalance] = useState(balance);
  const [lucid, setLucid] = useState<Lucid | null>(null);

  const handleChange = (value: any) => {
    setToken(value);
  };

  const handleYield = (e: any) => {
    setYield(e.target.checked);
  };
  
  const [tokenValue, setTokenValue] = useState(0);
  const [collateralValue, setCollateralValue] = useState(0);
  const [exchange, setExchange] = useState(0);
  const minimumAmount = 2;
  const { createTx, txHash } = loanMintTx(wallet, tokenValue!, oracleTokenName, exchange);
  
  const status = 'SUCCESS';
  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_BORROW_BORROW')} ${currentToken?.toUpperCase()}`;
  };
  
  const exchangeApi = async () => {
    try {
      const res = await getExchangeRate('cardano');
      console.log(res);
      return setExchange(res * 1000);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (!lucid && wallet) {
        initLucid(wallet).then((Lucid: Lucid) => {
          setLucid(Lucid);
        });
      }
      setTokenValue(0);
      setCollateralValue(0);
      exchangeApi();
    }
  }, [isModalOpen]);

  const handleApprove = async () => {
    if (!tokenValue || !collateralValue || collateralValue < minimumAmount) return;
    // await createTx();
    console.log('Approve: ', tokenValue);
    console.log('OracleTokenName: ', oracleTokenName);
    console.log(walletBalance);
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
              <div className="px-6 py-4 ">
                <div className="modal-borrow-title mb-2 ">
                  {t('BORROW_MODAL_BORROW_BORROW_AMOUNT')}
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
                    <span className="modal-borrow-usd">≈ $0.00</span>
                    <Button disabled={loading} className="modal-borrow-max">
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="modal-borrow-overview">
                <div className="modal-borrow-sub-title">
                  {t('BORROW_MODAL_BORROW_LOAN_OVERVIEW')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_VARIABLE_APR')}
                    <sup>
                      <Tooltip placement="top" title={'a'} className="ml-1">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </sup>
                  </span>
                  <div className="modal-borrow-percent">
                    <span>2.5</span>
                    <span>%</span>
                  </div>
                </div>
              </div>
              <div className="modal-borrow-collateral">
                <div className="modal-borrow-sub-title">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_SETUP')}
                </div>
                <div className="flex justify-between items-center  mb-2">
                  <span className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_TOKEN')}
                    <sup>
                      <Tooltip placement="top" title={'a'} className="ml-1">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </sup>
                  </span>
                  <Select
                    defaultValue={{
                      value: token,
                      label: token,
                    }}
                    options={COLLATERAL_TOKEN.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                    onChange={handleChange}
                    suffixIcon={<DownOutlined />}
                    popupClassName="modal-borrow-select"
                    value={token}
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    <WalletOutlined className="wallet-icon" /> {token} {t('BORROW_MODAL_BALANCE')}
                  </div>
                  <div className="modal-borrow-value">
                    <span>{walletBalance}</span>
                    <span className="ml-1 token">{token}</span>
                    <div className="modal-borrow-value-usd">$0.00</div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_COLLATERAL')}
                  </div>
                  <div className="flex items-center modal-borrow-collateral-amount">
                    <Controller
                      name="collateralField"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          placeholder={t('BORROW_MODAL_BORROW_ENTER_AMOUNT')}
                          className="flex-1 "
                          controls={false}
                          value={collateralValue}
                          onChange={(value: any) => {
                            setCollateralValue(value);
                          }}
                        />
                      )}
                    />
                    <span className="">{token?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="modal-borrow-minimum">
                  <span className="mr-1">Minimum amount: </span> {minimumAmount} {token}
                </div>
                <div className="flex justify-between items-center modal-borrow-health c-white">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_BORROW_HEALTH')}</div>
                  <div className="flex">
                    <span className="c-white">3.31B</span>
                    {collateralValue && collateralValue > 0 && (
                      <div className="flex">
                        <ArrowRightOutlined className="mx-1" />
                        <span className="">3.33B</span>
                      </div>
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
                      disabled={!tokenValue || !collateralValue || collateralValue < minimumAmount}
                      className="w-full"
                      loading={loading}
                      onClick={handleApprove}>
                      {t('BORROW_MODAL_BORROW_APPROVE', { currentToken: token })}
                    </Button>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <div className="modal-borrow-yield">
                      <Checkbox onChange={handleYield}>{t('BORROW_MODAL_BORROW_YIELD')}</Checkbox>
                    </div>
                    <div className="px-6 py-4">
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={
                          !tokenValue || !collateralValue || collateralValue < minimumAmount
                        }
                        className="w-full"
                        loading={loading}>
                        {t('BORROW_MODAL_BORROW_DEPOSIT', { token: token })}
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
              token={token}
              isBorrow={true}
              status={status}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
