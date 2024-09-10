import React, { useState, useEffect } from 'react';
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
import { COLLATERAL_TOKEN, DEFAULT_PARAMS, DEFAULT_ADDRESS } from '@/constants/common.constant';
import { TRANSACTION_STATUS, CONTRACT_ADDRESS } from '@/constants/common.constant';
import { toCurrency, toAmountShow, toUnitWithDecimal } from '@/utils/common';
import service from '@/utils/backend/borrow';
import service_ccfl_borrow from '@/utils/contract/ccflBorrow.service';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import BigNumber from 'bignumber.js';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: any;
  step: any;
  setStep: any;
  token: any;
  setToken: any;
  apr: any;
  decimalStableCoin: any;
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
  apr,
  decimalStableCoin,
}: ModalBorrowProps) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      numberfield: 0,
      collateralField: 0,
    },
  });
  const { t } = useTranslation('common');
  const { address, connector, chainId } = useAccount();
  const account = useAccount();

  const [loading, setLoading] = useState<boolean>(false);
  const [isYield, setYield] = useState(false);
  const [loadingBalanceCollateral, setLoadingBalanceCollateral] = useState<boolean>(false);
  const [loadingMinimumCollateral, setLoadingMinimumCollateral] = useState<boolean>(false);
  const [collateralData, setCollateralData] = useState({
    balance: 0,
    balance_usd: 0,
    decimals: 8,
  }) as any;
  const [minimalCollateral, setMinimalCollateral] = useState(0);
  const [tokenValue, setTokenValue] = useState();
  const [collateralValue, setCollateralValue] = useState();
  const [txHash, setTxHash] = useState();
  const [errorTx, setErrorTx] = useState();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const provider = await connector?.getProvider();
    let tokenAmount: keyof typeof DEFAULT_ADDRESS = currentToken.toUpperCase();
    let tokenCollateral: keyof typeof DEFAULT_ADDRESS = token.toUpperCase();
    console.log(tokenAmount, tokenCollateral);

    if (step === 0) {
      try {
        setLoading(true);
        let hash = await service_ccfl_borrow.approveBorrow(
          provider,
          CONTRACT_ADDRESS,
          toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
        );
        console.log('finnisedApprove', hash);
        if (hash !== '') {
          setLoading(false);
          setStep(step + 1);
        }
      } catch (error) {
        setLoading(false);
        console.log('error', error);
      }
    }
    if (step == 1) {
      try {
        setLoading(true);
        let tx = await service_ccfl_borrow.createLoan(
          toUnitWithDecimal(tokenValue ? tokenValue : 0, decimalStableCoin),
          toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
          DEFAULT_ADDRESS[tokenAmount],
          DEFAULT_ADDRESS[tokenCollateral],
          isYield,
          false,
        );
        if (tx?.hash) {
          setStep(step + 1);
          setLoading(false);
          setTxHash(tx.hash);
        }
      } catch (error) {
        setLoading(false);
        console.log('error', error);
        setErrorTx(error as any);
      }
    }
  };

  const handleChange = (value: any) => {
    setToken(value);
  };

  const handleYield = (e: any) => {
    setYield(e.target.checked);
  };

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

  const handleCollateralBalance = async () => {
    try {
      setLoadingBalanceCollateral(true);
      let res_balance = (await service.getCollateralBalance(
        DEFAULT_PARAMS.address,
        DEFAULT_PARAMS.chainId,
        token,
      )) as any;
      let res_price = (await service.getPrice(DEFAULT_PARAMS.chainId, token)) as any;
      console.log('handleCollateralBalance', res_balance, res_price);
      if (res_balance) {
        setCollateralData({
          balance: res_balance.balance
            ? toAmountShow(res_balance.balance, res_balance.decimals)
            : 0,
          balance_usd:
            res_price?.price && res_balance.balance
              ? toAmountShow(res_balance.balance * res_price?.price, res_balance.decimals)
              : 0,
          decimals: res_balance.decimals ? res_balance.decimals : 8,
        });
      }
      setLoadingBalanceCollateral(false);
    } catch (error) {
      console.log('error', error);
      setLoadingBalanceCollateral(false);
    }
  };

  const handleGetMinimumCollateral = async () => {
    try {
      setLoadingMinimumCollateral(true);
      let res_collateral = (await service.getCollateralInfo(token, DEFAULT_PARAMS.chainId)) as any;

      let tokenDraft: keyof typeof DEFAULT_ADDRESS = currentToken.toUpperCase();
      let collateralTokenDraft: keyof typeof DEFAULT_ADDRESS = token.toUpperCase();

      let addressStableCoin = DEFAULT_ADDRESS[tokenDraft];
      let addressCollateral = DEFAULT_ADDRESS[collateralTokenDraft];

      const provider = await connector?.getProvider();
      let res = (await service_ccfl_borrow.getCollateralInfo(
        provider,
        CONTRACT_ADDRESS,
        toUnitWithDecimal(tokenValue ? tokenValue : 0, decimalStableCoin),
        addressStableCoin,
        addressCollateral,
      )) as any;
      console.log(
        'handleGetMinimumCollateral',
        tokenDraft,
        collateralTokenDraft,
        res,
        res_collateral,
      );
      if (res && res.minimalCollateral && res_collateral && res_collateral[0]?.decimals) {
        let minimum = toAmountShow(res.minimalCollateral, res_collateral[0].decimals) as any;
        setMinimalCollateral(minimum);
      } else {
        setMinimalCollateral(0);
      }

      setLoadingMinimumCollateral(false);
    } catch (error) {
      console.log('error', error);
      setLoadingMinimumCollateral(false);
    }
  };

  const handleGetFee = async () => {
    try {
      let res = await service_ccfl_borrow.handleGasPrice();
    } catch (error) {}
  };

  useEffect(() => {
    if (isModalOpen) {
      handleCollateralBalance();
    }
  }, [token]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetMinimumCollateral();
    }
  }, [tokenValue, token]);

  useEffect(() => {
    if (isModalOpen) {
      handleCollateralBalance();
      setTokenValue(undefined);
      setCollateralValue(undefined);
      handleGetFee();
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
                    <span>{toCurrency(apr, 2)}</span>
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
                    <span>{collateralData.balance}</span>
                    <span className="ml-1 token">{token}</span>
                    <div className="modal-borrow-value-usd">${collateralData.balance_usd}</div>
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
                  <span className="mr-1">Minimum amount: </span> {minimalCollateral} {token}
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
                      disabled={
                        !tokenValue ||
                        !collateralValue ||
                        collateralValue < minimalCollateral ||
                        loadingBalanceCollateral ||
                        loadingMinimumCollateral ||
                        collateralData.balance === 0
                      }
                      className="w-full"
                      loading={loading}>
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
                          !tokenValue ||
                          !collateralValue ||
                          collateralValue < minimalCollateral ||
                          loadingBalanceCollateral ||
                          loadingMinimumCollateral ||
                          collateralData.balance === 0
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
              stableCoinAmount={tokenValue}
              collateralAmount={collateralValue}
              hash={txHash}
              errorTx={errorTx}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
