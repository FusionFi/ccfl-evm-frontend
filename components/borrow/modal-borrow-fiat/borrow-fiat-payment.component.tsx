import React, { useState } from 'react';
import cssClass from './borrow-fiat-payment.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Radio, Button } from 'antd';
import type { SelectProps, CheckboxProps, FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';

type FieldType = {
  amount?: any;
};

type LabelRender = SelectProps['labelRender'];

export default function ModalBorrowFiatPaymentComponent({
  next,
  back
}: any) {
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      next();
      _setIsPending(false)
    }, 1000);
  };

  const IncomeMap = new Map(
    [
      {
        value: 'Salary',
        name: 'Salary',
      },
    ].map(item => [item.value, item]),
  );

  const PurposeMap = new Map(
    [
      {
        value: 'Gift',
        name: 'Gift',
      },
    ].map(item => [item.value, item]),
  );
  const BankMap = new Map(
    [
      {
        value: 'Citibank',
        name: 'Citibank',
      },
    ].map(item => [item.value, item]),
  );

  return (
    <Form onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        return (
          <div className={cssClass['borrow-fiat-payment-wrapper']}>
            <div className={'borrow-fiat-payment-container'}>
              <div className="borrow-fiat-payment-container__input">
                <div className="borrow-fiat-payment-container__input__title">
                  Borrow Amount
                </div>
                <div className="borrow-fiat-payment-container__input__control">
                  <Form.Item name="amount" help="" rules={[{ max: 10, type: 'number', message: t('SUPPLY_MODAL_VALIDATE_INSUFFICIENT_BALANCE') }, {
                    required: true,
                    message: t('SUPPLY_MODAL_VALIDATE_REQUIRE_AMOUNT')
                  }]}>
                    <InputNumber controls={false} placeholder="Enter Amount" suffix="USD" className="borrow-fiat-payment-container__input__control__amount" />
                  </Form.Item>
                </div>
              </div>
              <div className="borrow-fiat-payment-container__detail">
                <div className='borrow-fiat-payment-container__detail__title'>
                  Payout detail
                </div>
                <div className='borrow-fiat-payment-container__detail__content'>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Choose bank:
                    <Select placeholder="Select" className='borrow-fiat-payment-container__detail__content__item__control-select'
                      popupClassName={cssClass['borrow-fiat-payment-select']}
                      options={[...(BankMap.values() as any)].map(item => ({
                        value: item.value,
                        lable: item.name
                      }))}
                    />
                  </div>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Account Number:
                    <Input placeholder="Enter account number" className='borrow-fiat-payment-container__detail__content__item__control-input' />
                  </div>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Account owner:
                    <Input placeholder="Enter owner name" className='borrow-fiat-payment-container__detail__content__item__control-input' />
                  </div>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Purpose of Payment:
                    <Select placeholder="Select" className='borrow-fiat-payment-container__detail__content__item__control-select'
                      popupClassName={cssClass['borrow-fiat-payment-select']}
                      options={[...(PurposeMap.values() as any)].map(item => ({
                        value: item.value,
                        lable: item.name
                      }))}
                    />
                  </div>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Source of Income:
                    <Select placeholder="Select" className='borrow-fiat-payment-container__detail__content__item__control-select'
                      popupClassName={cssClass['borrow-fiat-payment-select']}
                      options={[...(IncomeMap.values() as any)].map(item => ({
                        value: item.value,
                        lable: item.name
                      }))}
                    />
                  </div>
                  <div className='borrow-fiat-payment-container__detail__content__item'>
                    Description:
                    <Input placeholder="Enter description" className='borrow-fiat-payment-container__detail__content__item__control-input' />
                  </div>
                </div>
              </div>

              <div className='borrow-fiat-payment-container__transaction'>
                <div className='borrow-fiat-payment-container__transaction__title'>
                  FIAT transaction fee (4%
                  <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                    <span className="cursor-pointer">
                      <InfoCircleIcon className="" />
                    </span>
                  </Tooltip>
                </div>

                <div className='borrow-fiat-payment-container__transaction__value'>
                  <span className='borrow-fiat-payment-container__transaction__value__uint'>$</span>
                  520.00
                </div>
              </div>

              <div className='borrow-fiat-payment-container__term-condition'>
                <Checkbox onChange={handleReceiveEmailCheck}>I agree with Terms & Conditions</Checkbox>
              </div>
              <div className='borrow-fiat-payment-container__action'>
                <div className='borrow-fiat-payment-container__action__item'>
                  <Button
                    loading={_isPending}
                    disabled={isNotValidForm}
                    onClick={back}
                    className={twMerge('btn-outline-custom')}
                    style={{
                      borderColor: "#434343",
                      background: '#141414',
                      color: "rgba(255, 255, 255, 0.85)"
                    }}
                  >
                    Back
                  </Button>
                </div>
                <div className='borrow-fiat-payment-container__action__item'>
                  <Button
                    loading={_isPending}
                    type="primary"
                    htmlType='submit'
                    disabled={isNotValidForm}
                    className={twMerge('btn-primary-custom')}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </Form >
  );
}
