import React, { useState } from 'react';
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
  ArrowRightOutlined,
} from '@ant-design/icons';
import { COLLATERAL_TOKEN } from '@/constants/common.constant';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';
import { useTranslation } from 'next-i18next';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
}

interface IFormInput {
  numberfield: number;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  currentToken,
}: ModalBorrowProps) {
  const { t } = useTranslation('common');

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      numberfield: 0,
    },
  });

  const [tokenValue, setTokenValue] = useState(0);

  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data);
  };

  const [token, setToken] = useState(COLLATERAL_TOKEN[0].name);
  const [loading, setLoading] = useState<boolean>(false);
  const [isYield, setYield] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (value: any) => {
    setToken(value);
  };

  const handleYield = (e: any) => {
    setYield(e.target.checked);
  };

  const renderTitle = () => {
    if (step === 2) {
      return 'All done!';
    }
    return `Repay ${currentToken?.toUpperCase()}`;
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
                <div className="modal-borrow-title mb-2 ">{t('BORROW_MODAL_REPAY_AMOUNT')}</div>
                <div className={`modal-borrow-amount ${loading ? 'loading' : ''}`}>
                  <div className="flex items-center">
                    <Controller
                      name="numberfield"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          placeholder="Enter amount"
                          className="flex-1"
                          controls={false}
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
                    <span className="modal-borrow-max ">{t('BORROW_MODAL_BORROW_MAX')}</span>
                  </div>
                </div>
                <div className="modal-borrow-balance">
                  {t('BORROW_MODAL_BORROW_WALLET_BALANCE')}: 50,000.00 {currentToken?.toUpperCase()}
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
                      <span>5,000.00 </span>
                      <span className="ml-1">{currentToken.toUpperCase()}</span>
                    </div>
                    {tokenValue > 0 && (
                      <div className="modal-borrow-repay remain">
                        <ArrowRightOutlined className="mx-1" />
                        <span>4,999.00</span>
                        <span className="ml-1">{currentToken.toUpperCase()}</span>
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
                  {t('BORROW_MODAL_BORROW_HEALTH')}
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
                      disabled={false}
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
                    {/* <div className="modal-borrow-yield">
                      <Checkbox onChange={handleYield}>Use my deposit for yield earning </Checkbox>
                    </div> */}
                    <div className="px-6 py-4">
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={false}
                        className="w-full"
                        loading={loading}>
                        {t('BORROW_MODAL_BORROW_PAY', { currentToken: currentToken.toUpperCase() })}
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
              isRepay={true}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
