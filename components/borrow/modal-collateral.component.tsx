import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import ModalComponent from '@/components/common/modal.component';
import { WalletIcon } from '@/components/icons/wallet.icon';
import {
  ACTION_TYPE,
  CONTRACT_ADDRESS,
  MIN_AMOUNT_KEY,
  TRANSACTION_STATUS,
} from '@/constants/common.constant';
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
import service from '@/utils/backend/borrow';
import { toAmountShow, toLessPart, toUnitWithDecimal } from '@/utils/common';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import {
  useApprovalBorrow,
  useAddCollateral,
  useGetGasFeeApprove,
  useGetHealthFactor,
  useAllowanceBorrow,
} from '@/hooks/provider.hook';
import { useNetworkManager } from '@/hooks/borrow.hook';
import BigNumber from 'bignumber.js';

interface ModalCollateralProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  loanItem: any;
  handleLoans?: any;
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
  handleLoans,
}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const { connector } = useAccount();
  const [provider] = useProviderManager();
  const { selectedChain } = useConnectedNetworkManager();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      numberfield: 0,
    },
  });

  const [tokenValue, setTokenValue] = useState();
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);
  const [minimum, setMinimum] = useState(undefined);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [stableCoinData, setStableCoinData] = useState({
    balance: 0,
    address: undefined,
  }) as any;
  const [healthFactor, setHealthFactor] = useState(0) as any;
  const [loadingHealthFactor, setLoadingHealthFactor] = useState<boolean>(false);
  const [loadingGasFee, setLoadingGasFee] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState(0);
  const [errorEstimate, setErrorEstimate] = useState({
    nonEnoughBalanceWallet: false,
    exceedsAllowance: false,
  }) as any;
  const [status, setStatus] = useState(TRANSACTION_STATUS.SUCCESS);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorTx, setErrorTx] = useState() as any;
  const [txHash, setTxHash] = useState();
  const [allowanceNumber, setAllowanceNumber] = useState(0) as any;

  //start hook
  const [approveBorrow] = useApprovalBorrow(provider);
  const [getHealthFactor] = useGetHealthFactor(provider);
  const [getGasFeeApprove] = useGetGasFeeApprove(provider);
  const [allowanceBorrow] = useAllowanceBorrow(provider);
  const [addCollateral] = useAddCollateral(provider);

  //end hook

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const connector_provider = await connector?.getProvider();
    if (step === 0) {
      try {
        setLoading(true);
        let tx = await approveBorrow({
          provider: connector_provider,
          contract_address: CONTRACT_ADDRESS,
          amount: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
          address: provider?.account,
          tokenContract: stableCoinData.address,
        });
        if (tx?.link) {
          setStep(1);
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
    }
    if (step == 1) {
      try {
        setLoading(true);
        let tx = await addCollateral({
          amountCollateral: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
          collateral: stableCoinData.address,
          provider: connector_provider,
          account: provider?.account,
          contract_address: CONTRACT_ADDRESS,
          loanId: loanItem.loan_id,
          isGas: false,
        });
        if (tx?.link) {
          setStep(2);
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
    }
  };

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
      let res_info = (await service.getTokenInfo(currentToken, selectedChain?.id)) as any;
      let res_balance = (await service.getCollateralBalance(
        provider?.account,
        selectedChain?.id,
        currentToken,
      )) as any;

      console.log('res_info', res_info, res_balance);
      let token = stableCoinData;
      if (res_balance) {
        token.balance = res_balance.balance
          ? toLessPart(toAmountShow(res_balance.balance, res_balance.decimals), 8)
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
    if (loanItem.collateral_price) {
      try {
        setLoadingMinimum(true);
        let res = (await service.getSetting(MIN_AMOUNT_KEY.MIN_AMOUNT_ADD_COLLATERAL)) as any;

        if (res && res[0]?.value) {
          setMinimum(toLessPart(res[0]?.value / loanItem.collateral_price, 5));
        } else {
          setMinimum(undefined);
        }
        setLoadingMinimum(false);
      } catch (error) {
        setLoadingMinimum(false);
      }
    }
  };

  const resetState = () => {
    setLoading(false);
    setHealthFactor(undefined);
    setStatus(TRANSACTION_STATUS.SUCCESS);
    setGasFee(0);
    setErrorTx(undefined);
    setTxHash(undefined);
    setErrorEstimate({
      nonEnoughBalanceWallet: false,
      exceedsAllowance: false,
    });
    setTokenValue(undefined);
  };

  const handleGetHealthFactor = async () => {
    if (tokenValue && tokenValue > 0 && loanItem.collateral_decimals && loanItem.loan_id) {
      const connector_provider = await connector?.getProvider();

      try {
        setLoadingHealthFactor(true);
        let healthFactor = (await getHealthFactor({
          type: ACTION_TYPE.COLLATERAL,
          provider: connector_provider,
          contract_address: CONTRACT_ADDRESS,
          amount: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
          loanId: loanItem.loan_id,
        })) as any;
        console.log('healthFactor', healthFactor);
        if (healthFactor) {
          setHealthFactor(healthFactor);
        }
        setLoadingHealthFactor(false);
      } catch (error) {
        setLoadingHealthFactor(false);
        console.log('getHealthFactor error', error);
      }
    } else {
      setHealthFactor(undefined);
    }
  };

  const handleGetGasFeeApprove = async () => {
    setTimeout(async () => {
      if (step === 0) {
        if (
          tokenValue &&
          tokenValue > 0 &&
          loanItem.collateral_decimals &&
          stableCoinData.address &&
          !!(allowanceNumber == 0 || allowanceNumber < tokenValue)
        ) {
          const connector_provider = await connector?.getProvider();
          try {
            setLoadingGasFee(true);
            let res = (await getGasFeeApprove({
              provider: connector_provider,
              account: provider?.account,
              amount: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
              tokenAddress: stableCoinData.address,
              contract_address: CONTRACT_ADDRESS,
            })) as any;
            let res_price = (await service.getPrice(selectedChain?.id, 'ETH')) as any;

            console.log('gasFee approve', res, res_price);
            if (res && res.gasPrice && res_price && res_price.price) {
              let gasFee = res.gasPrice * res_price.price;
              setGasFee(gasFee);
            }

            setErrorEstimate({
              nonEnoughBalanceWallet: res?.nonEnoughMoney,
              exceedsAllowance: res?.exceedsAllowance,
            });
            setLoadingGasFee(false);
          } catch (error) {
            setLoadingGasFee(false);
            console.log('getGasFeeApprove error', error);
          }
        } else {
          // setGasFee(0);
        }
      }
    }, 500);
  };

  const getGasFeeCollateral = async () => {
    setTimeout(async () => {
      if (step === 1) {
        if (
          tokenValue &&
          tokenValue > 0 &&
          stableCoinData.address &&
          loanItem.collateral_decimals &&
          loanItem.loan_id &&
          allowanceNumber &&
          allowanceNumber >= tokenValue
        ) {
          const connector_provider = await connector?.getProvider();
          try {
            setLoadingGasFee(true);
            let res = (await addCollateral({
              provider: connector_provider,
              account: provider?.account,
              contract_address: CONTRACT_ADDRESS,
              amountCollateral: toUnitWithDecimal(tokenValue, loanItem.collateral_decimals),
              collateral: stableCoinData.address,
              loanId: loanItem.loan_id,
              isGas: true,
            })) as any;
            let res_price = (await service.getPrice(selectedChain?.id, 'ETH')) as any;
            console.log('getGasFeeCollateral res', res);
            if (res && res.gasPrice && res_price && res_price.price) {
              let gasFee = res.gasPrice * res_price.price;
              setGasFee(gasFee);
            }

            setErrorEstimate({
              nonEnoughBalanceWallet: res?.nonEnoughMoney,
              exceedsAllowance: res?.exceedsAllowance,
            });
            setLoadingGasFee(false);
          } catch (error: any) {
            setLoadingGasFee(false);
          }
        } else {
          // setGasFee(0);
        }
      }
    }, 500);
  };

  const handleCheckAllowance = async () => {
    if (
      tokenValue &&
      tokenValue > 0 &&
      provider?.account &&
      stableCoinData?.address &&
      loanItem?.collateral_decimals
    ) {
      const connector_provider = await connector?.getProvider();
      try {
        // let res_pool = (await service.getPoolAddress(selectedChain?.id, currentToken)) as any;

        console.log('handleCheckAllowance', tokenValue, provider?.account, stableCoinData.address);

        let res = (await allowanceBorrow({
          provider: connector_provider,
          tokenAddress: stableCoinData.address,
          account: provider?.account,
          spender: CONTRACT_ADDRESS,
        })) as any;

        console.log('allowance', res, toAmountShow(res, loanItem.collateral_decimals));

        const isNotNeedToApprove = new BigNumber(
          toAmountShow(res, loanItem.collateral_decimals),
        ).isGreaterThanOrEqualTo(tokenValue);

        console.log(
          'allowance collateral',
          res,
          toAmountShow(res, loanItem.collateral_decimals),
          tokenValue,
          isNotNeedToApprove,
        );

        setAllowanceNumber(toAmountShow(res, loanItem.collateral_decimals));
        if (isNotNeedToApprove) {
          setStep(1);
        } else {
          setStep(0);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
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
      handleCheckAllowance();
    }
  }, [tokenValue, step]);

  useEffect(() => {
    if (isModalOpen) {
      handleGetHealthFactor();
      handleGetGasFeeApprove();
      getGasFeeCollateral();
    }
  }, [tokenValue]);

  useEffect(() => {
    if (isModalOpen) {
      getGasFeeCollateral();
      handleGetGasFeeApprove();
    }
  }, [step]);

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
                        ? toLessPart(tokenValue * collateralData?.price, 2, true)
                        : 0}
                    </span>
                    <Button
                      disabled={loading}
                      className="modal-borrow-max"
                      onClick={() => setTokenValue(stableCoinData.balance)}>
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button>
                  </div>
                </div>
                <div className="modal-borrow-balance">
                  {minimum !== 0 && (
                    <span>
                      {t('FORM_MINIMUM_AMOUNT')}:{' '}
                      {loadingMinimum ? <LoadingOutlined className="mr-1" /> : minimum}{' '}
                      {currentToken?.toUpperCase()}
                    </span>
                  )}
                  {tokenValue && !(stableCoinData.balance - tokenValue >= 0) && (
                    <span className="insufficient">{t('BORROW_MODAL_INSUFFICIENT_BALANCE')}</span>
                  )}{' '}
                </div>
              </div>
              {errorEstimate.nonEnoughBalanceWallet && (
                <div className="modal-borrow-error">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_NON_ENOUGH_GAS')}
                </div>
              )}
              {errorEstimate.exceedsAllowance && step === 1 && (
                <div className="modal-borrow-error">
                  {t('BORROW_MODAL_BORROW_COLLATERAL_EXCEEDS_ALLOWANCE')}
                </div>
              )}
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
                      <span>
                        $
                        {tokenValue && tokenValue > 0
                          ? toLessPart(
                              parseFloat(tokenValue + collateralData.amount) * collateralData.price,
                              2,
                            )
                          : toLessPart(collateralData.amount * collateralData.price, 2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center modal-borrow-health">
                  <div className="modal-borrow-sub-content">{t('BORROW_MODAL_BORROW_HEALTH')}</div>
                  <div className="flex">
                    <span>{loanItem ? loanItem.health : 0}</span>
                    {tokenValue && tokenValue > 0 && (
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
                  <span>$ </span>
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
                        !tokenValue ||
                        loading ||
                        loadingBalance ||
                        loadingGasFee ||
                        loadingHealthFactor ||
                        loadingMinimum ||
                        stableCoinData.balance === 0 ||
                        errorEstimate.nonEnoughBalanceWallet ||
                        (errorEstimate.exceedsAllowance && step === 1) ||
                        (minimum && tokenValue < minimum) ||
                        !stableCoinData.address ||
                        (tokenValue && !(stableCoinData.balance - tokenValue >= 0))
                      }
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
                        disabled={
                          !tokenValue ||
                          loading ||
                          loadingBalance ||
                          loadingGasFee ||
                          loadingHealthFactor ||
                          loadingMinimum ||
                          stableCoinData.balance === 0 ||
                          errorEstimate.nonEnoughBalanceWallet ||
                          (errorEstimate.exceedsAllowance && step === 1) ||
                          (minimum && tokenValue < minimum) ||
                          !stableCoinData.address ||
                          (tokenValue && !(stableCoinData.balance - tokenValue >= 0))
                        }
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
              errorTx={errorTx}
              handleLoans={handleLoans}
              txLink={txHash}
              stableCoinAmount={tokenValue}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
