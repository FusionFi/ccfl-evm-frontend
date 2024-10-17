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
  back,
  detail
}: any) {
  const { paymentMethod } = detail;
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);

  const [form] = Form.useForm()

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      next();
      _setIsPending(false)
    }, 1000);
  };

  const TokenMap = new Map(
    [
      {
        value: 'WETH',
        name: 'WETH',
      },
      {
        value: 'WBTC',
        name: 'WBTC',
      },
      {
        value: 'ADA',
        name: 'ADA',
      }
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
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_LOAN_TITLE')}
                  </div>

                  <div className='borrow-fiat-collateral-container__loan__item__value'>
                    13,000
                    <span className='borrow-fiat-collateral-container__loan__item__value__unit'>USD</span>
                    <span className='borrow-fiat-collateral-container__loan__item__value__price'>$13,000.12</span>
                  </div>
                </div>
                {paymentMethod == 1 && <div className='borrow-fiat-collateral-container__loan__item'>
                  <div className='borrow-fiat-collateral-container__loan__item__title'>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_APY')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>

                  <div className='borrow-fiat-collateral-container__loan__item__value'>
                    10
                    <span className='borrow-fiat-collateral-container__loan__item__value__unit'>%</span>
                  </div>
                </div>}
                {paymentMethod == 1 && <div className='borrow-fiat-collateral-container__loan__item'>
                  <div className='borrow-fiat-collateral-container__loan__item__title'>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_ FIAT_TRANSACTION _FEE', {
                      percent: 4
                    })}
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
                </div>}
              </div>
              <div className="borrow-fiat-collateral-container__detail">
                <div className='borrow-fiat-collateral-container__detail__title'>
                  {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_DETAIL_TITLE')}
                </div>
                <div className='borrow-fiat-collateral-container__detail__content'>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    <div className='borrow-fiat-collateral-container__detail__content__item__title'>
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_TOKEN')}
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    <Select placeholder={t('BORROW_FIAT_MODAL_TAB_COLLATERAL_TOKEN_PLACEHOLDER')} className='borrow-fiat-collateral-container__detail__content__item__control-select'
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
                      }} />  {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_BALANCE', {
                        token: 'ADA'
                      })}
                    </div>
                    <div className='borrow-fiat-collateral-container__detail__content__item__value'>
                      7.87
                      <span className='borrow-fiat-collateral-container__detail__content__item__value__unit'>WETH</span>
                      <span className='borrow-fiat-collateral-container__detail__content__item__value__price'>$15,765.12</span>
                    </div>
                  </div>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    <div className="self-start">
                      {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_AMOUNT')}
                    </div>
                    <div className='borrow-fiat-collateral-container__detail__content__item__value'>
                      <div className="borrow-fiat-collateral-container__detail__content__item__value__wrapper">
                        <Form.Item name="amount" help="">
                          <InputNumber controls={false} suffix="WETH" placeholder='Enter amount' className='borrow-fiat-collateral-container__detail__content__item__control-input' />
                        </Form.Item>
                        <div className='borrow-fiat-collateral-container__detail__content__item__value__note'>
                          {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_MINIMUM_AMOUNT')}: <span className='text-white'>1.7 WETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='borrow-fiat-collateral-container__detail__content__item'>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_HEALTH_FACTOR')}
                    <div className='borrow-fiat-collateral-container__detail__content__item__value' style={{
                      alignItems: 'center'
                    }}>
                      <span className="font-bold text-base">
                        3.31B
                      </span>
                      {amount > 0 && <>
                        <ArrowRightOutlined />
                        <span className="font-bold text-base" style={{
                          color: "#52C41A"
                        }}>3.33B</span>
                      </>}
                    </div>
                  </div>
                </div>
              </div>
              <div className='borrow-fiat-collateral-container__tx'>
                <div className='borrow-fiat-collateral-container__tx__item'>
                  <div className='borrow-fiat-collateral-container__tx__item__title'>
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_GAS_FEE')}
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
                    onClick={back}
                    className={twMerge('borrow-fiat-collateral-container__action__item__back')}
                  >
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_BACK')}
                  </Button>
                </div>
                <div className='borrow-fiat-collateral-container__action__item'>
                  <Button
                    loading={_isPending}
                    type="primary"
                    htmlType='submit'
                    disabled={isNotValidForm || !amount}
                    className={twMerge('btn-primary-custom')}
                  >
                    {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_NEXT')}
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
