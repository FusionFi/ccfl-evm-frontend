import React, { useState } from 'react';
import cssClass from './borrow-fiat-confirm.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Tooltip, Form, Select, Checkbox, InputNumber, Input, Button } from 'antd';
import type { CheckboxProps, FormProps } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import Link from 'next/link';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';

type FieldType = {
  amount?: any;
};

export default function ModalBorrowFiatCollateralComponent({
  next,
  back,
}: any) {
  const { t } = useTranslation('common');
  const [_isPending, _setIsPending] = useState(false);
  const [_isApproved, _setIsApproved] = useState(false);

  const handleReceiveEmailCheck: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const [form] = Form.useForm()

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      if (_isApproved) {
        next();
      } else {
        _setIsApproved(true);
      }
      _setIsPending(false)
    }, 1000);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      {(_, formInstance) => {
        const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
        const amount = formInstance.getFieldValue('amount')

        return (
          <div className={cssClass['borrow-fiat-confirm-wrapper']}>
            <div className={'borrow-fiat-confirm-container'}>
              <div className='borrow-fiat-confirm-container__loan'>
                <div className='borrow-fiat-confirm-container__loan__title'>
                  Loan detail
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Loan currency
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    <Image
                      src={'/images/country/usa.png'}
                      alt={'USA'}
                      width={16}
                      height={16}
                      style={{
                        height: 16,
                        width: 16,
                      }}
                      className="mr-2"
                    />
                    USA/USD
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Loan amount
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    <span className='text-white'>
                      13,000
                    </span>
                    <span className='borrow-fiat-confirm-container__loan__item__value__unit'>USD</span>
                    <span className='borrow-fiat-confirm-container__loan__item__value__price'>$13,000.12</span>
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Payout method
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    <span className='text-white'>
                      Bank Wire
                    </span>
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Payout Detail
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    <span className='text-white'>
                      Citibank
                    </span>
                    <span className='borrow-fiat-confirm-container__loan__item__value__unit'>857 768 76</span>
                    <span className='borrow-fiat-confirm-container__loan__item__value__price'>James E. Hart</span>
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Purpose of Payment
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    Gift
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Source of Income
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    Salary
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Description
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value'>
                    Self
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__loan__item'>
                  <div className='borrow-fiat-confirm-container__loan__item__title'>
                    Repayment currency
                  </div>

                  <div className='borrow-fiat-confirm-container__loan__item__value' style={{
                    alignItems: 'center'
                  }}>
                    <Image
                      src="/images/common/usdc.png"
                      alt="USDC"
                      width={14}
                      height={14}
                    />
                    <span className='text-white font-base font-bold'>USDC</span>
                    <span className='font-base'>
                      (Avalance)
                    </span>

                  </div>
                </div>
              </div>
              <div className='borrow-fiat-confirm-container__tx'>
                <div className='borrow-fiat-confirm-container__tx__item'>
                  <div className='borrow-fiat-confirm-container__tx__item__title'>
                    Gas fee
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className='borrow-fiat-confirm-container__tx__item__value'>
                    <span className="borrow-fiat-confirm-container__tx__item__value__unit">$</span>
                    2.00
                  </div>
                </div>
                <div className='borrow-fiat-confirm-container__tx__item'>
                  <div className='borrow-fiat-confirm-container__tx__item__title'>
                    FIAT transaction fee (4%)
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>

                  <div className='borrow-fiat-confirm-container__tx__item__value'>
                    <span className='borrow-fiat-confirm-container__tx__item__value__unit'>$</span>
                    520.00
                  </div>
                </div>
              </div>
              <div className="borrow-fiat-confirm-container__detail">
                <div className='borrow-fiat-confirm-container__detail__title'>
                  Collateral Setup
                </div>
                <div className='borrow-fiat-confirm-container__detail__content'>
                  <div className='borrow-fiat-confirm-container__detail__content__item'>
                    <div className='borrow-fiat-confirm-container__detail__content__item__title'>
                      Collateral token
                      <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                        <span className="cursor-pointer">
                          <InfoCircleIcon className="" />
                        </span>
                      </Tooltip>
                    </div>
                    <div className='borrow-fiat-confirm-container__detail__content__item__value' style={{
                      alignItems: 'center'
                    }}>
                      <Image
                        src="/images/common/weth.png"
                        alt="USDC"
                        width={16}
                        height={16}
                      />
                      WETH
                    </div>
                  </div>
                  <div className='borrow-fiat-confirm-container__detail__content__item'>
                    <div className="self-start">
                      Collateral amount
                    </div>
                    <div className='borrow-fiat-confirm-container__detail__content__item__value'>
                      <span className='text-white font-medium'>7.87</span>
                      <span className='borrow-fiat-confirm-container__detail__content__item__value__unit'>WETH</span>
                      <span className='borrow-fiat-confirm-container__detail__content__item__value__price'>$15,765.12</span>
                    </div>
                  </div>
                  <div className='borrow-fiat-confirm-container__detail__content__item'>
                    Health factor
                    <div className='borrow-fiat-confirm-container__detail__content__item__value' style={{
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
              <div className='borrow-fiat-confirm-container__email'>
                <div className='borrow-fiat-confirm-container__email__control'>
                  <Checkbox onChange={handleReceiveEmailCheck}>Use my deposit for yield earning </Checkbox>
                </div>
              </div>
              <div className='borrow-fiat-confirm-container__action'>
                {!_isApproved && <div className="borrow-fiat-confirm-container__action__approve__helper">
                  <QuestionCircleIcon />
                  <Link
                    className="borrow-fiat-confirm-container__action__approve__helper__link"
                    href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                    target="_blank">
                    Why do I need to approve?
                  </Link>
                </div>
                }

                <div className='borrow-fiat-confirm-container__action__control'>
                  <div className='borrow-fiat-confirm-container__action__control__item'>
                    <Button
                      onClick={back}
                      className={twMerge('borrow-fiat-confirm-container__action__control__item__back')}
                      style={{
                        borderColor: "#434343",
                        background: '#141414',
                        color: "rgba(255, 255, 255, 0.85)"
                      }}
                    >
                      Back
                    </Button>
                  </div>
                  <div className='borrow-fiat-confirm-container__action__control__item'>
                    <Button
                      loading={_isPending}
                      type="primary"
                      htmlType='submit'
                      disabled={isNotValidForm}
                      className={twMerge('btn-primary-custom')}
                    >
                      {!_isApproved ? `Approve WETH` : 'Deposit WETH'}
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      }}
    </Form >
  );
}
