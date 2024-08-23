import React, { useState } from 'react';
import cssClass from './borrow-fiat-payment.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Radio, Button } from 'antd';
import type { SelectProps, CheckboxProps, FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';

type FieldType = {
  amount?: any;
};

enum PayoutMethod {
  BankWire = 1,
  GiftCode,
}


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

const BankOutletMap = new Map(
  [
    {
      value: 'Costco Gift Card',
      name: 'Costco Gift Card',
    },
  ].map(item => [item.value, item]),
);

const GiftCodeAmountMap = new Map(
  [
    {
      value: '100 USD',
      name: '100 USD',
    },
  ].map(item => [item.value, item]),
);

const PaymentDetail = ({ paymentMethod }: any) => {
  const { t } = useTranslation('common');

  if (paymentMethod == PayoutMethod.GiftCode) {
    return <>
      <div className="borrow-fiat-payment-container__detail">
        <div className='borrow-fiat-payment-container__detail__title'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TITLE')}
        </div>
        <div className='borrow-fiat-payment-container__detail__content'>
          <div className='borrow-fiat-payment-container__detail__content__item'>
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BRAND_OUTLET')}:
            <Select placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BRAND_OUTLET_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-select'
              popupClassName={cssClass['borrow-fiat-payment-select']}
              options={[...(BankOutletMap.values() as any)].map(item => ({
                value: item.value,
                lable: item.name
              }))}
            />
          </div>
          <div className='borrow-fiat-payment-container__detail__content__item'>
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_GIFT_CODE_AMOUNT')}:
            <Select placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_GIFT_CODE_AMOUNT_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-select'
              popupClassName={cssClass['borrow-fiat-payment-select']}
              options={[...(GiftCodeAmountMap.values() as any)].map(item => ({
                value: item.value,
                lable: item.name
              }))}
            />
          </div>
          <div className='borrow-fiat-payment-container__detail__content__item'>
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION')}:
            <Input placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-input' />
          </div>
        </div>
      </div>
    </>
  }
  return <>
    <div className="borrow-fiat-payment-container__input">
      <div className="borrow-fiat-payment-container__input__title">
        {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BORROW_AMOUNT')}
      </div>
      <div className="borrow-fiat-payment-container__input__control">
        <Form.Item name="amount" help="">
          <InputNumber controls={false} placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BORROW_AMOUNT_PLACEHOLDER')} suffix="USD" className="borrow-fiat-payment-container__input__control__amount" />
        </Form.Item>
      </div>
    </div>
    <div className="borrow-fiat-payment-container__detail">
      <div className='borrow-fiat-payment-container__detail__title'>
        {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TITLE')}
      </div>
      <div className='borrow-fiat-payment-container__detail__content'>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BANK')}:
          <Select placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BANK_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-select'
            popupClassName={cssClass['borrow-fiat-payment-select']}
            options={[...(BankMap.values() as any)].map(item => ({
              value: item.value,
              lable: item.name
            }))}
          />
        </div>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_NUMBER')}:
          <Input placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_NUMBER_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-input' />
        </div>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER')}:
          <Input placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-input' />
        </div>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_PURPOSE_OF_PAYMENT')}:
          <Select placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_PURPOSE_OF_PAYMENT_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-select'
            popupClassName={cssClass['borrow-fiat-payment-select']}
            options={[...(PurposeMap.values() as any)].map(item => ({
              value: item.value,
              lable: item.name
            }))}
          />
        </div>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_SOURCE_OF_INCOME')}:
          <Select placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_SOURCE_OF_INCOME_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-select'
            popupClassName={cssClass['borrow-fiat-payment-select']}
            options={[...(IncomeMap.values() as any)].map(item => ({
              value: item.value,
              lable: item.name
            }))}
          />
        </div>
        <div className='borrow-fiat-payment-container__detail__content__item'>
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION')}:
          <Input placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION_PLACEHOLDER')} className='borrow-fiat-payment-container__detail__content__item__control-input' />
        </div>
      </div>
    </div>

    <div className='borrow-fiat-payment-container__transaction'>
      <div className='borrow-fiat-payment-container__transaction__title'>
        {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ FIAT_TRANSACTION _FEE', {
          percent: 4
        })}
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
  </>
}

export default function ModalBorrowFiatPaymentComponent({
  next,
  back,
  detail
}: any) {
  const { paymentMethod } = detail;
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      next(data);
      _setIsPending(false)
    }, 1000);
  };


  return (
    <Form onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        console.log(isNotValidForm)
        return (
          <div className={cssClass['borrow-fiat-payment-wrapper']}>
            <div className={'borrow-fiat-payment-container'}>

              <PaymentDetail paymentMethod={paymentMethod} />
              <div className='borrow-fiat-payment-container__term-condition'>
                <Checkbox onChange={handleReceiveEmailCheck}>{t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TERM_CONDITION')}</Checkbox>
              </div>
              <div className='borrow-fiat-payment-container__action'>
                <div className='borrow-fiat-payment-container__action__item'>
                  <Button
                    onClick={back}
                    className={twMerge('borrow-fiat-payment-container__action__item__back')}
                  >
                    {t('BORROW_FIAT_MODAL_TAB_PAYOUT_ACTION_BACK')}
                  </Button>
                </div>
                <div className='borrow-fiat-payment-container__action__item'>
                  <Button
                    loading={_isPending}
                    type="primary"
                    htmlType='submit'
                    className={twMerge('btn-primary-custom')}
                  >
                    {t('BORROW_FIAT_MODAL_TAB_PAYOUT_ACTION_NEXT')}
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
