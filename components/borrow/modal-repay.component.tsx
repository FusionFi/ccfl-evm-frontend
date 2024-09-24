import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import ModalComponent from '@/components/common/modal.component';
import { WalletIcon } from '@/components/icons/wallet.icon';
import { TRANSACTION_STATUS } from '@/constants/common.constant';
import {
  ArrowRightOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
  step: any;
  setStep: any;
  isFiat?: boolean;
}

interface IFormInput {
  numberfield: number;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  currentToken,
  step,
  setStep,
  isFiat,
}: ModalBorrowProps) {
  const { t } = useTranslation('common');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      numberfield: 0,
    },
  });

  const [tokenValue, setTokenValue] = useState();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step == 1) {
        setTokenValue(0);
      }
      setStep(step + 1);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);

  const status = 'SUCCESS';
  const renderTitle = () => {
    if (step === 2) {
      if (status === TRANSACTION_STATUS.FAILED) {
        return `${t('BORROW_MODAL_FAILED')}`;
      }
      return `${t('BORROW_MODAL_BORROW_ALL_DONE')}`;
    }
    return `${t('BORROW_MODAL_BORROW_REPAY')} ${currentToken?.toUpperCase()}`;
  };

  useEffect(() => {
    if (isModalOpen) {
      setTokenValue(undefined);
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
                <div className="modal-borrow-title mb-2 flex items-center">
                  {t('BORROW_MODAL_REPAY_AMOUNT')}
                  <div className="wallet-balance">
                    <WalletIcon className="mr-2" /> <span>{t('FORM_BALANCE')}: </span> 50.000{' '}
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
                    <span className="modal-borrow-usd">≈ $0.00</span>
                    <Button disabled={loading} className="modal-borrow-max">
                      {t('BORROW_MODAL_BORROW_MAX')}
                    </Button>
                    {errors.numberfield && <div>{errors.numberfield.message}</div>}
                  </div>
                </div>
                <div className="modal-borrow-balance">
                  <span>
                    {t('FORM_MINIMUM_AMOUNT')}: 0.562 {currentToken?.toUpperCase()}
                  </span>
                  {/* <span className="insufficient">{t('BORROW_MODAL_INSUFFICIENT_BALANCE')}</span> */}
                </div>
              </div>
              {/* <div className="modal-borrow-overview">
                <div className="modal-borrow-sub-title">Loan overview</div>
                <div className="flex justify-between items-center">
                  <span className="modal-borrow-sub-content">
                    Variable APR
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
              </div> */}
              <div className="modal-borrow-overview">
                <div className="modal-borrow-sub-title">{t('BORROW_MODAL_REPAY_OVERVIEW')}</div>
                <div className="flex justify-between items-center mb-2">
                  <div className="modal-borrow-sub-content">
                    {t('BORROW_MODAL_BORROW_REMAINING')}
                  </div>
                  <div className="flex">
                    <div className="modal-borrow-repay">
                      <span>5,000.00</span>
                      <span className="ml-1">{isFiat ? 'USD' : currentToken?.toUpperCase()}</span>
                    </div>
                    {tokenValue > 0 && (
                      <div className="modal-borrow-repay remain">
                        <ArrowRightOutlined className="mx-1" />
                        <span>4,999.00</span>
                        <span className="ml-1">{isFiat ? 'USD' : currentToken?.toUpperCase()}</span>
                      </div>
                    )}
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
                        currentToken: currentToken?.toUpperCase(),
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
                        {t('BORROW_MODAL_BORROW_PAY', {
                          currentToken: currentToken?.toUpperCase(),
                        })}
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
              isRepay={true}
              status={status}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
