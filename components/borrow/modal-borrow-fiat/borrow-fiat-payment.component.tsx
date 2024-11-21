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
import service from '@/utils/backend/encryptus';

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
  amountError,
  accountNumberError,
  accountOwnerError,
  purpose,
  source,
  loadingPurpose,
  loadingSource,
  countryInfo,
  ownerPhoneError,
  ownerAddressError,
  bicError,
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
                message: t('FIAT_REQUIRED'),
              },
            ]}>
            <InputNumber
              controls={false}
              placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BORROW_AMOUNT_PLACEHOLDER')}
              suffix={countryInfo?.currency}
              className="borrow-fiat-payment-container__input__control__amount"
            />
          </Form.Item>
        </div>
        <div className="borrow-fiat-payment-container_minimum">
          <span>
            {t('BORROW_MININUM')}: {loadingMinimum ? <LoadingOutlined className="mr-1" /> : minimum}{' '}
            {countryInfo?.currency}
          </span>
        </div>
        {amountError?.length > 0 ? (
          <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
        ) : (
          <div></div>
        )}
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
                  message: t('FIAT_REQUIRED'),
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
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_TYPE')}:
            <Form.Item
              name="accountType"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                  message: t('FIAT_REQUIRED'),
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
            <div>
              <Form.Item
                name="accountNumber"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <InputNumber
                  controls={false}
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_NUMBER_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                />
              </Form.Item>
              {accountNumberError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER')}:
            <div>
              <Form.Item
                name="accountOwner"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_ACCOUNT_OWNER_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                  autoComplete="off"
                />
              </Form.Item>
              {accountOwnerError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_OWNER_PHONE_NUMBER')}:
            <div>
              <Form.Item
                name="ownerPhone"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t(
                    'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_OWNER_PHONE_NUMBER_PLACEHOLDER',
                  )}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                  autoComplete="off"
                />
              </Form.Item>
              {ownerPhoneError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_TELEPHONE_PROVIDER')}:
            <Form.Item
              name="telephoneProvider"
              help=""
              validateFirst
              rules={[
                {
                  required: true,
                  message: t('FIAT_REQUIRED'),
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
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_OWNER_ADDRESS')}:
            <div>
              <Form.Item
                name="ownerAddress"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_OWNER_ADDRESS_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                />
              </Form.Item>
              {ownerAddressError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BIC')}:
            <div>
              <Form.Item
                name="bic"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BIC_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                />
              </Form.Item>
              {bicError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BIC')}:
            <div>
              <Form.Item
                name="bic"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BIC_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                />
              </Form.Item>
              {bicError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_BANK_SUB_CODE')}:
            <div>
              <Form.Item
                name="bankSubCode"
                help=""
                validateFirst
                rules={[
                  {
                    required: true,
                    message: t('FIAT_REQUIRED'),
                  },
                ]}>
                <Input
                  placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_OWNER_ADDRESS_PLACEHOLDER')}
                  className="borrow-fiat-payment-container__detail__content__item__control-input"
                />
              </Form.Item>
              {bicError?.length > 0 ? (
                <div className="borrow-fiat-payment-container_error">{t('FIAT_REQUIRED')}</div>
              ) : (
                <div></div>
              )}
            </div>
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
                  message: t('FIAT_REQUIRED'),
                },
              ]}>
              {loadingPurpose ? (
                <LoadingOutlined className="mr-1" />
              ) : (
                <Select
                  placeholder={t(
                    'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_PURPOSE_OF_PAYMENT_PLACEHOLDER',
                  )}
                  className="borrow-fiat-payment-container__detail__content__item__control-select"
                  popupClassName={cssClass['borrow-fiat-payment-select']}
                  options={[...(purpose as any)].map(item => ({
                    value: item,
                    lable: item,
                  }))}
                />
              )}
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
                  message: t('FIAT_REQUIRED'),
                },
              ]}>
              {loadingSource ? (
                <LoadingOutlined className="mr-1" />
              ) : (
                <Select
                  placeholder={t(
                    'BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_SOURCE_OF_INCOME_PLACEHOLDER',
                  )}
                  className="borrow-fiat-payment-container__detail__content__item__control-select"
                  popupClassName={cssClass['borrow-fiat-payment-select']}
                  options={[...(source.values() as any)].map(item => ({
                    value: item,
                    lable: item,
                  }))}
                />
              )}
            </Form.Item>
          </div>
          <div className="borrow-fiat-payment-container__detail__content__item">
            {t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION')}:
            <Form.Item name="description" help="">
              <Input
                placeholder={t('BORROW_FIAT_MODAL_TAB_PAYOUT_DETAIL_DESCRIPTION_PLACEHOLDER')}
                className="borrow-fiat-payment-container__detail__content__item__control-input"
                autoComplete="off"
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
}: any) {
  const { paymentMethod, countryInfo } = detail;
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);
  const [minimum, setMinimum] = useState(0) as any;
  const [loadingMinimum, setLoadingMinimum] = useState<boolean>(false);

  const [purpose, setPurpose] = useState([]) as any;
  const [loadingPurpose, setLoadingPurpose] = useState<boolean>(false);

  const [source, setSource] = useState() as any;
  const [loadingSource, setLoadingSource] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = e => {
    setAgree(e.target.checked);
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

  const handleGetPurpose = async () => {
    try {
      setLoadingPurpose(true);
      const res_purpose = (await service.getPurpose()) as any;

      if (res_purpose) {
        setPurpose(res_purpose);
      }
      setLoadingPurpose(false);
    } catch (error) {
      setLoadingPurpose(false);
    }
  };

  const handleGetSource = async () => {
    try {
      setLoadingSource(true);
      const res_source = (await service.getSource()) as any;

      if (res_source) {
        setSource(res_source);
      }
      setLoadingSource(false);
    } catch (error) {
      setLoadingSource(false);
    }
  };

  useEffect(() => {
    handleMinimumRepayment();
    handleGetPurpose();
    handleGetSource();
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
        const amountError = formInstance.getFieldError('amount');
        const accountNumberError = formInstance.getFieldError('accountNumber');
        const accountOwnerError = formInstance.getFieldError('accountOwner');
        const ownerPhoneError = formInstance.getFieldError('ownerPhone');
        const ownerAddressError = formInstance.getFieldError('ownerAddress');
        const bicError = formInstance.getFieldError('bic');

        const isNotValidForm1 = formInstance.getFieldsError();

        console.log('isNotValidForm', isNotValidForm1, isNotValidForm);
        return (
          <div className={cssClass['borrow-fiat-payment-wrapper']}>
            <div className={'borrow-fiat-payment-container'}>
              <PaymentDetail
                paymentMethod={paymentMethod}
                fiatTransactionFee={fiatTransactionFee}
                amount={amount}
                minimum={minimum}
                loadingMinimum={loadingMinimum}
                amountError={amountError}
                accountNumberError={accountNumberError}
                accountOwnerError={accountOwnerError}
                purpose={purpose}
                source={source}
                loadingPurpose={loadingPurpose}
                loadingSource={loadingSource}
                countryInfo={countryInfo}
                ownerPhoneError={ownerPhoneError}
                ownerAddressError={ownerAddressError}
                bicError={bicError}
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
                      (amount && amount < minimum) ||
                      !bank ||
                      !accountNumber ||
                      !accountOwner ||
                      !purposePayment ||
                      !sourceIncome ||
                      !agree
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
