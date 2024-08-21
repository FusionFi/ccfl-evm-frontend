import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import cssClass from './modal-borrow-fiat.component.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal, Form, Select, Tabs } from 'antd';
import type { FormProps, TabsProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import type { SelectProps } from 'antd';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import ModalBorrowFiatMethodComponent from './borrow-fiat-method.component'
import ModalBorrowFiatPaymentComponent from './borrow-fiat-payment.component'
type FieldType = {
  amount?: any;
};

type LabelRender = SelectProps['labelRender'];



export default function ModalBorrowFiatComponent({ isModalOpen, handleCancel, handleOk }: any) {
  const { t } = useTranslation('common');

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);
  const [tab, setTab] = useState({
    active: '2'
  });

  const _handleOk = useCallback(() => {
    _setIsApproved(false);
    handleOk();
  }, []);

  const _handleCancel = useCallback(() => {
    _setIsApproved(false);
    _setIsPending(false);
    handleCancel();
  }, []);

  const onChange = (key: string) => {
    setTab({
      active: key
    })

  };

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className='modal-borrow-fiat__tabbar' />
  );

  const TabbarLabelRender = ({
    key,
    title
  }: any) => {
    let style = {}

    if (key == tab.active) {
      style = {
        background: '#1890FF',
        border: "1px solid #1890FF",
        fontFamily: 'Inter',
        color: 'white'
      }
    } else if (key < tab.active) {
      style = {
        background: 'transparent',
        border: "1px solid #1890FF",
        color: '#1890FF'
      }
    }

    return (
      <div className='modal-borrow-fiat__tabbar__label'>
        <div className='modal-borrow-fiat__tabbar__label__wrapper'>
          <div className='modal-borrow-fiat__tabbar__label__wrapper__key' style={{
            ...style
          }}>
            {key < tab.active ? <CheckOutlined /> : key}
          </div>
          {title}
          {key != 4 && <RightOutlined className='modal-borrow-fiat__tabbar__label__wrapper__arrow' />}
        </div>
      </div>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: TabbarLabelRender({
        key: '1',
        title: 'Select Method'
      }),
      disabled: true,
      children: ModalBorrowFiatMethodComponent({
        next: () => setTab({
          active: '2'
        })
      }),
    },
    {
      key: '2',
      disabled: true,
      label: TabbarLabelRender({
        key: '2',
        title: 'Setup Payment'
      }),
      children: ModalBorrowFiatPaymentComponent({
        next: () => setTab({
          active: '3'
        }),
        back: () => setTab({
          active: '1'
        })
      }),
    },
    {
      key: '3',
      disabled: true,
      label: TabbarLabelRender({
        key: '3',
        title: 'Collateral'
      }),
      children: 'Content of Tab Pane 2',
    },
    {
      key: '4',
      disabled: true,
      label: TabbarLabelRender({
        key: '4',
        title: 'Confirm'
      }),
      children: 'Content of Tab Pane 2',
    },
  ];

  return (
    <Modal
      wrapClassName={cssClass['modal-borrow-fiat-wrapper']}
      title="Borrow FIAT"
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      width={1018}
      footer={null}>

      <Tabs activeKey={tab.active} items={items} onChange={onChange} renderTabBar={renderTabBar} />
      {/* <Form onFinish={onFinish}>
        {(_, formInstance) => {
          const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0);
          return (
            <div className="modal-borrow-fiat-container">
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
              
              <div className="modal-borrow-fiat-container__input">
                <div className="modal-borrow-fiat-container__input__title">
                  {t('SUPPLY_MODAL_INPUT_AMOUNT')}
                </div>
                <div className="modal-borrow-fiat-container__input__control">
                  <Form.Item
                    name="amount"
                    help=""
                    rules={[
                      {
                        max: 10,
                        type: 'number',
                        message: t('SUPPLY_MODAL_VALIDATE_INSUFFICIENT_BALANCE'),
                      },
                      {
                        required: true,
                        message: t('SUPPLY_MODAL_VALIDATE_REQUIRE_AMOUNT'),
                      },
                    ]}>
                    <InputNumber
                      placeholder={t('SUPPLY_MODAL_INPUT_PLACEHOLDER')}
                      className="modal-borrow-fiat-container__input__control__amount"
                      controls={false}
                      addonAfter={
                        <div className="modal-borrow-fiat-container__input__control__amount__token">
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

                  <div className="modal-borrow-fiat-container__input__control__price">
                    ≈ $4,000.00
                    <Button
                      type="link"
                      className="modal-borrow-fiat-container__input__control__price__max">
                      {t('SUPPLY_MODAL_MAX')}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="modal-borrow-fiat-container__input__balance">
                    {t('SUPPLY_MODAL_WALLET_BALANCE')}: 50,000.00 USDT
                  </div>
                  <span className="modal-borrow-fiat-container__input__error">
                    {formInstance.getFieldError('amount')[0]}
                  </span>
                </div>
              </div>
              <div className="modal-borrow-fiat-container__overview">
                <div className="modal-borrow-fiat-container__overview__title">
                  {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_TITLE')}
                </div>
                <div className="modal-borrow-fiat-container__overview__apy">
                  <div className="modal-borrow-fiat-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_APY')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="modal-borrow-fiat-container__overview__apy__value">
                    &#60;
                    <span className="text-white font-bold">0.01</span>%
                  </span>
                </div>
              </div>
              <div className="modal-borrow-fiat-container__overview">
                <div className="modal-borrow-fiat-container__overview__apy">
                  <div className="modal-borrow-fiat-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_GAS_FEE')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="modal-borrow-fiat-container__overview__apy__value text-sm">
                    $<span className="text-white">0.02</span>
                  </span>
                </div>
              </div>
              <div className="modal-borrow-fiat-container__action">
                {_isApproved ? (
                  <Button
                    type="primary"
                    loading={_isPending}
                    disabled={isNotValidForm}
                    htmlType="submit"
                    className={twMerge('btn-primary-custom')}
                    block>
                    {t('SUPPLY_MODAL_SUPPLY_BUTTON', {
                      token: 'USDT',
                    })}
                  </Button>
                ) : (
                  <div className="modal-borrow-fiat-container__action__approve">
                    <div className="modal-borrow-fiat-container__action__approve__helper">
                      <QuestionCircleIcon />
                      <Link
                        className="modal-borrow-fiat-container__action__approve__helper__link"
                        href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                        target="_blank">
                        {t('SUPPLY_MODAL_APPROVE_EXPLAIN')}
                      </Link>
                    </div>

                    <Button
                      loading={_isPending}
                      type="primary"
                      htmlType="submit"
                      disabled={isNotValidForm}
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
      </Form> */}
    </Modal>
  );
}
