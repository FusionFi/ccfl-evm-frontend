import React, { useState } from 'react';
import cssClass from './borrow-fiat-collateral.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Button } from 'antd';
import type { CheckboxProps, FormProps } from 'antd';
import { WalletOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';

type FieldType = {
  amount?: any;
};

export default function ModalBorrowFiatCollateralComponent({
  next,
  back
}: any) {
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const [form] = Form.useForm()

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
  const TokenMap = new Map(
    [
      {
        value: 'WETH',
        name: 'WETH',
      },
    ].map(item => [item.value, item]),
  );

  return (
    <Form form={form} onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        const amount = formInstance.getFieldValue('amount')
        console.log('collateral amount: ', amount)

        return (
          <div className={cssClass['borrow-fiat-collateral-wrapper']}>
            <div className={'borrow-fiat-collateral-container'}>
              <div className='borrow-fiat-collateral-container__loan'>
                <div className='borrow-fiat-collateral-container__loan__item'>
                  <div className='borrow-fiat-collateral-container__loan__item__title'>
                    Loan amount
                  </div>

                  <div className='borrow-fiat-collateral-container__loan__item__value'>
                    13,000
                    <span className='borrow-fiat-collateral-container__loan__item__value__unit'>USD</span>
                    <span className='borrow-fiat-collateral-container__loan__item__value__price'>$13,000.12</span>
                  </div>
                </div>
                <div className='borrow-fiat-collateral-container__loan__item'>
                  <div className='borrow-fiat-collateral-container__loan__item__title'>
                    FIAT transaction fee (4%
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>

                  <div className='borrow-fiat-collateral-container__loan__item__value'>
                    <span className='borrow-fiat-collateral-container__loan__item__value__unit'>$</span>
                    520.00
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-collateral-container__detail">
                <div className='borrow-fiat-collateral-container__detail__title'>
                  Collateral Setup
                </div>
                <div className='borrow-fiat-collateral-container__detail__content'>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    <div className='borrow-fiat-collateral-container__detail__content__item__title'>
                      Collateral token
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    <Select placeholder="Select" className='borrow-fiat-collateral-container__detail__content__item__control-select'
                      popupClassName={cssClass['borrow-fiat-collateral-select']}
                      options={[...(TokenMap.values() as any)].map(item => ({
                        value: item.value,
                        lable: item.name
                      }))}
                    />
                  </div>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    <div className='borrow-fiat-collateral-container__detail__content__item__title'>
                      <WalletOutlined style={{
                        fontSize: 16,
                        color: '#177DDC'
                      }} />  Collateral token
                    </div>
                    <div className='borrow-fiat-collateral-container__detail__content__item__value'>
                      7.87
                      <span className='borrow-fiat-collateral-container__detail__content__item__value__unit'>WETH</span>
                      <span className='borrow-fiat-collateral-container__detail__content__item__value__price'>$15,765.12</span>
                    </div>
                  </div>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    <div className="self-start">
                      Collateral amount
                    </div>
                    <div className='borrow-fiat-collateral-container__detail__content__item__value'>
                      <div className="borrow-fiat-collateral-container__detail__content__item__value__wrapper">
                        <Form.Item name="amount" help="">
                          <InputNumber controls={false} suffix="WETH" placeholder='Enter amount' className='borrow-fiat-collateral-container__detail__content__item__control-input' />
                        </Form.Item>
                        <div className='borrow-fiat-collateral-container__detail__content__item__value__note'>
                          Minimum amount: <span className='text-white'>1.7 WETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    Health factor
                    <div className='borrow-fiat-collateral-container__detail__content__item__value' style={{
                      alignItems: 'center'
                    }}>
                      <span className="font-bold text-base">
                        3.31B
                      </span>
                      <ArrowRightOutlined />
                      <span className="font-bold text-base" style={{
                        color: "#52C41A"
                      }}>3.33B</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='borrow-fiat-collateral-container__tx'>
                <div className='borrow-fiat-collateral-container__tx__item'>
                  <div className='borrow-fiat-collateral-container__tx__item__title'>
                    Gas fee
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className='borrow-fiat-collateral-container__tx__item__value'>
                    <span className="borrow-fiat-collateral-container__tx__item__value__unit">$</span>
                    2.00
                  </div>
                </div>
              </div>
              <div className='borrow-fiat-collateral-container__action'>
                <div className='borrow-fiat-collateral-container__action__item'>
                  <Button
                    disabled={isNotValidForm}
                    onClick={back}
                    className={twMerge('borrow-fiat-collateral-container__action__item__back')}
                    style={{
                      borderColor: "#434343",
                      background: '#141414',
                      color: "rgba(255, 255, 255, 0.85)"
                    }}
                  >
                    Back
                  </Button>
                </div>
                <div className='borrow-fiat-collateral-container__action__item'>
                  <Button
                    loading={_isPending}
                    type="primary"
                    htmlType='submit'
                    disabled={isNotValidForm}
                    className={twMerge('btn-primary-custom')}
                  >
                    Preview loan
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
