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
  LoadingOutlined,
} from '@ant-design/icons';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import { useTranslation } from 'next-i18next';
import {
  COLLATERAL_TOKEN,
  TRANSACTION_STATUS,
  CONTRACT_ADDRESS,
  DEFAULT_ADDRESS,
  MIN_AMOUNT_KEY,
} from '@/constants/common.constant';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';
import service from '@/utils/backend/borrow';
import service_ccfl_borrow from '@/utils/contract/ccflBorrow.service';
import { useAccount, useConfig } from 'wagmi';
import { debounce } from 'lodash';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  stableCoin: any;
  step: any;
  setStep: any;
  token: any;
  setToken: any;
  apr: any;
  decimalStableCoin: any;
  priceStableCoin: any;
  handleLoans?: any;
}

interface IFormInput {
  numberfield: number;
  collateralField: number;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  stableCoin,
  step,
  setStep,
  token,
  setToken,
  apr,
  decimalStableCoin,
  priceStableCoin,
  handleLoans,
}: ModalBorrowProps) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      numberfield: 0,
      collateralField: 0,
    },
  });
  const { t } = useTranslation('common');
  const { address, connector, chainId } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [isYield, setYield] = useState(false);
  const [loadingBalanceCollateral, setLoadingBalanceCollateral] = useState<boolean>(false);
  const [loadingMinimumCollateral, setLoadingMinimumCollateral] = useState<boolean>(false);
  const [collateralData, setCollateralData] = useState({
    balance: 0,
    balance_usd: 0,
    decimals: 8,
    address: undefined,
  }) as any;
  const [minimalCollateral, setMinimalCollateral] = useState(0);
  const [stableCoinValue, setStableCoinValue] = useState();
  const [collateralValue, setCollateralValue] = useState();
  const [txHash, setTxHash] = useState();
  const [errorTx, setErrorTx] = useState() as any;
  const [gasFee, setGasFee] = useState(0);
  const [status, setStatus] = useState(TRANSACTION_STATUS.SUCCESS);
  const [healthFactor, setHealthFactor] = useState();
  const [loadingHealthFactor, setLoadingHealthFactor] = useState<boolean>(false);
  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
    nonEnoughBalanceCollateral: false,
  }) as any;
  const [stableCoinInfo, setStableCoinInfo] = useState({
    address: undefined,
    loadingStatus: false,
  });
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);
  const [minimum, setMinimum] = useState() as any;

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const provider = await connector?.getProvider();
    if (step === 0) {
      try {
        setLoading(true);
        let tx = await service_ccfl_borrow.approveBorrow(
          provider,
          CONTRACT_ADDRESS,
          toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
          address,
          collateralData.address,
        );
        if (tx?.link) {
          setStep(1);
          setErrorTx(undefined);
          setErrorEstimate({
            nonEnoughBalanceWallet: false,
            exceedsAllowance: false,
            nonEnoughBalanceCollateral: false,
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
        let tx = await service_ccfl_borrow.createLoan(
          toUnitWithDecimal(stableCoinValue ? stableCoinValue : 0, decimalStableCoin),
          toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
          stableCoinInfo.address, //DEFAULT_ADDRESS[stableCoinKey],
          collateralData.address, //DEFAULT_ADDRESS[collateralKey],
          isYield,
          IsFiat,
          provider,
          address,
          CONTRACT_ADDRESS,
        );
        if (tx?.link) {
          setStep(2);
          setTxHash(tx.link);
          setErrorTx(undefined);
          setErrorEstimate({
            nonEnoughBalanceWallet: false,
            exceedsAllowance: false,
            nonEnoughBalanceCollateral: false,
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

  const handleChange = (value: any) => {
    setToken(value);
  };

  const handleYield = (e: any) => {
    setYield(e.target.checked);
  };

  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_BORROW_BORROW')} ${stableCoin?.toUpperCase()}`;
  };

  const handleCollateralBalance = async () => {
    try {
      setLoadingBalanceCollateral(true);
      let res_balance = (await service.getCollateralBalance(address, chainId, token)) as any;
      let res_token = (await service.getTokenInfo(token, chainId)) as any;
      console.log('handleCollateralBalance', res_balance, res_token);
      if (res_balance) {
        setCollateralData({
          balance: res_balance.balance
            ? toLessPart(toAmountShow(res_balance.balance, res_balance.decimals), 8)
            : 0,
          balance_usd:
            res_token && res_token[0] && res_token[0].price && res_balance.balance
              ? toLessPart(
                  toAmountShow(res_balance.balance * res_token[0].price, res_balance.decimals),
                  2,
                )
              : 0,
          decimals: res_balance.decimals ? res_balance.decimals : 8,
          address: res_token && res_token[0] && res_token[0].address,
        });
      }
      setLoadingBalanceCollateral(false);
    } catch (error) {
      console.log('error', error);
      setLoadingBalanceCollateral(false);
    }
  };

  const getStableCoin = async () => {
    try {
      setStableCoinInfo({
        ...stableCoinInfo,
        loadingStatus: true,
      });
      let res_token = (await service.getTokenInfo(stableCoin, chainId)) as any;
      console.log('getStableCoin', res_token);
      if (res_token && res_token[0]) {
        setStableCoinInfo({
          address: res_token[0].address,
          loadingStatus: false,
        });
      }
    } catch (error) {
      console.log('error', error);
      setStableCoinInfo({
        ...stableCoinInfo,
        loadingStatus: false,
      });
    }
  };

  const handleMinimumRepayment = async () => {
    try {
      setLoadingMinimum(true);
      let res = (await service.getSetting(MIN_AMOUNT_KEY.MIN_AMOUNT_BORROW)) as any;

      if (res && res[0]?.value) {
        setMinimum(res[0]?.value);
      } else {
        setMinimum(0);
      }
      setLoadingMinimum(false);
    } catch (error) {
      setLoadingMinimum(false);
    }
  };

  const handleGetCollateralMinimum = async () => {
    if (
      isModalOpen &&
      stableCoinValue &&
      stableCoinValue > 0 &&
      stableCoinInfo.address &&
      collateralData.address
    ) {
      try {
        setLoadingMinimumCollateral(true);
        let res_collateral = (await service.getCollateralInfo(token, chainId)) as any;
        const provider = await connector?.getProvider();
        let minimalCollateral = (await service_ccfl_borrow.getCollateralMinimum(
          provider,
          CONTRACT_ADDRESS,
          toUnitWithDecimal(stableCoinValue ? stableCoinValue : 0, decimalStableCoin),
          stableCoinInfo.address,
          collateralData.address,
        )) as any;
        console.log('minimum', minimalCollateral);

        if (minimalCollateral && res_collateral && res_collateral[0]?.decimals) {
          let minimum = toLessPart(
            toAmountShow(minimalCollateral, res_collateral[0].decimals),
            8,
          ) as any;
          setMinimalCollateral(minimum);
        } else {
          setMinimalCollateral(0);
        }
        setLoadingMinimumCollateral(false);
      } catch (error) {
        setMinimalCollateral(0);
        setLoadingMinimumCollateral(false);
        console.log('handleGetCollateralMinimum error', error);
      }
    } else {
      setMinimalCollateral(0);
    }
  };

  const handleGetHealthFactor = async () => {
    if (
      stableCoinValue &&
      stableCoinValue > 0 &&
      collateralValue &&
      collateralValue > 0 &&
      stableCoinInfo.address &&
      collateralData.address
    ) {
      try {
        const provider = await connector?.getProvider();
        try {
          setLoadingHealthFactor(true);
          let healthFactor = (await service_ccfl_borrow.getHealthFactor(
            provider,
            CONTRACT_ADDRESS,
            toUnitWithDecimal(stableCoinValue ? stableCoinValue : 0, decimalStableCoin),
            stableCoinInfo.address,
            collateralData.address,
            toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
          )) as any;
          if (healthFactor) {
            setHealthFactor(healthFactor);
          } else {
            setHealthFactor(undefined);
          }
          setLoadingHealthFactor(false);
        } catch (error) {
          setHealthFactor(undefined);
          setLoadingHealthFactor(false);
        }
      } catch (error) {
        console.log('handleGetHealthFactor error', error);
      }
    } else {
      setHealthFactor(undefined);
    }
  };

  const handleGetFeeApprove = async () => {
    if (step === 0) {
      if (collateralValue && collateralValue > 0 && collateralData.address) {
        const provider = await connector?.getProvider();
        try {
          setLoadingGasFee(true);
          let res = (await service_ccfl_borrow.getGasFeeApprove(
            provider,
            address,
            toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
            collateralData.address,
            CONTRACT_ADDRESS,
          )) as any;
          let res_price = (await service.getPrice(chainId, 'ETH')) as any;
          if (res && res.gasPrice && res_price && res_price.price) {
            let gasFee = res.gasPrice * res_price.price;
            setGasFee(gasFee);
            console.log('handleGetFee', res, gasFee);
          }
          // if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
          //   setGasFee(0);
          // }
          setErrorEstimate({
            ...errorEstimate,
            nonEnoughBalanceWallet: res?.nonEnoughMoney,
            exceedsAllowance: res?.exceedsAllowance,
          });
          setLoadingGasFee(false);
        } catch (error) {
          setLoadingGasFee(false);
        }
      } else {
        setGasFee(0);
      }
    }
  };

  const handleGetFeeCreateLoan = async () => {
    if (step === 1) {
      if (
        stableCoinValue &&
        stableCoinValue > 0 &&
        collateralValue &&
        collateralValue > 0 &&
        stableCoinInfo.address &&
        collateralData.address
      ) {
        const provider = await connector?.getProvider();
        try {
          setLoadingGasFee(true);
          let res = (await service_ccfl_borrow.getGasFeeCreateLoan(
            provider,
            address,
            CONTRACT_ADDRESS,
            toUnitWithDecimal(stableCoinValue ? stableCoinValue : 0, decimalStableCoin),
            stableCoinInfo.address,
            toUnitWithDecimal(collateralValue ? collateralValue : 0, collateralData.decimals),
            collateralData.address,
            isYield,
            false,
          )) as any;
          let res_price = (await service.getPrice(chainId, 'ETH')) as any;
          console.log('handleGetFeeCreateLoan res', res);

          if (res && res.gasPrice && res_price && res_price.price) {
            let gasFee = res.gasPrice * res_price.price;
            setGasFee(gasFee);
          }

          // if (res && (res.nonEnoughMoney || res.exceedsAllowance)) {
          //   setGasFee(0);
          // }
          setErrorEstimate({
            ...errorEstimate,
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

  const handleCheckAllowance = async () => {
    const provider = await connector?.getProvider();
    try {
      let res = (await service_ccfl_borrow.checkAllowance(
        provider,
        collateralData.address,
        address,
        CONTRACT_ADDRESS,
      )) as any;
      if (collateralValue && res > collateralValue) {
        setStep(1);
      } else {
        setStep(0);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const resetState = () => {
    setLoading(false);
    // setLoadingBalanceCollateral(false);
    // setLoadingHealthFactor(false);
    // setLoadingMinimumCollateral(false);
    setStableCoinValue(undefined);
    setCollateralValue(undefined);
    setHealthFactor(undefined);
    setStatus(TRANSACTION_STATUS.SUCCESS);
    setGasFee(0);
    setErrorTx(undefined);
    setTxHash(undefined);
    setMinimalCollateral(0);
    setErrorEstimate({
      nonEnoughBalanceWallet: false,
      exceedsAllowance: false,
      nonEnoughBalanceCollateral: false,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      handleGetCollateralMinimum();
      handleGetHealthFactor();
      handleGetFeeCreateLoan();
      handleGetFeeApprove();
    }
  }, [collateralData]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetCollateralMinimum();
      handleGetHealthFactor();
      handleGetFeeCreateLoan();
    }
  }, [stableCoinValue]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetHealthFactor();
      handleGetFeeApprove();
      handleGetFeeCreateLoan();
    }
  }, [collateralValue]);

  useEffect(() => {
    if (isModalOpen) {
      handleCollateralBalance();
    }
  }, [token]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetFeeCreateLoan();
    }
  }, [isYield, step]);

  // useEffect(() => {
  //   if (isModalOpen) {
  //     handleCheckAllowance();
  //   }
  // }, [isModalOpen, collateralValue, token]);

  useEffect(() => {
    if (isModalOpen) {
      handleCollateralBalance();
      getStableCoin();
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
              <div className="px-6 pt-4 ">
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
                          value={stableCoinValue}
                          onChange={(value: any) => {
                            setStableCoinValue(value);
                          }}
                          disabled={loading}
                        />
                      )}
                    />
                    <div className="flex">
                      <Image
                        src={`/images/common/${stableCoin}.png`}
                        alt={stableCoin}
                        width={24}
                        height={24}
                      />
                      <span className="modal-borrow-token ml-2">{stableCoin?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="modal-borrow-usd">
                      ≈ $
                      {stableCoinValue && priceStableCoin[stableCoin]
                        ? toLessPart(stableCoinValue * priceStableCoin[stableCoin], 2)
                        : 0}
                    </span>
                    {/* <Button disabled={loading} className="modal-borrow-max">
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button> */}
                  </div>
                </div>
              </div>
              <div className="modal-borrow-balance-minimum">
                <span>
                  {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_MINIMUM_AMOUNT')}:{' '}
                  {loadingMinimum ? <LoadingOutlined className="mr-1" /> : minimum}{' '}
                  {stableCoin?.toUpperCase()}
                </span>
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
                    <span>{toLessPart(apr, 2)}</span>
                    <span>%</span>
                  </div>
                </div>
              </div>
              <div className="modal-borrow-collateral">
                <div className="modal-borrow-sub-title">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_SETUP')}
                </div>
                {errorEstimate.nonEnoughBalanceCollateral && (
                  <div className="modal-borrow-error">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH')}
                  </div>
                )}
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
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    <WalletOutlined className="wallet-icon" /> {token} {t('BORROW_MODAL_BALANCE')}
                  </div>
                  <div className="modal-borrow-value">
                    {loadingBalanceCollateral ? (
                      <LoadingOutlined className="mr-1" />
                    ) : (
                      <span>{collateralData.balance}</span>
                    )}
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
                            if (collateralData.balance > 0 && value > collateralData.balance) {
                              setErrorEstimate({
                                ...errorEstimate,
                                nonEnoughBalanceCollateral: true,
                              });
                              setCollateralValue(undefined);
                            } else {
                              setErrorEstimate({
                                ...errorEstimate,
                                nonEnoughBalanceCollateral: false,
                              });
                              setCollateralValue(value);
                            }
                          }}
                          disabled={loading}
                        />
                      )}
                    />
                    <span className="">{token?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="modal-borrow-minimum">
                  <span className="mr-1">
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_MINIMUM_AMOUNT')}:{' '}
                  </span>{' '}
                  {loadingMinimumCollateral ? (
                    <LoadingOutlined className="mr-1" />
                  ) : (
                    minimalCollateral
                  )}{' '}
                  {token}
                </div>
                <div className="flex justify-between items-center modal-borrow-health c-white">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_BORROW_HEALTH')}</div>
                  <div className="flex">
                    <span className="c-white">∞</span>
                    {stableCoinValue &&
                    stableCoinValue > 0 &&
                    collateralValue &&
                    collateralValue > 0 ? (
                      <div className="flex">
                        {(loadingHealthFactor || healthFactor) && (
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
                        !stableCoinValue ||
                        !collateralValue ||
                        collateralValue < minimalCollateral ||
                        loadingBalanceCollateral ||
                        loadingMinimumCollateral ||
                        loadingHealthFactor ||
                        collateralData.balance === 0 ||
                        errorEstimate.nonEnoughBalanceWallet ||
                        errorEstimate.exceedsAllowance ||
                        errorEstimate.nonEnoughBalanceCollateral ||
                        stableCoinInfo.loadingStatus ||
                        stableCoinValue < minimum
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
                          !stableCoinValue ||
                          !collateralValue ||
                          collateralValue < minimalCollateral ||
                          loadingBalanceCollateral ||
                          loadingMinimumCollateral ||
                          loadingHealthFactor ||
                          collateralData.balance === 0 ||
                          errorEstimate.nonEnoughBalanceWallet ||
                          errorEstimate.exceedsAllowance ||
                          errorEstimate.nonEnoughBalanceCollateral ||
                          stableCoinInfo.loadingStatus ||
                          stableCoinValue < minimum
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
              currentToken={stableCoin}
              setStep={setStep}
              token={token}
              isBorrow={true}
              status={status}
              stableCoinAmount={stableCoinValue}
              collateralAmount={collateralValue}
              txLink={txHash}
              errorTx={errorTx}
              handleLoans={handleLoans}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
