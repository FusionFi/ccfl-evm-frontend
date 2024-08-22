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
  if (paymentMethod == PayoutMethod.GiftCode) {
    return <>
      Your gift card of 100.00 USD is ready
    </>
  }

  return <>
    <span>
      You successfully borrowed <span className='modal-borrow-fiat-success-container__status__msg--emphasize'>13,000 USD</span>
    </span>
    <span className='modal-borrow-fiat-success-container__status__msg__note'>
      The loan will be available to you in 3-5 working days
    </span>
  </>
}

const BorrowFiatGiftDetail = () => {
  const [_isPending, _setIsPending] = useState(false)
  const [isUnseal, setIsUnseal] = useState(false)
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

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
      We sent the voucher code to your email or Click the unseal button below to review
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      {isUnseal ? <Input className='modal-borrow-fiat-success-container__detail__content__item__unseal-box' disabled={true} defaultValue="https://costco.gift/v612io872g265423g5" addonAfter={<Tooltip
        visible={isTooltipDisplayed}
        trigger="click"
        title='Copied'
      >
        <Button
          type="link"
          size="small"
          onClick={copyAddress}
          icon={<CopyOutlined className='text-white'/>}
        ></Button>
      </Tooltip>} />
        : <Button
          loading={_isPending}
          type="primary"
          onClick={handleUnseal}
          className={twMerge('btn-primary-custom')}
          block>
          Click to Unseal
        </Button>
      }
    </div>
  </>
}

const BorrowFiatDetail = ({ paymentMethod }: any) => {
  if (paymentMethod == PayoutMethod.GiftCode) {

    return <BorrowFiatGiftDetail />
  }

  return <>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Bank:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Citibank USA
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Acc. Number:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        8876984
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Acc. owner:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        James E. Gunn
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Purpose of Payment:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Gift
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Source of Income:
      </span>
      <span className="modal-borrow-fiat-success-container__detail__content__item__value">
        Salary
      </span>
    </div>
    <div className="modal-borrow-fiat-success-container__detail__content__item">
      <span className="modal-borrow-fiat-success-container__detail__content__item__title">
        Description:
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
            src="/images/common/weth.png"
            alt="weth"
            width={24}
            height={24}
          />
          You deposit 0.22 WETH
        </div>
        <div className='modal-borrow-fiat-success-container__received'>
          <div className='modal-borrow-fiat-success-container__received__title'>
            You have also received
          </div>
          <div className='modal-borrow-fiat-success-container__received__content'>
            4,000 LP-USDT
            <Button type="link">Add to Metamask</Button>
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
