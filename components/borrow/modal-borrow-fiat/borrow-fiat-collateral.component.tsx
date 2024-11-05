import React, { useEffect, useState } from 'react';
import cssClass from './borrow-fiat-collateral.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Button } from 'antd';
import type { CheckboxProps, FormProps } from 'antd';
import {
  WalletOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import service from '@/utils/backend/encryptus';
import { formatNumber, toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';
import { ACTION_TYPE, COLLATERAL_TOKEN, CONTRACT_ADDRESS } from '@/constants/common.constant';
import service_borrow from '@/utils/backend/borrow';
import { useAccount } from 'wagmi';
import {
  useGetCollateralMinimum,
  useGetGasFeeApprove,
  useGetHealthFactor,
} from '@/hooks/provider.hook';

type FieldType = {
  amount?: any;
};

export default function ModalBorrowFiatCollateralComponent({
  next,
  back,
  detail,
  provider,
  selectedChain,
  tokenList,
  price,
}: any) {
  const {
    paymentMethod,
    amount: amountStableCoin,
    fiatTransactionFee,
    countryInfo,
    active,
    repaymentCurrency,
  } = detail;
  const { t } = useTranslation('common');
  const { connector } = useAccount();
  const [getCollateralMinimum] = useGetCollateralMinimum(provider);
  const [getHealthFactor] = useGetHealthFactor(provider);
  const [getGasFeeApprove] = useGetGasFeeApprove(provider);

  const [_isPending, _setIsPending] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceFiat, setPriceFiat] = useState();
  const [isActive, setActive] = useState(true);
  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKEN[0].name);
  const [collateralData, setCollateralData] = useState({
    balance: 0,
    balance_usd: 0,
    decimals: 8,
    address: undefined,
    priceCollateral: undefined,
  }) as any;
  const [collateralAmount, setCollateralAmount] = useState();
  const [loadingBalanceCollateral, setLoadingBalanceCollateral] = useState<boolean>(false);
  const [minimalCollateral, setMinimalCollateral] = useState(0);
  const [loadingMinimumCollateral, setLoadingMinimumCollateral] = useState<boolean>(false);
  const [stableCoinAddress, setStableCoinAddresso] = useState();
  const [healthFactor, setHealthFactor] = useState();
  const [loadingHealthFactor, setLoadingHealthFactor] = useState<boolean>(false);
  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState(0);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
    nonEnoughBalanceCollateral: false,
  }) as any;
  const [stableCoindDecimal, setStableCoindDecimal] = useState();

  console.log('price', price);
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = data => {
    _setIsPending(true);
    setTimeout(() => {
      console.log(
        'onFinish 3',
        collateralAmount,
        collateralData.priceCollateral,
        collateralData.decimals,
        collateralAmount &&
          toAmountShow(collateralAmount * collateralData.priceCollateral, collateralData.decimals),
      );
      next({
        amountUSD: priceFiat ? formatNumber(amountStableCoin * priceFiat, true) : 0,
        finalFiatFee: priceFiat
          ? formatNumber((amountStableCoin * priceFiat * fiatTransactionFee) / 100, true)
          : 0,
        collateralToken: collateralToken,
        collateralAmount: collateralAmount,
        collateralAmountUSD:
          collateralAmount && collateralData.priceCollateral
            ? toLessPart(collateralAmount * collateralData.priceCollateral, 2)
            : 0,
        healthFactor: formatNumber(healthFactor),
        stableCoinAddress: stableCoinAddress,
        collateralData: collateralData,
        amountStableCoin: amountStableCoin,
        stableCoindDecimal: stableCoindDecimal,
      });
      _setIsPending(false);
    }, 1000);
  };

  const TokenMap = new Map(
    [
      {
        value: 'WETH',
        name: 'WETH',
      },
    ].map(item => [item.value, item]),
  );
  const toggleClass = () => {
    setActive(!isActive);
  };
  const handleGetPrice = async () => {
    try {
      setLoadingPrice(true);
      const res = (await service.getPrice(countryInfo?.currency)) as any;

      if (res && res.price) {
        setPriceFiat(res.price);
      }
      setLoadingPrice(false);
    } catch (error) {
      setLoadingPrice(false);
    }
  };

  const handleChange = (value: any) => {
    setCollateralToken(value);
  };

  const handleCollateralBalance = async () => {
    try {
      setLoadingBalanceCollateral(true);
      let res_balance = (await service_borrow.getCollateralBalance(
        provider?.account,
        selectedChain?.id,
        collateralToken,
      )) as any;
      let res_token = (await service_borrow.getTokenInfo(
        collateralToken,
        selectedChain?.id,
      )) as any;
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
          priceCollateral: res_token && res_token[0] ? res_token[0].price : undefined,
        });
      }
      setLoadingBalanceCollateral(false);
    } catch (error) {
      console.log('error', error);
      setLoadingBalanceCollateral(false);
    }
  };

  const handleGetCollateralMinimum = async () => {
    if (amountStableCoin && amountStableCoin > 0 && collateralData.address && stableCoinAddress) {
      let finalAmount =
        tokenList[repaymentCurrency - 1]?.asset && priceFiat
          ? (amountStableCoin * price[tokenList[repaymentCurrency - 1]?.asset]) / priceFiat
          : 0;

      try {
        setLoadingMinimumCollateral(true);
        let res_collateral = (await service_borrow.getCollateralInfo(
          collateralToken,
          selectedChain?.id,
        )) as any;
        const connector_provider = await connector?.getProvider();

        let minimalCollateral = (await getCollateralMinimum({
          provider: connector_provider,
          contract_address: CONTRACT_ADDRESS,
          amount: toUnitWithDecimal(finalAmount, tokenList[repaymentCurrency - 1]?.decimals ?? 6),
          stableCoin: stableCoinAddress,
          collateral: collateralData.address,
        })) as any;
        console.log('minimum', minimalCollateral);

        if (minimalCollateral && res_collateral && res_collateral[0]?.decimals) {
          let minimum = toLessPart(
            toAmountShow(minimalCollateral, res_collateral[0].decimals),
            8,
          ) as any;
          console.log('minimum2', minimum);

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

  const getStableCoin = async () => {
    try {
      let res_token = (await service_borrow.getTokenInfo(
        tokenList[repaymentCurrency - 1]?.asset,
        selectedChain?.id,
      )) as any;
      console.log('getStableCoin', res_token);
      if (res_token && res_token[0]) {
        setStableCoinAddresso(res_token[0].address);
        setStableCoindDecimal(res_token[0].decimals);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleGetHealthFactor = async () => {
    if (
      amountStableCoin &&
      amountStableCoin > 0 &&
      collateralAmount &&
      collateralAmount > 0 &&
      stableCoinAddress &&
      collateralData.address
    ) {
      let finalAmount =
        tokenList[repaymentCurrency - 1]?.asset && priceFiat
          ? (amountStableCoin * price[tokenList[repaymentCurrency - 1]?.asset]) / priceFiat
          : 0;

      try {
        const connector_provider = await connector?.getProvider();
        try {
          setLoadingHealthFactor(true);
          let healthFactor = (await getHealthFactor({
            type: ACTION_TYPE.BORROW,
            provider: connector_provider,
            contract_address: CONTRACT_ADDRESS,
            amount: toUnitWithDecimal(finalAmount, tokenList[repaymentCurrency - 1]?.decimals ?? 6),
            stableCoin: stableCoinAddress,
            collateral: collateralData.address,
            amountCollateral: toUnitWithDecimal(collateralAmount, collateralData.decimals),
          })) as any;
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
    setTimeout(async () => {
      if (collateralAmount && collateralAmount > 0 && collateralData.address) {
        const connector_provider = await connector?.getProvider();
        try {
          setLoadingGasFee(true);

          let res = (await getGasFeeApprove({
            provider: connector_provider,
            account: provider?.account,
            amount: toUnitWithDecimal(collateralAmount, collateralData.decimals),
            tokenAddress: collateralData.address,
            contract_address: CONTRACT_ADDRESS,
          })) as any;
          let res_price = (await service_borrow.getPrice(selectedChain?.id, 'ETH')) as any;
          if (res && res.gasPrice && res_price && res_price.price) {
            let gasFee = res.gasPrice * res_price.price;
            setGasFee(gasFee);
            console.log('handleGetFee', res, gasFee);
          }
          setErrorEstimate({
            ...errorEstimate,
            nonEnoughBalanceWallet: res?.nonEnoughMoney,
            exceedsAllowance: res?.exceedsAllowance,
          });
          setLoadingGasFee(false);
        } catch (error) {
          setLoadingGasFee(false);
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (active == 3) {
      handleGetCollateralMinimum();
      handleGetHealthFactor();
      handleGetFeeApprove();
    }
  }, [collateralData]);

  useEffect(() => {
    if (active == 3) {
      handleGetHealthFactor();
      handleGetFeeApprove();
    }
  }, [collateralAmount]);

  useEffect(() => {
    if (active == 3) {
      handleGetCollateralMinimum();
      handleGetHealthFactor();
    }
  }, [amountStableCoin]);

  useEffect(() => {
    if (active == 3) {
      handleCollateralBalance();
      handleGetCollateralMinimum();
    }
  }, [collateralToken]);

  useEffect(() => {
    if (countryInfo?.currency && active == 3) {
      getStableCoin();
      handleGetPrice();
      handleCollateralBalance();
      handleGetCollateralMinimum();
    }
  }, [active]);

  return (
    <Form form={form} onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0);

        return (
          <div className={cssClass['borrow-fiat-collateral-wrapper']}>
            <div className={'borrow-fiat-collateral-container'}>
              <div className="borrow-fiat-collateral-container__loan">
                <div className="borrow-fiat-collateral-container__loan__item">
                  <div className="borrow-fiat-collateral-container__loan__item__title">
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_LOAN_TITLE')}
                  </div>
                  <div className="borrow-fiat-collateral-container__loan__item__value">
                    {amountStableCoin}
                    <span className="borrow-fiat-collateral-container__loan__item__value__unit">
                      {countryInfo?.currency}
                    </span>
                    {priceFiat && amountStableCoin && (
                      <span className="borrow-fiat-collateral-container__loan__item__value__price">
                        ${formatNumber(amountStableCoin * priceFiat, true)}
                      </span>
                    )}
                  </div>
                </div>
                {paymentMethod == 1 && (
                  <div className="borrow-fiat-collateral-container__loan__item">
                    <div className="borrow-fiat-collateral-container__loan__item__title">
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_APY')}
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    <div className="borrow-fiat-collateral-container__loan__item__value">
                      10
                      <span className="borrow-fiat-collateral-container__loan__item__value__unit">
                        %
                      </span>
                    </div>
                  </div>
                )}
                {paymentMethod == 1 && (
                  <div className="borrow-fiat-collateral-container__loan__item">
                    <div className="borrow-fiat-collateral-container__loan__item__title">
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_ FIAT_TRANSACTION _FEE', {
                        percent: 4,
                      })}
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    {loadingPrice ? (
                      <LoadingOutlined className="mr-1" />
                    ) : (
                      <>
                        {priceFiat && amountStableCoin && fiatTransactionFee && (
                          <div className="borrow-fiat-collateral-container__loan__item__value">
                            <span className="borrow-fiat-collateral-container__loan__item__value__unit">
                              $
                            </span>
                            {formatNumber(
                              (amountStableCoin * priceFiat * fiatTransactionFee) / 100,
                              true,
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="borrow-fiat-collateral-container__detail">
                <div className="borrow-fiat-collateral-container__detail__title">
                  {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_DETAIL_TITLE')}
                </div>
                {errorEstimate.nonEnoughBalanceCollateral && (
                  <div className="borrow-fiat-collateral-container-error">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH')}
                  </div>
                )}
                {errorEstimate.nonEnoughBalanceWallet && (
                  <div className="borrow-fiat-collateral-container-error">
                    {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH_GAS')}
                  </div>
                )}
                <div className="borrow-fiat-collateral-container__detail__content">
                  <div className="borrow-fiat-collateral-container__detail__content__item">
                    <div className="borrow-fiat-collateral-container__detail__content__item__title">
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_TOKEN')}
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    <Select
                      onChange={handleChange}
                      placeholder={t('BORROW_FIAT_MODAL_TAB_COLLATERAL_TOKEN_PLACEHOLDER')}
                      className="borrow-fiat-collateral-container__detail__content__item__control-select"
                      popupClassName={cssClass['borrow-fiat-collateral-select']}
                      options={COLLATERAL_TOKEN.map((item: any) => ({
                        value: item.name,
                        label: item.name,
                      }))}
                      defaultValue={{
                        value: COLLATERAL_TOKEN[0].name,
                        label: COLLATERAL_TOKEN[0].name,
                      }}
                      suffixIcon={
                        <DownOutlined
                          className={isActive ? 'ant-select-suffix' : ''}
                          onClick={toggleClass}
                        />
                      }
                      disabled={_isPending}
                    />
                  </div>
                  <div className="borrow-fiat-collateral-container__detail__content__item">
                    <div className="borrow-fiat-collateral-container__detail__content__item__title">
                      <WalletOutlined
                        style={{
                          fontSize: 16,
                          color: '#177DDC',
                        }}
                      />{' '}
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_BALANCE', {
                        token: collateralToken,
                      })}
                    </div>

                    <div className="borrow-fiat-collateral-container__detail__content__item__value">
                      {loadingBalanceCollateral ? (
                        <LoadingOutlined className="mr-1" />
                      ) : (
                        collateralData.balance
                      )}
                      <span className="borrow-fiat-collateral-container__detail__content__item__value__unit">
                        {collateralToken}
                      </span>
                      <span className="borrow-fiat-collateral-container__detail__content__item__value__price">
                        $ {collateralData.balance_usd}
                      </span>
                    </div>
                  </div>
                  <div className="borrow-fiat-collateral-container__detail__content__item">
                    <div className="self-start">{t('BORROW_FIAT_MODAL_TAB_COLLATERAL_AMOUNT')}</div>
                    <div className="borrow-fiat-collateral-container__detail__content__item__value">
                      <div className="borrow-fiat-collateral-container__detail__content__item__value__wrapper">
                        <InputNumber
                          disabled={_isPending}
                          onChange={(value: any) => {
                            if (collateralData.balance > 0 && value > collateralData.balance) {
                              setErrorEstimate({
                                ...errorEstimate,
                                nonEnoughBalanceCollateral: true,
                              });
                              setCollateralAmount(undefined);
                            } else {
                              setErrorEstimate({
                                ...errorEstimate,
                                nonEnoughBalanceCollateral: false,
                              });
                              setCollateralAmount(value);
                            }
                          }}
                          value={collateralAmount}
                          controls={false}
                          suffix={collateralToken}
                          placeholder="Enter amount"
                          className="borrow-fiat-collateral-container__detail__content__item__control-input"
                        />
                        <div className="borrow-fiat-collateral-container__detail__content__item__value__note">
                          {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_MINIMUM_AMOUNT')}:{' '}
                          {loadingMinimumCollateral ? (
                            <LoadingOutlined className="mr-1" />
                          ) : (
                            <span className="text-white">
                              {formatNumber(minimalCollateral)} {collateralToken}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="borrow-fiat-collateral-container__detail__content__item">
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_HEALTH_FACTOR')}
                    <div
                      className="borrow-fiat-collateral-container__detail__content__item__value"
                      style={{
                        alignItems: 'center',
                      }}>
                      <span className="font-bold text-base">∞</span>
                      {collateralAmount && collateralAmount > 0 ? (
                        <>
                          {(loadingHealthFactor || healthFactor) && <ArrowRightOutlined />}
                          {loadingHealthFactor ? (
                            <LoadingOutlined className="mr-1" />
                          ) : (
                            <span
                              className="font-bold text-base"
                              style={{
                                color: '#52C41A',
                              }}>
                              {formatNumber(healthFactor)}
                            </span>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-collateral-container__tx">
                <div className="borrow-fiat-collateral-container__tx__item">
                  <div className="borrow-fiat-collateral-container__tx__item__title">
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_GAS_FEE')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="borrow-fiat-collateral-container__tx__item__value">
                    <span className="borrow-fiat-collateral-container__tx__item__value__unit">
                      $
                    </span>
                    {loadingGasFee ? (
                      <LoadingOutlined className="mr-1" />
                    ) : (
                      formatNumber(toLessPart(gasFee, 2))
                    )}
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-collateral-container__action">
                <div className="borrow-fiat-collateral-container__action__item">
                  <Button
                    onClick={back}
                    className={twMerge('borrow-fiat-collateral-container__action__item__back')}>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_BACK')}
                  </Button>
                </div>
                <div className="borrow-fiat-collateral-container__action__item">
                  <Button
                    loading={_isPending}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      isNotValidForm ||
                      !collateralAmount ||
                      errorEstimate.nonEnoughBalanceWallet ||
                      errorEstimate.exceedsAllowance ||
                      errorEstimate.nonEnoughBalanceCollateral ||
                      loadingGasFee ||
                      loadingHealthFactor ||
                      loadingMinimumCollateral ||
                      loadingBalanceCollateral ||
                      (collateralAmount && collateralAmount === 0) ||
                      collateralData.balance === 0 ||
                      loadingPrice
                    }
                    className={twMerge('btn-primary-custom')}>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_NEXT')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Form>
  );
}
