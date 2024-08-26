import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import cssClass from './modal-borrow-fiat-success.component.module.scss';
import { Button, Space, Modal, Input, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { LinkIcon } from '@/components/icons/link.icon';
import { CopyOutlined } from '@ant-design/icons';

enum PayoutMethod {
  BankWire = 1,
  GiftCode,
}

const SuccessMessage = ({ paymentMethod }: any) => {
  const { t } = useTranslation('common');

  if (paymentMethod == PayoutMethod.GiftCode) {
    return <>
      {t('BORROW_FIAT_MODAL_SUCCESS_GIFT_CODE_MSG', {
        amount: '100.00',
        currency: 'USD'
      })}
    </>
  }

  return <>
    <span>
      {t('BORROW_FIAT_MODAL_SUCCESS_BANK_WIRE_MSG')} <span className='modal-borrow-fiat-success-container__status__msg--emphasize'>13,000 USD</span>
    </span>
    <span className='modal-borrow-fiat-success-container__status__msg__note'>
      {t('BORROW_FIAT_MODAL_SUCCESS_BANK_WIRE_NOTE')}
    </span>
  </>
}

const BorrowFiatGiftDetail = () => {
  const [_isPending, _setIsPending] = useState(false)
  const [isUnseal, setIsUnseal] = useState(false)
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const { t } = useTranslation('common');

  const handleUnseal = () => {
    _setIsPending(true)
    setTimeout(() => {
      setIsUnseal(true);
      _setIsPending(false)
    }, 1000);
  }

  const copyAddress = (value: any) => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(value).then(() => displayTooltip())
    } else if (document.queryCommandSupported('copy')) {
      const ele = document.createElement('textarea')
      ele.value = value
      document.body.appendChild(ele)
      ele.select()
      document.execCommand('copy')
      document.body.removeChild(ele)
      displayTooltip()
    }
  }

  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  return <>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      {t('BORROW_FIAT_MODAL_SUCCESS_GIFT_UNSEAL_TITLE')}
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      {isUnseal ? <Input className='modal-borrow-fiat-success-container__detail__content__item__unseal-box' disabled={true} defaultValue="https://costco.gift/v612io872g265423g5" addonAfter={<Tooltip
        visible={isTooltipDisplayed}
        trigger="click"
        title={t('BORROW_FIAT_MODAL_SUCCESS_GIFT_UNSEAL_COPIED')}
      >
        <Button
          type="link"
          size="small"
          onClick={copyAddress}
          icon={<CopyOutlined className='text-white' />}
        ></Button>
      </Tooltip>} />
        : <Button
          loading={_isPending}
          type="primary"
          onClick={handleUnseal}
          className={twMerge('btn-primary-custom')}
          block>
          {t('BORROW_FIAT_MODAL_SUCCESS_GIFT_UNSEAL_ACTION')}
        </Button>
      }
    </div>
  </>
}

const BorrowFiatDetail = ({ paymentMethod }: any) => {
  const { t } = useTranslation('common');

  if (paymentMethod == PayoutMethod.GiftCode) {
    return <BorrowFiatGiftDetail />
  }

  return <>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_BANK')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Citibank USA
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_ACC_NUMBER')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        8876984
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_ACC_OWNER')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        James E. Gunn
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_PURPOSE_OF_PAYMENT')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Gift
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_SOURCE_OF_INCOME')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Salary
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        {t('BORROW_FIAT_MODAL_SUCCESS_DESCRIPTION')}:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Self
      </span>
    </div>
  </>
}

export default function ModalBorrowFiatSuccessComponent({
  isModalOpen,
  handleCancel,
  paymentMethod,
  message
}: any) {
  const { t } = useTranslation('common');

  const _handleCancel = useCallback(() => {
    handleCancel();
  }, [])


  return (
    <Modal
      closeIcon={false}
      wrapClassName={cssClass['modal-borrow-fiat-success-wrapper']}
      title={t('SUCCESS_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleCancel}
      onCancel={_handleCancel}
      footer={null}>
      <div className="modal-borrow-fiat-success-container">
        <div className="modal-borrow-fiat-success-container__status">
          <Image
            src="/images/status/success.png"
            alt="Transaction Success"
            width={80}
            height={80}
          />
          <div className="modal-borrow-fiat-success-container__status__msg">
            <SuccessMessage paymentMethod={paymentMethod} />
          </div>
        </div>
        <div className="modal-borrow-fiat-success-container__detail">
          <div className='modal-borrow-fiat-success-container__detail__content'>
            <BorrowFiatDetail paymentMethod={paymentMethod} />
          </div>
        </div>
        <div className='modal-borrow-fiat-success-container__deposit'>
          <Image
            src="/images/common/WETH.png"
            alt="weth"
            width={24}
            height={24}
          />
          {t('BORROW_FIAT_MODAL_SUCCESS_DEPOSIT', {
            amount: '0.22',
            token: 'WETH'
          })}
        </div>
        <div className='modal-borrow-fiat-success-container__received'>
          <div className='modal-borrow-fiat-success-container__received__title'>
            {t('BORROW_FIAT_MODAL_SUCCESS_RECEIVED')}
          </div>
          <div className='modal-borrow-fiat-success-container__received__content'>
            4,000 LP-USDT
            <Button type="link">{t('BORROW_FIAT_MODAL_SUCCESS_ADD_TO_METAMASK')}</Button>
          </div>
        </div>
        <div className="modal-borrow-fiat-success-container__action">
          <div className="modal-borrow-fiat-success-container__action__helper">
            <LinkIcon />
            <Link
              className="modal-borrow-fiat-success-container__action__helper__link"
              href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
              target="_blank">
              {t('SUCCESS_MODAL_REVIEW')}
            </Link>
          </div>

          <Button
            onClick={_handleCancel}
            type="primary"
            className="modal-borrow-fiat-success-container__action__ok"
            block>
            {t('SUCCESS_MODAL_OK')}
          </Button>
        </div>
      </div>
    </Modal >
  );
}
