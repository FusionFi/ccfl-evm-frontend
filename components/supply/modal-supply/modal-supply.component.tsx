import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import cssClass from './modal-supply.component.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal, Form } from 'antd';
import type { FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';

type FieldType = {
  amount?: any;
};

export default function ModalSupplyComponent({
  isModalOpen,
  handleCancel,
  handleOk
}: any) {
  const { t } = useTranslation('common');

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);

  const handleApprove = useCallback(() => {
    _setIsApproved(true);
  }, []);

  const _handleOk = useCallback(() => {
    _setIsApproved(false)
    handleOk();
  }, [])

  const _handleCancel = useCallback(() => {
    _setIsApproved(false)
    _setIsPending(false)
    handleCancel();
  }, [])

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      if (_isApproved) {
        _handleOk();
      } else {
        handleApprove();
      }
      _setIsPending(false)
    }, 1000);
  };

  return (
    <Modal
      wrapClassName={cssClass['supply-modal-wrapper']}
      title={t('SUPPLY_MODAL_TITLE', {
        token: 'USDT',
      })}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <Form onFinish={onFinish}>
        {(_, formInstance) => {
          const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
          const amount = formInstance.getFieldValue('amount')
          console.log('amount: ', amount)
          return (
            <div className="supply-modal-container">
              <div className="supply-modal-container__input">
                <div className="supply-modal-container__input__title">
                  {t('SUPPLY_MODAL_INPUT_AMOUNT')}
                </div>
                <div className="supply-modal-container__input__control">
                  <Form.Item name="amount" help="" style={{
                    width: '100%'
                  }} rules={[{ max: 10, type: 'number', message: t('SUPPLY_MODAL_VALIDATE_INSUFFICIENT_BALANCE') }, {
                    required: true,
                    message: t('SUPPLY_MODAL_VALIDATE_REQUIRE_AMOUNT')
                  }]}>
                    <InputNumber
                      placeholder={t('SUPPLY_MODAL_INPUT_PLACEHOLDER')}
                      className="supply-modal-container__input__control__amount"
                      controls={false}
                      addonAfter={
                        <div className="supply-modal-container__input__control__amount__token">
                          <Image
                            src={`/images/tokens/usdt.png`}
                            alt="USDT"
                            width={24}
                            height={24}
                            style={{
                              height: 24,
                            }}
                          />
                          USDT
                        </div>
                      }
                    />
                  </Form.Item>

                  <div className="supply-modal-container__input__control__price">
                    ≈ $4,000.00
                    <Button type="link" className="supply-modal-container__input__control__price__max">
                      {t('SUPPLY_MODAL_MAX')}
                    </Button>

                  </div>

                </div>
                <div className='flex justify-between w-full'>
                  <div className="supply-modal-container__input__balance">
                    {t('SUPPLY_MODAL_WALLET_BALANCE')}: 50,000.00 USDT
                  </div>
                  <span className="supply-modal-container__input__error">{formInstance.getFieldError('amount')[0]}</span>
                </div>

              </div>
              <div className="supply-modal-container__overview">
                <div className="supply-modal-container__overview__title">
                  {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_TITLE')}
                </div>
                <div className="supply-modal-container__overview__apy">
                  <div className="supply-modal-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_APY')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="supply-modal-container__overview__apy__value">
                    &#60;
                    <span className="text-white font-bold">0.01</span>%
                  </span>
                </div>
              </div>
              <div className="supply-modal-container__overview">
                <div className="supply-modal-container__overview__apy">
                  <div className="supply-modal-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_GAS_FEE')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="supply-modal-container__overview__apy__value text-sm">
                    $<span className="text-white">0.02</span>
                  </span>
                </div>
              </div>
              <div className="supply-modal-container__action">
                {_isApproved ? (
                  <Button
                    type="primary"
                    loading={_isPending}
                    disabled={isNotValidForm}
                    htmlType='submit'
                    className={twMerge('btn-primary-custom')}
                    block>
                    {t('SUPPLY_MODAL_SUPPLY_BUTTON', {
                      token: 'USDT',
                    })}
                  </Button>
                ) : (
                  <div className="supply-modal-container__action__approve">
                    <div className="supply-modal-container__action__approve__helper">
                      <QuestionCircleIcon />
                      <Link
                        className="supply-modal-container__action__approve__helper__link"
                        href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                        target="_blank">
                        {t('SUPPLY_MODAL_APPROVE_EXPLAIN')}
                      </Link>
                    </div>

                    <Button
                      loading={_isPending}
                      type="primary"
                      htmlType='submit'
                      disabled={isNotValidForm || !amount}
                      className={twMerge('btn-primary-custom', 'mt-4')}
                      block>
                      {t('SUPPLY_MODAL_APPROVE', {
                        token: 'USDT',
                      })}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Form>
    </Modal>
  );
}
