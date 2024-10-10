import Image from 'next/image';
import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { TRANSACTION_STATUS, TX_LINK } from '@/constants/common.constant';
import React, { useMemo } from 'react';
import { useNetworkManager } from '@/hooks/supply.hook';
import { useConnectedNetworkManager } from '@/hooks/auth.hook';
import { formatNumber } from '@/utils/common';

interface TransactionSuccessProps {
  handleCancel: any;
  currentToken?: string;
  isRepay?: boolean;
  token?: string;
  setStep: any;
  isBorrow?: boolean;
  isCollateral?: boolean;
  status?: string;
  isWithdrawCollateral?: boolean;
  stableCoinAmount?: any;
  collateralAmount?: any;
  txLink?: any;
  errorTx?: any;
  handleLoans?: any;
}

export default function TransactionSuccessComponent({
  handleCancel,
  currentToken,
  isRepay = false,
  token,
  setStep,
  isCollateral = false,
  isBorrow = false,
  status = TRANSACTION_STATUS.FAILED,
  isWithdrawCollateral = false,
  stableCoinAmount,
  collateralAmount,
  txLink,
  errorTx,
  handleLoans,
}: TransactionSuccessProps) {
  const { t } = useTranslation('common');
  const [networks] = useNetworkManager();
  const { selectedChain } = useConnectedNetworkManager();

  const selectedNetwork = useMemo(() => {
    return networks?.get(selectedChain?.id) || {};
  }, [networks, selectedChain]);

  const handleFinish = () => {
    setStep(0);
    handleCancel();
    if (status === TRANSACTION_STATUS.SUCCESS && handleLoans) {
      handleLoans();
    }
  };

  return (
    <div>
      <div className="modal-borrow-success">
        <div className="img-wrapper">
          <Image
            src={`/images/common/${
              status === TRANSACTION_STATUS.SUCCESS ? 'success' : 'failed'
            }.png`}
            alt="success"
            width={80}
            height={80}
          />
        </div>
        <div className={`divider-bot content px-4 py-4 ${isRepay ? 'repay' : ''}`}>
          {status === TRANSACTION_STATUS.FAILED ? (
            <div>
              <div>
                {t('BORROW_MODAL_ERROR_CODE')}: {errorTx?.code}
              </div>
              <div>{errorTx?.message}</div>
            </div>
          ) : (
            <React.Fragment>
              {isRepay && (
                <span>
                  {t('BORROW_MODAL_SUCCESS_REPAY_TOKEN')} {formatNumber(stableCoinAmount)}{' '}
                  {currentToken?.toUpperCase()}
                </span>
              )}
              {isBorrow && (
                <span>
                  {t('BORROW_MODAL_SUCCESS_BORROW_TOKEN')} {formatNumber(stableCoinAmount)}{' '}
                  {currentToken?.toUpperCase()}
                </span>
              )}
              {isCollateral && (
                <span>
                  {t('BORROW_MODAL_COLLATERAL_DONE', {
                    amount: formatNumber(stableCoinAmount),
                    token: currentToken?.toUpperCase(),
                  })}
                </span>
              )}
              {isWithdrawCollateral && (
                <span>
                  {t('BORROW_MODAL_WITHDRAW_DONE')} {formatNumber(stableCoinAmount)}{' '}
                  {currentToken?.toUpperCase()}
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        {isBorrow && status === TRANSACTION_STATUS.SUCCESS && (
          <div className="coin">
            <Image
              className="mr-2"
              src={`/images/common/${token}.png`}
              alt="weth"
              width={24}
              height={24}
            />
            <span className="content">
              {t('BORROW_MODAL_SUCCESS_BORROW_DEPOSIT')} {collateralAmount} {token?.toUpperCase()}
            </span>
          </div>
        )}
        {/* {isBorrow && (
          <div className="tokens">
            <div className="mb-2">{t('BORROW_MODAL_SUCCESS_BORROW_RECEIVED')}</div>
            <div className="flex justify-between">
              <span className="lp">4,000 LP-{currentToken?.toUpperCase()}</span>
              <span className="metamask">{t('BORROW_MODAL_SUCCESS_BORROW_METAMASK')}</span>
            </div>
          </div>
        )} */}
        {txLink && (
          <Link
            href={
              selectedNetwork && selectedNetwork.txUrl
                ? `${selectedNetwork?.txUrl}tx/${txLink}`
                : `${TX_LINK}${txLink}`
            }
            className="tx"
            target="_blank">
            <ExportOutlined />
            {t('BORROW_MODAL_SUCCESS_BORROW_REVIEW')}
          </Link>
        )}
        <div className="px-6 py-4">
          <Button className="w-full" onClick={handleFinish}>
            {t('BORROW_MODAL_SUCCESS_BORROW_OK')}
          </Button>
        </div>
      </div>
    </div>
  );
}
