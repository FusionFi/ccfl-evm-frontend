import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import cssClass from './borrow-fiat-method.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal, Form, Select, Checkbox, Input, Radio, Button } from 'antd';
import type { SelectProps, CheckboxProps, FormProps } from 'antd';
import { RightOutlined } from '@ant-design/icons';

type FieldType = {
  amount?: any;
};

type LabelRender = SelectProps['labelRender'];

export default function ModalBorrowFiatMethodComponent({
  next,
}: any) {
  const { t } = useTranslation('common');
  const [payoutMethod, setPayoutMethod] = useState(1)
  const [repaymentCurrency, setRepaymentCurrency] = useState(1)
  const [_isPending, _setIsPending] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const CountryMap = new Map(
    [
      {
        value: 'USA',
        label: 'USA',
        logo: '/images/country/usa.png',
      },
      {
        value: 'Singapore',
        label: 'Singapore',
        logo: '/images/country/singapore.png',
      },
    ].map(item => [item.value, item]),
  );

  const SelectLableCountry: LabelRender = (props: any) => {
    let { value } = props;

    const _country: any = CountryMap.get(value) || CountryMap.get('USA');

    return (
      <div className="flex items-center">
        <Image
          src={_country?.logo}
          alt={_country?.label}
          width={16}
          height={16}
          style={{
            height: 16,
            width: 16,
          }}
          className="mr-2"
        />
        {_country.label}
      </div>
    );
  };

  const handlePayoutMethodSelect = (e: any) => {
    setPayoutMethod(e.target.value)
  }

  const handleRepaymentCurrencySelect = (e: any) => {
    setRepaymentCurrency(e.target.value)
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      console.log('data: ', data)
      next({
        ...data,
        paymentMethod: payoutMethod
      });
      _setIsPending(false)
    }, 1000);
  };

  return (
    <Form onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        return (
          <div className={cssClass['borrow-fiat-method-wrapper']}>
            <div className={'borrow-fiat-method-container'}>
              <div className="borrow-fiat-method-container__loan">
                <span className="borrow-fiat-method-container__loan__title">Setup Loan</span>
                <div className="borrow-fiat-method-container__loan__body">
                  <div className="borrow-fiat-method-container__loan__body__country">
                    Choose country
                    <Select
                      popupClassName={cssClass['borrow-fiat-method-country']}
                      labelRender={SelectLableCountry}
                      defaultValue={{
                        value: 'USA',
                      }}
                      options={[...(CountryMap.values() as any)].map(item => ({
                        value: item.value,
                      }))}
                      optionRender={(option: any) => {
                        const _country: any = CountryMap.get(option.value);
                        return (
                          <div className="borrow-fiat-method-country__option">
                            <Image
                              src={_country?.logo}
                              alt={_country?.label}
                              width={12}
                              height={12}
                              style={{
                                height: 12,
                                width: 12,
                              }}
                              className="mr-2"
                            />
                            {_country?.label}
                          </div>
                        );
                      }}
                    />
                  </div>
                  <div className="borrow-fiat-method-container__loan__body__currency">
                    Currency
                    <span className="borrow-fiat-method-container__loan__body__currency__value">USD</span>
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-method-container__payout">
                <div className='borrow-fiat-method-container__payout__title'>
                  <div>Select Payout Method</div>
                </div>
                <Radio.Group onChange={handlePayoutMethodSelect} value={payoutMethod}>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio value={1}>
                      Bank Wire
                    </Radio>
                  </div >
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio value={2}>Gift Code</Radio>
                  </div>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio disabled={true} value={3}>
                      Mobile Wallet
                    </Radio>
                    <div className='borrow-fiat-method-container__payout__method__msg'>Not available </div>
                  </div>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio disabled={true} value={4}>Mobile Top-Up</Radio>
                    <div className='borrow-fiat-method-container__payout__method__msg'>Not available </div>
                  </div>
                </Radio.Group>
              </div>
              <div className='borrow-fiat-method-container__email'>
                <div className='borrow-fiat-method-container__email__control'>
                  <Checkbox onChange={handleReceiveEmailCheck}>Receive email for transaction update</Checkbox>
                </div>
                <div className='borrow-fiat-method-container__email__input'>
                  Recipient email
                  <Input placeholder="mail@mail.com" />
                </div>
              </div>
              <div className='borrow-fiat-method-container__repayment'>
                <div className='borrow-fiat-method-container__repayment__title'>
                  Repayment Currency
                </div>
                <Radio.Group onChange={handleRepaymentCurrencySelect} value={repaymentCurrency}>
                  <Radio value={1}>USDT (Avalanche)</Radio>
                  <Radio value={2}>USDC (Avalanche)</Radio>
                </Radio.Group>
              </div>
              <div className='borrow-fiat-method-container__action'>
                <Button
                  loading={_isPending}
                  type="primary"
                  htmlType='submit'
                  disabled={isNotValidForm}
                  className={twMerge('btn-primary-custom')}
                  block>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )
      }}
    </Form >
  );
}
