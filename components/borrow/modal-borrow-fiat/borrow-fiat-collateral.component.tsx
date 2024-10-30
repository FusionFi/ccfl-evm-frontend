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
import { COLLATERAL_TOKEN, CONTRACT_ADDRESS } from '@/constants/common.constant';
import service_borrow from '@/utils/backend/borrow';
import { useAccount } from 'wagmi';
import { useGetCollateralMinimum } from '@/hooks/provider.hook';

type FieldType = {
  amount?: any;
};

export default function ModalBorrowFiatCollateralComponent({
  next,
  back,
  detail,
  provider,
  selectedChain,
}: any) {
  const {
    paymentMethod,
    amount: amountStableCoin,
    fiatTransactionFee,
    countryInfo,
    active,
  } = detail;
  const { t } = useTranslation('common');
  const { connector } = useAccount();
  const [getCollateralMinimum] = useGetCollateralMinimum(provider);

  const [_isPending, _setIsPending] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [price, setPrice] = useState();
  const [isActive, setActive] = useState(true);
  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKEN[0].name);
  const [collateralData, setCollateralData] = useState({
    balance: 0,
    balance_usd: 0,
    decimals: 8,
    address: undefined,
  }) as any;
  const [collateralAmount, setCollateralAmount] = useState();
  const [loadingBalanceCollateral, setLoadingBalanceCollateral] = useState<boolean>(false);
  const [minimalCollateral, setMinimalCollateral] = useState(0);
  const [loadingMinimumCollateral, setLoadingMinimumCollateral] = useState<boolean>(false);

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = data => {
    _setIsPending(true);
    setTimeout(() => {
      next();
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
        setPrice(res.price);
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
        });
      }
      setLoadingBalanceCollateral(false);
    } catch (error) {
      console.log('error', error);
      setLoadingBalanceCollateral(false);
    }
  };

  const handleGetCollateralMinimum = async () => {
    if (collateralAmount && collateralAmount > 0 && collateralData.address) {
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
          amount: toUnitWithDecimal(collateralAmount, 6),
          stableCoin: stableCoinInfo.address,
          collateral: collateralData.address,
        })) as any;
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

  useEffect(() => {
    if (active == 3) {
      handleCollateralBalance();
    }
  }, [collateralToken]);

  useEffect(() => {
    if (countryInfo?.currency && active == 3) {
      handleGetPrice();
      handleCollateralBalance();
      handleGetCollateralMinimum();
    }
  }, [active]);

  console.log('detail', detail, amountStableCoin);

  return (
    <Form form={form} onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0);
        // const collateralAmount = formInstance.getFieldValue('collateralAmount');
        // const collateralToken =
        //   formInstance.getFieldValue('collateralToken') ?? COLLATERAL_TOKEN[0].name;

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
                    {price && amountStableCoin && (
                      <span className="borrow-fiat-collateral-container__loan__item__value__price">
                        ${formatNumber(amountStableCoin * price, true)}
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
                        {price && amountStableCoin && fiatTransactionFee && (
                          <div className="borrow-fiat-collateral-container__loan__item__value">
                            <span className="borrow-fiat-collateral-container__loan__item__value__unit">
                              $
                            </span>
                            {formatNumber(
                              (amountStableCoin * price * fiatTransactionFee) / 100,
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
                            setCollateralAmount(value);
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
                      <span className="font-bold text-base">3.31B</span>
                      {collateralAmount && collateralAmount > 0 && (
                        <>
                          <ArrowRightOutlined />
                          <span
                            className="font-bold text-base"
                            style={{
                              color: '#52C41A',
                            }}>
                            3.33B
                          </span>
                        </>
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
                    2.00
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
                    disabled={isNotValidForm || !collateralAmount}
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
