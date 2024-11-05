import React, { useEffect, useState } from 'react';
import cssClass from './borrow-fiat-confirm.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Button } from 'antd';
import type { CheckboxProps, FormProps } from 'antd';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import Link from 'next/link';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import { formatNumber, toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';
import { CircleFlag } from 'react-circle-flags';
import { CONTRACT_ADDRESS, FIAT_METHOD, TRANSACTION_STATUS } from '@/constants/common.constant';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import {
  useAllowanceBorrow,
  useApprovalBorrow,
  useCreateLoan,
  useGetGasFeeApprove,
} from '@/hooks/provider.hook';
import service_borrow from '@/utils/backend/borrow';

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
    countryInfo,
    amount,
    amountUSD,
    bank,
    accountNumber,
    accountOwner,
    purposePayment,
    sourceIncome,
    description,
    repaymentCurrency,
    chainName,
    assetName,
    finalFiatFee,
    collateralToken,
    collateralAmount,
    collateralAmountUSD,
    healthFactor,
    active,
    stableCoinAddress,
    collateralData,
    amountStableCoin,
    stableCoindDecimal,
  } = detail;
  const { t } = useTranslation('common');
  const { connector } = useAccount();

  const [allowanceBorrow] = useAllowanceBorrow(provider);
  const [getGasFeeApprove] = useGetGasFeeApprove(provider);
  const [approveBorrow] = useApprovalBorrow(provider);
  const [createLoan] = useCreateLoan(provider);

  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [_isPending, _setIsPending] = useState(false);
  const [_isApproved, _setIsApproved] = useState(false);
  const [gasFee, setGasFee] = useState(0);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
    nonEnoughBalanceCollateral: false,
  }) as any;
  const [isYield, setIsYield] = useState(false);
  const [allowanceNumber, setAllowanceNumber] = useState(0) as any;
  const [errorTx, setErrorTx] = useState() as any;
  const [status, setStatus] = useState(TRANSACTION_STATUS.SUCCESS);
  const [txHash, setTxHash] = useState();

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = e => {
    setIsYield(e.target.checked);
  };

  const onFinish = async () => {
    const connector_provider = await connector?.getProvider();
    const finalData = {
      bank: bank,
      accountNumber: accountNumber,
      accountOwner: accountOwner,
      purposePayment: purposePayment,
      sourceIncome: sourceIncome,
      description: description,
      collateralData: collateralData,
      collateralAmount: collateralAmount,
      errorTx: errorTx,
      status: status,
      txHash: txHash,
      amount: amount,
      countryInfo: countryInfo,
      paymentMethod: paymentMethod,
    };

    _setIsPending(true);
    setTimeout(async () => {
      if (_isApproved) {
        try {
          _setIsPending(true);
          let tx = await createLoan({
            amount: toUnitWithDecimal(amountStableCoin, stableCoindDecimal),
            amountCollateral: toUnitWithDecimal(collateralAmount, collateralData.decimals),
            stableCoin: stableCoinAddress,
            collateral: collateralData.address,
            IsYieldGenerating: isYield,
            IsFiat: true,
            provider: connector_provider,
            account: provider?.account,
            contract_address: CONTRACT_ADDRESS,
          });
          if (tx?.link) {
            next({ ...finalData, txHash: tx.link, errorTx: undefined });
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
            next({ ...finalData, status: TRANSACTION_STATUS.FAILED, errorTx: tx.error });
            setStatus(TRANSACTION_STATUS.FAILED);
            setErrorTx(tx.error as any);
          }
          _setIsPending(false);
        } catch (error) {
          next({ ...finalData, status: TRANSACTION_STATUS.FAILED, errorTx: error });
          setErrorTx(error);
          setStatus(TRANSACTION_STATUS.FAILED);
          _setIsPending(false);
        }
      } else {
        try {
          _setIsPending(true);
          let tx = await approveBorrow({
            provider: connector_provider,
            contract_address: CONTRACT_ADDRESS,
            amount: toUnitWithDecimal(collateralAmount, collateralData.decimals),
            address: provider?.account,
            tokenContract: collateralData.address,
          });

          if (tx?.link) {
            _setIsApproved(true);
            setErrorTx(undefined);
            setErrorEstimate({
              nonEnoughBalanceWallet: false,
              exceedsAllowance: false,
              nonEnoughBalanceCollateral: false,
            });
            setStatus(TRANSACTION_STATUS.SUCCESS);
          }
          if (tx?.error) {
            next({ ...finalData, status: TRANSACTION_STATUS.FAILED, errorTx: tx.error });
            setStatus(TRANSACTION_STATUS.FAILED);
            setErrorTx(tx.error as any);
          }
          _setIsPending(false);
        } catch (error) {
          next({ ...finalData, status: TRANSACTION_STATUS.FAILED, errorTx: error });
          setErrorTx(error);
          setStatus(TRANSACTION_STATUS.FAILED);
          _setIsPending(false);
        }
      }
      _setIsPending(false);
    }, 1000);
  };

  const handleCheckAllowance = async () => {
    if (
      collateralData?.address &&
      provider?.account &&
      stableCoinAddress &&
      collateralAmount &&
      collateralAmount > 0 &&
      !_isPending
    ) {
      const connector_provider = await connector?.getProvider();
      try {
        let res = (await allowanceBorrow({
          provider: connector_provider,
          tokenAddress: collateralData.address,
          account: provider?.account,
          spender: CONTRACT_ADDRESS,
        })) as any;

        const isNotNeedToApprove = new BigNumber(
          toAmountShow(res, collateralData.decimals),
        ).isGreaterThanOrEqualTo(collateralAmount);

        console.log(
          'allowance borrow',
          res,
          toAmountShow(res, collateralData.decimals),
          collateralAmount,
          isNotNeedToApprove,
        );
        setAllowanceNumber(toAmountShow(res, collateralData.decimals));
        if (isNotNeedToApprove) {
          _setIsApproved(true);
        } else {
          _setIsApproved(false);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const handleGetFeeCreateLoan = async () => {
    setTimeout(async () => {
      if (_isApproved) {
        if (
          amountStableCoin &&
          amountStableCoin > 0 &&
          collateralAmount &&
          collateralAmount > 0 &&
          stableCoinAddress &&
          collateralData.address &&
          allowanceNumber &&
          allowanceNumber >= collateralAmount
        ) {
          const connector_provider = await connector?.getProvider();
          try {
            setLoadingGasFee(true);
            let res = (await createLoan({
              provider: connector_provider,
              account: provider?.account,
              contract_address: CONTRACT_ADDRESS,
              amount: toUnitWithDecimal(amountStableCoin, stableCoindDecimal),
              stableCoin: stableCoinAddress,
              amountCollateral: toUnitWithDecimal(collateralAmount, collateralData.decimals),
              collateral: collateralData.address,
              IsYieldGenerating: isYield,
              isFiat: true,
              isGas: true,
            })) as any;
            let res_price = (await service_borrow.getPrice(selectedChain?.id, 'ETH')) as any;
            console.log('handleGetFeeCreateLoan res', res);

            if (res && res.gasPrice && res_price && res_price.price) {
              let gasFee = res.gasPrice * res_price.price;
              setGasFee(gasFee);
            }

            setErrorEstimate({
              ...errorEstimate,
              nonEnoughBalanceWallet: res?.nonEnoughMoney,
              exceedsAllowance: res?.exceedsAllowance,
            });
            setLoadingGasFee(false);
          } catch (error: any) {
            setLoadingGasFee(false);
          }
        }
      }
    }, 500);
  };

  const handleGetFeeApprove = async () => {
    setTimeout(async () => {
      if (!_isApproved) {
        if (
          collateralAmount &&
          collateralAmount > 0 &&
          collateralData.address &&
          !!(allowanceNumber == 0 || allowanceNumber < collateralAmount)
        ) {
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
      }
    }, 500);
  };

  useEffect(() => {
    if (active == 4) {
      handleCheckAllowance();
      handleGetFeeApprove();
      handleGetFeeCreateLoan();
    }
  }, [isYield, active]);

  return (
    <div className={cssClass['borrow-fiat-confirm-wrapper']}>
      <div className={'borrow-fiat-confirm-container'}>
        <div className="borrow-fiat-confirm-container__loan">
          <div className="borrow-fiat-confirm-container__loan__title">
            {t('BORROW_FIAT_MODAL_TAB_CONFIRM_LOAN_TITLE')}
          </div>
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_LOAN_CURRENCY')}
            </div>

            <div
              className="borrow-fiat-confirm-container__loan__item__value"
              style={{
                alignItems: 'center',
              }}>
              <CircleFlag
                countryCode={countryInfo?.countryCode.toLowerCase()}
                className="mr-2"
                style={{
                  height: 16,
                  width: 16,
                }}
              />
              {countryInfo?.countryName}/{countryInfo?.currency}
            </div>
          </div>
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_LOAN_AMOUNT')}
            </div>

            <div className="borrow-fiat-confirm-container__loan__item__value">
              <span className="text-white">{formatNumber(amount, true)}</span>
              <span className="borrow-fiat-confirm-container__loan__item__value__unit">USD</span>
              <span className="borrow-fiat-confirm-container__loan__item__value__price">
                ${amountUSD}
              </span>
            </div>
          </div>
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_PAYOUT_METHOD')}
            </div>

            <div className="borrow-fiat-confirm-container__loan__item__value">
              <span className="text-white">
                {paymentMethod ? FIAT_METHOD[paymentMethod - 1] : FIAT_METHOD[0]}
              </span>
            </div>
          </div>
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_PAYOUT_DETAIL')}
            </div>

            <div className="borrow-fiat-confirm-container__loan__item__value">
              <span className="text-white">{bank}</span>
              <span className="borrow-fiat-confirm-container__loan__item__value__unit">
                {accountNumber}
              </span>
              <span className="borrow-fiat-confirm-container__loan__item__value__price">
                {accountOwner}
              </span>
            </div>
          </div>
          {paymentMethod == 1 && (
            <div className="borrow-fiat-confirm-container__loan__item">
              <div className="borrow-fiat-confirm-container__loan__item__title">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_PURPOSE_OF_PAYMENT')}
              </div>

              <div className="borrow-fiat-confirm-container__loan__item__value">
                {purposePayment}
              </div>
            </div>
          )}
          {paymentMethod == 1 && (
            <div className="borrow-fiat-confirm-container__loan__item">
              <div className="borrow-fiat-confirm-container__loan__item__title">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_SOURCE_OF_INCOME')}
              </div>

              <div className="borrow-fiat-confirm-container__loan__item__value">{sourceIncome}</div>
            </div>
          )}
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_DESCRIPTION')}
            </div>

            <div className="borrow-fiat-confirm-container__loan__item__value">{description}</div>
          </div>
          <div className="borrow-fiat-confirm-container__loan__item">
            <div className="borrow-fiat-confirm-container__loan__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_REPAYMENT_CURRENCY')}
            </div>

            <div
              className="borrow-fiat-confirm-container__loan__item__value"
              style={{
                alignItems: 'center',
              }}>
              <Image
                src={assetName ? `/images/common/${assetName}.png` : '/images/common/USDC.png'}
                alt={assetName}
                width={14}
                height={14}
              />
              <span className="text-white font-base font-bold">{assetName}</span>
              <span className="font-base">({chainName})</span>
            </div>
          </div>
        </div>
        <div className="borrow-fiat-confirm-container__tx">
          <div className="borrow-fiat-confirm-container__tx__item">
            <div className="borrow-fiat-confirm-container__tx__item__title">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_GAS_FEE')}
              <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                <span className="cursor-pointer">
                  <InfoCircleIcon className="" />
                </span>
              </Tooltip>
            </div>
            <div className="borrow-fiat-confirm-container__tx__item__value">
              <span className="borrow-fiat-confirm-container__tx__item__value__unit">$</span>
              {loadingGasFee ? (
                <LoadingOutlined className="mr-1" />
              ) : (
                formatNumber(toLessPart(gasFee, 2))
              )}
            </div>
          </div>
          {paymentMethod == 1 && (
            <div className="borrow-fiat-confirm-container__tx__item">
              <div className="borrow-fiat-confirm-container__tx__item__title">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_FIAT_TRANSACTION_FEE', {
                  percent: 4,
                })}
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span className="cursor-pointer">
                    <InfoCircleIcon className="" />
                  </span>
                </Tooltip>
              </div>

              <div className="borrow-fiat-confirm-container__tx__item__value">
                <span className="borrow-fiat-confirm-container__tx__item__value__unit">$</span>
                {finalFiatFee}
              </div>
            </div>
          )}
        </div>

        <div className="borrow-fiat-confirm-container__detail">
          <div className="borrow-fiat-confirm-container__detail__title">
            {t('BORROW_FIAT_MODAL_TAB_CONFIRM_COLLATERAL_SETUP')}
          </div>
          <div className="borrow-fiat-confirm-container__detail__content">
            <div className="borrow-fiat-confirm-container__detail__content__item">
              <div className="borrow-fiat-confirm-container__detail__content__item__title">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_COLLATERAL_TOKEN')}
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span className="cursor-pointer">
                    <InfoCircleIcon className="" />
                  </span>
                </Tooltip>
              </div>
              <div
                className="borrow-fiat-confirm-container__detail__content__item__value"
                style={{
                  alignItems: 'center',
                }}>
                <Image
                  src={
                    collateralToken
                      ? `/images/common/${collateralToken}.png`
                      : `/images/common/WETH.png`
                  }
                  alt={collateralToken}
                  width={16}
                  height={16}
                />
                {collateralToken}
              </div>
            </div>
            <div className="borrow-fiat-confirm-container__detail__content__item">
              <div className="self-start">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_COLLATERAL_AMOUNT')}
              </div>
              <div className="borrow-fiat-confirm-container__detail__content__item__value">
                <span className="text-white font-medium">{collateralAmount}</span>
                <span className="borrow-fiat-confirm-container__detail__content__item__value__unit">
                  {collateralToken}
                </span>
                <span className="borrow-fiat-confirm-container__detail__content__item__value__price">
                  ${collateralAmountUSD}
                </span>
              </div>
            </div>
            <div className="borrow-fiat-confirm-container__detail__content__item">
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_HEALTH_FACTOR')}
              <div
                className="borrow-fiat-confirm-container__detail__content__item__value"
                style={{
                  alignItems: 'center',
                }}>
                <span className="font-bold text-base">∞</span>
                <ArrowRightOutlined />
                <span
                  className="font-bold text-base"
                  style={{
                    color: '#52C41A',
                  }}>
                  {healthFactor}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="borrow-fiat-confirm-container__email">
          <div className="borrow-fiat-confirm-container__email__control">
            <Checkbox onChange={handleReceiveEmailCheck}>
              {t('BORROW_FIAT_MODAL_TAB_CONFIRM_EMAIL')}
            </Checkbox>
          </div>
        </div>
        <div className="borrow-fiat-confirm-container__action">
          {!_isApproved && (
            <div className="borrow-fiat-confirm-container__action__approve__helper">
              <QuestionCircleIcon />
              <Link
                className="borrow-fiat-confirm-container__action__approve__helper__link"
                href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                target="_blank">
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_APPROVE_MESSAGE')}
              </Link>
            </div>
          )}

          <div className="borrow-fiat-confirm-container__action__control">
            <div className="borrow-fiat-confirm-container__action__control__item">
              <Button
                onClick={back}
                className={twMerge('borrow-fiat-confirm-container__action__control__item__back')}>
                {t('BORROW_FIAT_MODAL_TAB_CONFIRM_ACTION_BACK')}
              </Button>
            </div>
            <div className="borrow-fiat-confirm-container__action__control__item">
              <Button
                loading={_isPending}
                type="primary"
                onClick={onFinish}
                className={twMerge('btn-primary-custom')}>
                {!_isApproved
                  ? t('BORROW_FIAT_MODAL_TAB_CONFIRM_ACTION_APPROVE', {
                      token: 'WETH',
                    })
                  : t('BORROW_FIAT_MODAL_TAB_CONFIRM_ACTION_DEPOSIT', {
                      token: 'WETH',
                    })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
