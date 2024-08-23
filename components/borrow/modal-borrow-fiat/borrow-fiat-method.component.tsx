import React, { useState } from 'react';
import cssClass from './borrow-fiat-method.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Form, Select, Checkbox, Input, Radio, Button } from 'antd';
import type { SelectProps, CheckboxProps, FormProps } from 'antd';

type FieldType = {
  amount?: any;
};

type LabelRender = SelectProps['labelRender'];

export default function ModalBorrowFiatMethodComponent({
  next,
}: any) {
  const { t } = useTranslation('common');
  const [payoutMethod, setPayoutMethod] = useState(0)
  const [repaymentCurrency, setRepaymentCurrency] = useState(0)
  const [country, setCountry] = useState("")
  const [_isPending, _setIsPending] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const CountryMap = new Map(
    [
      {
        value: 'USA',
        label: 'USA',
        currency: 'USD',
        logo: '/images/country/usa.png',
      },
      {
        value: 'Singapore',
        label: 'Singapore',
        currency: 'SGD',
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

  const handleCountryChange = (value: any) => {
    setCountry(value)
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      next({
        ...data,
        paymentMethod: payoutMethod
      });
      _setIsPending(false)
    }, 1000);
  };

  console.log('value: ', country)

  const currency = CountryMap.get(country)?.currency || '--'

  return (
    <Form onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        return (
          <div className={cssClass['borrow-fiat-method-wrapper']}>
            <div className={'borrow-fiat-method-container'}>
              <div className="borrow-fiat-method-container__loan">
                <span className="borrow-fiat-method-container__loan__title">{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_LOAN_TITLE')}</span>
                <div className="borrow-fiat-method-container__loan__body">
                  <div className="borrow-fiat-method-container__loan__body__country">
                    {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_LOAN_CHOOSE_COUNTRY')}
                    <Select
                      onChange={handleCountryChange}
                      popupClassName={cssClass['borrow-fiat-method-country']}
                      placeholder={t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_LOAN_CHOOSE_COUNTRY_PLACEHOLDER')}
                      labelRender={SelectLableCountry}
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
                    {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_LOAN_CURRENCY')}
                    <span className="borrow-fiat-method-container__loan__body__currency__value">{currency}</span>
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-method-container__payout">
                <div className='borrow-fiat-method-container__payout__title'>
                  <div>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_TITLE')}</div>
                </div>
                <Radio.Group onChange={handlePayoutMethodSelect} value={payoutMethod}>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio value={1} disabled={!country}>
                      {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_VALUE_BANK_WIRE')}
                    </Radio>
                  </div >
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio disabled={!country} value={2}>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_VALUE_GIFT_CODE')}</Radio>
                  </div>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio disabled={true} value={3}>
                      {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_VALUE_MOBILE_WALLET')}
                    </Radio>
                    {country && <div className='borrow-fiat-method-container__payout__method__msg'>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_MSG_NOT_AVAILABLE')}</div>}
                  </div>
                  <div className="borrow-fiat-method-container__payout__method__value">
                    <Radio disabled={true} value={4}>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_VALUE_MOBILE_TOP_UP')}</Radio>
                    {country && <div className='borrow-fiat-method-container__payout__method__msg'>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_PAYOUT_MSG_NOT_AVAILABLE')} </div>}
                  </div>
                </Radio.Group>
              </div>

              <div className='borrow-fiat-method-container__repayment'>
                <div className='borrow-fiat-method-container__repayment__title'>
                  {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_REPAYMENT_TITLE')}
                </div>
                <Radio.Group onChange={handleRepaymentCurrencySelect} value={repaymentCurrency}>
                  <Radio disabled={!country} value={1}>USDT (Avalanche)</Radio>
                  <Radio disabled={!country} value={2}>USDC (Avalanche)</Radio>
                </Radio.Group>
              </div>
              <div className='borrow-fiat-method-container__email'>
                <div className='borrow-fiat-method-container__email__control'>
                  <Checkbox disabled={!country} onChange={handleReceiveEmailCheck}>{t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_EMAIL_CONTROL')}</Checkbox>
                </div>
              </div>
              <div className='borrow-fiat-method-container__action'>
                <Button
                  loading={_isPending}
                  type="primary"
                  htmlType='submit'
                  disabled={isNotValidForm || !country}
                  className={twMerge('btn-primary-custom')}
                  block>
                  {t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_ACTION_NEXT')}
                </Button>
              </div>
            </div>
          </div>
        )
      }}
    </Form >
  );
}
