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
import ModalBorrowFiatCollateralComponent from './borrow-fiat-collateral.component'
import ModalBorrowFiatConfirmComponent from './borrow-fiat-confirm.component'

type FieldType = {
  amount?: any;
};

type LabelRender = SelectProps['labelRender'];



export default function ModalBorrowFiatComponent({ isModalOpen, handleCancel, handleOk }: any) {
  const { t } = useTranslation('common');

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);
  const [tab, setTab] = useState({
    active: '1'
  });

  const _handleOk = useCallback((params: any) => {
    _setIsApproved(false);
    handleOk(params);
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
        next: (data: any) => {
          console.log('ModalBorrowFiatMethodComponent: ', data)
          setTab({
            ...tab,
            ...data,
            active: '2'
          })
        }
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
        detail: tab,
        next: (data: any) => setTab({
          ...tab,
          ...data,
          active: '3'
        }),
        back: () => setTab({
          ...tab,
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
      children: ModalBorrowFiatCollateralComponent({
        detail: tab,
        next: (data: any) => setTab({
          ...tab,
          ...data,
          active: '4'
        }),
        back: () => setTab({
          ...tab,
          active: '2'
        })
      }),
    },
    {
      key: '4',
      disabled: true,
      label: TabbarLabelRender({
        key: '4',
        title: 'Confirm'
      }),
      children: ModalBorrowFiatConfirmComponent({
        detail: tab,
        next: () => {
          _handleOk(tab);
          setTab({
            active: '1'
          })
        },
        back: () => setTab({
          ...tab,
          active: '3'
        })
      }),
    },
  ];

  console.log('tab: ', tab)
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
    </Modal>
  );
}
