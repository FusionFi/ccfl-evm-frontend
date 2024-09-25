import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import ModalComponent from '@/components/common/modal.component';
import { WalletIcon } from '@/components/icons/wallet.icon';
import { CONTRACT_ADDRESS, TRANSACTION_STATUS } from '@/constants/common.constant';
import {
  ArrowRightOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import service_ccfl_collateral from '@/utils/contract/ccflCollateral.service';
import service from '@/utils/backend/borrow';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';

interface ModalCollateralProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  loanItem: any;
}

interface IFormInput {
  numberfield: number;
}

export default function ModalCollateralComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  loanItem,
}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const { address, connector, chainId } = useAccount();

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      numberfield: 0,
    },
  });

  const [tokenValue, setTokenValue] = useState();
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);
  const [minimum, setMinimum] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [stableCoinData, setStableCoinData] = useState({
    balance: 0,
    address: undefined,
  }) as any;

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step == 1) {
        setTokenValue(undefined);
      }
      setStep(step + 1);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);

  const status = 'FAILED';
  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_COLLATERAL_TITLE')}`;
  };

  const getTokenInfo = async () => {
    try {
      setLoadingBalance(true);
      let res_info = (await service.getTokenInfo(currentToken, chainId)) as any;
      let res_balance = (await service.getCollateralBalance(address, chainId, currentToken)) as any;

      console.log('res_info', res_info, res_balance);
      let token = stableCoinData;
      if (res_balance) {
        token.balance = res_balance.balance
          ? toLessPart(toAmountShow(res_balance.balance, res_balance.decimals), 4)
          : 0;
      }
      if (res_info && res_info[0]) {
        token.address = res_info[0].address;
      }
      setStableCoinData(token);
      setLoadingBalance(false);
    } catch (error) {
      setLoadingBalance(false);
      console.log('getTokenInfo error', error);
    }
  };

  const handleMinimumRepayment = async () => {
    // try {
    //   const provider = await connector?.getProvider();
    //   setLoadingMinimum(true);
    //   let res = (await service_ccfl_collateral.getMinimumRepayment(
    //     provider,
    //     CONTRACT_ADDRESS,
    //     loanItem.loan_id,
    //   )) as any;
    //   if (res) {
    //     setMinimum(res);
    //   } else {
    //     setMinimum(0);
    //   }
    //   setLoadingMinimum(false);
    // } catch (error) {
    //   setLoadingMinimum(false);
    // }
  };

  const resetState = () => {
    setTokenValue(undefined);
  };

  const collateralData = {
    amount:
      loanItem && loanItem.collateral_amount && loanItem.collateral_decimals
        ? toLessPart(toAmountShow(loanItem.collateral_amount, loanItem.collateral_decimals), 4)
        : 0,
    price: loanItem && loanItem.collateral_price ? loanItem.collateral_price : 1,
  };

  useEffect(() => {
    if (isModalOpen) {
      getTokenInfo();
      handleMinimumRepayment();
      resetState();
    }
  }, [isModalOpen]);

  console.log('loanItem', loanItem);

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
                <div className="modal-borrow-title mb-2 flex items-center">
                  {t('BORROW_MODAL_COLLATERAL_AMOUNT')}
                  <div className="wallet-balance">
                    <WalletIcon className="mr-2" /> <span>{t('FORM_BALANCE')}: </span>{' '}
                    {loadingBalance ? <LoadingOutlined className="mr-1" /> : stableCoinData.balance}{' '}
                    {currentToken?.toUpperCase()}{' '}
                  </div>
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
                    <span className="modal-borrow-usd">
                      ≈ ${' '}
                      {tokenValue && collateralData?.price
                        ? toLessPart(tokenValue * collateralData?.price, 4, true)
                        : 0}
                    </span>
                    <Button disabled={loading} className="modal-borrow-max">
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button>
                  </div>
                </div>
                <div className="modal-borrow-balance">
                  <span>
                    {t('FORM_MINIMUM_AMOUNT')}: {minimum} {currentToken?.toUpperCase()}
                  </span>
                  {tokenValue && !(stableCoinData.balance - tokenValue >= 0) && (
                    <span className="insufficient">{t('BORROW_MODAL_INSUFFICIENT_BALANCE')}</span>
                  )}{' '}
                </div>
              </div>

              <div className="modal-borrow-overview collateral">
                <div className="modal-borrow-sub-title">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_SETUP')}
                </div>
                <div className="flex justify-between items-center">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_COLLATERAL_AMOUNT_SETUP')}
                  </div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>{collateralData.amount}</span>
                      {!tokenValue && <span className="ml-1">{currentToken.toUpperCase()}</span>}
                    </div>
                    {tokenValue && tokenValue > 0 && (
                      <div className="modal-borrow-repay remain">
                        <ArrowRightOutlined className="mx-1" />
                        <span>{toLessPart(collateralData.amount + tokenValue, 4)}</span>
                        <span className="ml-1">{currentToken.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center mb-2">
                  <div className="flex">
                    <div className="modal-borrow-usd">
                      <span>${collateralData.amount * collateralData.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center modal-borrow-health">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_BORROW_HEALTH')}</div>
                  <div className="flex">
                    <span>3.31B</span>
                    {tokenValue > 0 && (
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
                      disabled={!tokenValue}
                      className="w-full"
                      loading={loading}>
                      {t('BORROW_MODAL_BORROW_APPROVE', {
                        currentToken: currentToken.toUpperCase(),
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
                        {t('BORROW_MODAL_BORROW_ADJUST_COLLATERAL')}
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
              isCollateral={true}
              status={status}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
