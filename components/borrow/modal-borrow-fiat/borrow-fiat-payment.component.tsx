import React, { useEffect, useState } from 'react';
import cssClass from './borrow-fiat-payment.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Radio, Button } from 'antd';
import type { SelectProps, CheckboxProps, FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import service_setting from '@/utils/backend/borrow';
import { MIN_AMOUNT_KEY } from '@/constants/common.constant';
import { LoadingOutlined } from '@ant-design/icons';

type FieldType = {
  amount?: any;
  bank?: any;
  accountNumber?: any;
  accountOwner?: any;
  purposePayment?: any;
  sourceIncome?: any;
  description?: any;
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

const PaymentDetail = ({
  paymentMethod,
  fiatTransactionFee,
  amount,
  minimum,
  loadingMinimum,
}: any) => {
  const { t } = useTranslation('common');

  if (paymentMethod == PayoutMethod.GiftCode) {
    return (
      <>
        <div className="borrow-fiat-payment-container__detail">
          <div className="borrow-fiat-payment-container__detail__title">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TITLE')}
          </div>
          <div className="borrow-fiat-payment-container__detail__content">
            <div className="borrow-fiat-payment-container__detail__content__item">
              {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BRAND_OUTLET')}:
              <Select
                placeholder={t(
                  'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BRAND_OUTLET_PLACEHOLDER',
                )}
                className="borrow-fiat-payment-container__detail__content__item__control-select"
                popupClassName={cssClass['borrow-fiat-payment-select']}
                options={[...(BankOutletMap.values() as any)].map(item => ({
                  value: item.value,
                  lable: item.name,
                }))}
              />
            </div>
            <div className="borrow-fiat-payment-container__detail__content__item">
              {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_GIFT_CODE_AMOUNT')}:
              <Select
                placeholder={t(
                  'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_GIFT_CODE_AMOUNT_PLACEHOLDER',
                )}
                className="borrow-fiat-payment-container__detail__content__item__control-select"
                popupClassName={cssClass['borrow-fiat-payment-select']}
                options={[...(GiftCodeAmountMap.values() as any)].map(item => ({
                  value: item.value,
                  lable: item.name,
                }))}
              />
            </div>
            <div className="borrow-fiat-payment-container__detail__content__item">
              {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION')}:
              <Input
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-input"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="borrow-fiat-payment-container__input">
        <div className="borrow-fiat-payment-container__input__title">
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BORROW_AMOUNT')}
        </div>
        <div className="borrow-fiat-payment-container__input__control">
          <Form.Item
            name="amount"
            help=""
            validateFirst
            rules={[
              {
                required: true,
                type: 'number',
              },
            ]}>
            <InputNumber
              controls={false}
              placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BORROW_AMOUNT_PLACEHOLDER')}
              suffix="USD"
              className="borrow-fiat-payment-container__input__control__amount"
            />
          </Form.Item>
          <div className="modal-borrow-balance-minimum">
            {minimum !== 0 && (
              <span>
                {t('BORROW_MININUM')}:{' '}
                {loadingMinimum ? <LoadingOutlined className="mr-1" /> : minimum}
                {/* {dadat} */}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="borrow-fiat-payment-container__detail">
        <div className="borrow-fiat-payment-container__detail__title">
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TITLE')}
        </div>
        <div className="borrow-fiat-payment-container__detail__content">
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BANK')}:
            <Form.Item
              name="bank"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_CHOOSE_BANK_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-select"
                popupClassName={cssClass['borrow-fiat-payment-select']}
                options={[...(BankMap.values() as any)].map(item => ({
                  value: item.value,
                  lable: item.name,
                }))}
              />
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_NUMBER')}:
            <Form.Item
              name="accountNumber"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                  type: 'number',
                },
              ]}>
              <InputNumber
                controls={false}
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_NUMBER_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-input"
              />
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER')}:
            <Form.Item
              name="accountOwner"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-input"
              />
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_PURPOSE_OF_PAYMENT')}:
            <Form.Item
              name="purposePayment"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                placeholder={t(
                  'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_PURPOSE_OF_PAYMENT_PLACEHOLDER',
                )}
                className="borrow-fiat-payment-container__detail__content__item__control-select"
                popupClassName={cssClass['borrow-fiat-payment-select']}
                options={[...(PurposeMap.values() as any)].map(item => ({
                  value: item.value,
                  lable: item.name,
                }))}
              />
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_SOURCE_OF_INCOME')}:
            <Form.Item
              name="sourceIncome"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_SOURCE_OF_INCOME_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-select"
                popupClassName={cssClass['borrow-fiat-payment-select']}
                options={[...(IncomeMap.values() as any)].map(item => ({
                  value: item.value,
                  lable: item.name,
                }))}
              />
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION')}:
            <Form.Item name="description" help="">
              <Input
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-input"
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <div className="borrow-fiat-payment-container__transaction">
        <div className="borrow-fiat-payment-container__transaction__title">
          {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ FIAT_TRANSACTION _FEE', {
            percent: fiatTransactionFee,
          })}
          <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
            <span className="cursor-pointer">
              <InfoCircleIcon className="" />
            </span>
          </Tooltip>
        </div>

        <div className="borrow-fiat-payment-container__transaction__value">
          <span className="borrow-fiat-payment-container__transaction__value__uint">$</span>
          {amount > 0 ? (fiatTransactionFee * amount) / 100 : 0}
        </div>
      </div>
    </>
  );
};

export default function ModalBorrowFiatPaymentComponent({
  next,
  back,
  detail,
  fiatTransactionFee,
  tab,
}: any) {
  const { paymentMethod } = detail;
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);
  const [minimum, setMinimum] = useState() as any;
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);
  console.log('tabtab', tab);
  const handleReceiveEmailCheck: CheckboxProps['onChange'] = e => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = data => {
    _setIsPending(true);
    setTimeout(() => {
      next(data);
      _setIsPending(false);
    }, 1000);
  };

  const handleMinimumRepayment = async () => {
    try {
      setLoadingMinimum(true);
      let res = (await service_setting.getSetting(MIN_AMOUNT_KEY.MIN_AMOUNT_BORROW)) as any;

      if (res && res[0]?.value) {
        setMinimum(res[0]?.value);
      } else {
        setMinimum(undefined);
      }
      setLoadingMinimum(false);
    } catch (error) {
      setLoadingMinimum(false);
    }
  };

  useEffect(() => {
    handleMinimumRepayment();
  }, []);

  return (
    <Form onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0);
        const amount = formInstance.getFieldValue('amount');
        const bank = formInstance.getFieldValue('bank');
        const accountNumber = formInstance.getFieldValue('accountNumber');
        const accountOwner = formInstance.getFieldValue('accountOwner');
        const purposePayment = formInstance.getFieldValue('purposePayment');
        const sourceIncome = formInstance.getFieldValue('sourceIncome');
        console.log(
          'bank',
          formInstance.getFieldsError(),
          isNotValidForm,
          amount,
          bank,
          accountNumber,
          accountOwner,
          purposePayment,
          sourceIncome,
        );
        return (
          <div className={cssClass['borrow-fiat-payment-wrapper']}>
            <div className={'borrow-fiat-payment-container'}>
              <PaymentDetail
                paymentMethod={paymentMethod}
                fiatTransactionFee={fiatTransactionFee}
                amount={amount}
                minimum={minimum}
                loadingMinimum={loadingMinimum}
              />
              <div className="borrow-fiat-payment-container__term-condition">
                <Checkbox onChange={handleReceiveEmailCheck}>
                  {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_AGREE_WITH')}
                  <a href="#" target="_blank">
                    {' '}
                    {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TERM_CONDITION')}
                  </a>
                </Checkbox>
              </div>
              <div className="borrow-fiat-payment-container__action">
                <div className="borrow-fiat-payment-container__action__item">
                  <Button
                    onClick={back}
                    className={twMerge('borrow-fiat-payment-container__action__item__back')}>
                    {t('BORROW_FIAT_MODAL_TAB_PAYOUT_ACTION_BACK')}
                  </Button>
                </div>
                <div className="borrow-fiat-payment-container__action__item">
                  <Button
                    disabled={
                      isNotValidForm ||
                      !amount ||
                      !bank ||
                      !accountNumber ||
                      !accountOwner ||
                      !purposePayment ||
                      !sourceIncome
                    }
                    loading={_isPending}
                    type="primary"
                    htmlType="submit"
                    className={twMerge('btn-primary-custom')}>
                    {t('BORROW_FIAT_MODAL_TAB_PAYOUT_ACTION_NEXT')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Form>
  );
}
