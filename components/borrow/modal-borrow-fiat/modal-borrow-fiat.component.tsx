import React, { useCallback, useEffect, useState } from 'react';
import cssClass from './modal-borrow-fiat.component.module.scss';
import { useTranslation } from 'next-i18next';
import { Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import type { SelectProps } from 'antd';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import ModalBorrowFiatMethodComponent from './borrow-fiat-method.component';
import ModalBorrowFiatPaymentComponent from './borrow-fiat-payment.component';
import ModalBorrowFiatCollateralComponent from './borrow-fiat-collateral.component';
import ModalBorrowFiatConfirmComponent from './borrow-fiat-confirm.component';
import service from '@/utils/backend/encryptus';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';

export default function ModalBorrowFiatComponent({ isModalOpen, handleCancel, handleOk }: any) {
  const { t } = useTranslation('common');
  const [provider] = useProviderManager();
  const { selectedChain } = useConnectedNetworkManager();

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);

  const [countryList, setCountryList] = useState([]);

  const fiatTransactionFee = 4;

  const [tab, setTab] = useState({
    active: '1',
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
      active: key,
    });
  };

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="modal-borrow-fiat__tabbar" />
  );

  const TabbarLabelRender = ({ key, title }: any) => {
    let style = {};

    if (key == tab.active) {
      style = {
        background: '#1890FF',
        border: '1px solid #1890FF',
        fontFamily: 'Inter',
        color: 'white',
      };
    } else if (key < tab.active) {
      style = {
        background: 'transparent',
        border: '1px solid #1890FF',
        color: '#1890FF',
      };
    }

    return (
      <div className="modal-borrow-fiat__tabbar__label">
        <div className="modal-borrow-fiat__tabbar__label__wrapper">
          <div
            className="modal-borrow-fiat__tabbar__label__wrapper__key"
            style={{
              ...style,
            }}>
            {key < tab.active ? <CheckOutlined /> : key}
          </div>
          {title}
          {key != 4 && (
            <RightOutlined className="modal-borrow-fiat__tabbar__label__wrapper__arrow" />
          )}
        </div>
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: TabbarLabelRender({
        key: '1',
        title: t('BORROW_FIAT_MODAL_TAB_SELECT_METHOD_TITLE'),
      }),
      disabled: true,
      children: ModalBorrowFiatMethodComponent({
        next: (data: any) => {
          console.log('ModalBorrowFiatMethodComponent: ', data);
          setTab({
            ...tab,
            ...data,
            active: '2',
          });
        },
        countryList,
      }),
    },
    {
      key: '2',
      disabled: true,
      label: TabbarLabelRender({
        key: '2',
        title: t('BORROW_FIAT_MODAL_TAB_SETUP_PAYMENT_TITLE'),
      }),
      children: ModalBorrowFiatPaymentComponent({
        detail: tab,
        next: (data: any) => {
          setTab({
            ...tab,
            ...data,
            active: '3',
          });
        },
        back: () =>
          setTab({
            ...tab,
            active: '1',
          }),
        fiatTransactionFee,
      }),
    },
    {
      key: '3',
      disabled: true,
      label: TabbarLabelRender({
        key: '3',
        title: t('BORROW_FIAT_MODAL_TAB_SETUP_COLLATERAL_TITLE'),
      }),
      children: ModalBorrowFiatCollateralComponent({
        detail: { ...tab, fiatTransactionFee },
        next: (data: any) =>
          setTab({
            ...tab,
            ...data,
            active: '4',
          }),
        back: () =>
          setTab({
            ...tab,
            active: '2',
          }),
        provider,
        selectedChain,
      }),
    },
    {
      key: '4',
      disabled: true,
      label: TabbarLabelRender({
        key: '4',
        title: t('BORROW_FIAT_MODAL_TAB_SETUP_CONFIRM_TITLE'),
      }),
      children: ModalBorrowFiatConfirmComponent({
        detail: tab,
        next: () => {
          _handleOk(tab);
          setTab({
            active: '1',
          });
        },
        back: () =>
          setTab({
            ...tab,
            active: '3',
          }),
      }),
    },
  ];

  const getInitData = async () => {
    try {
      // const res = (await service.getCountries()) as any;
      const res = [
        {
          countryCode: 'es',
          countrySupportByProduct: ['giftcard', 'bankwire'],
          countryName: 'US',
          currency: 'EUR',
        },
      ];
      if (res) {
        setCountryList(res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getInitData();
  }, []);

  console.log('tab: ', tab);
  return (
    <Modal
      wrapClassName={cssClass['modal-borrow-fiat-wrapper']}
      title={t('BORROW_FIAT_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      width={1018}
      footer={null}>
      <Tabs activeKey={tab.active} items={items} onChange={onChange} renderTabBar={renderTabBar} />
    </Modal>
  );
}
