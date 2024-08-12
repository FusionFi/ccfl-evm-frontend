import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import cssClass from './modal-withdraw.component.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';


export default function ModalWithdrawComponent({
  isModalOpen,
  handleCancel,
  handleOk
}: any) {
  const { t } = useTranslation('common');

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);

  const handleApprove = useCallback(() => {
    _setIsPending(true);
    setTimeout(() => {
      _setIsPending(false);
      _setIsApproved(true);
    }, 1000);
  }, []);

  const _handleOk = useCallback(() => {
    handleOk();
  }, [])

  const _handleCancel = useCallback(() => {
    _setIsApproved(false)
    handleCancel();
  }, [])

  return (
    <Modal
      wrapClassName={cssClass['withdraw-modal-wrapper']}
      title={t('WITHDRAW_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <div className="withdraw-modal-container">
        <div className="withdraw-modal-container__supply-overview">
          <div className="withdraw-modal-container__supply-overview__container">
            <div className="withdraw-modal-container__supply-overview__container__title">
              {t('WITHDRAW_MODAL_OVERVIEW_TITLE')}
            </div>
            <div className="withdraw-modal-container__supply-overview__container__alert">
              {t('WITHDRAW_MODAL_OVERVIEW_NOTE')}
            </div>
            <div className="withdraw-modal-container__supply-overview__container__values">
              <div className="withdraw-modal-container__supply-overview__container__values__item">
                <span>{t('WITHDRAW_MODAL_OVERVIEW_MY_SUPPLY')}</span>
                <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                  45,000.00
                  <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                    USDT
                  </span>
                </span>
              </div>
              <div className="withdraw-modal-container__supply-overview__container__values__item">
                <span>{t('WITHDRAW_MODAL_OVERVIEW_POOL_UTILIZATION')}</span>
                <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                  90
                  <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                    %
                  </span>
                </span>
              </div>
              <div className="withdraw-modal-container__supply-overview__container__values__item">
                <span>{t('WITHDRAW_MODAL_OVERVIEW_AVAILABLE_TO_WITHDRAW')}</span>
                <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                  4,500.00
                  <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                    USDT
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="withdraw-modal-container__input">
          <div className="withdraw-modal-container__input__title">
            {t('WITHDRAW_MODAL_OVERVIEW_AMOUNT')}
          </div>
          <div className="withdraw-modal-container__input__control">
            <InputNumber
              placeholder={t('WITHDRAW_MODAL_INPUT_AMOUNT')}
              className="withdraw-modal-container__input__control__amount"
              controls={false}
              addonAfter={
                <div className="withdraw-modal-container__input__control__amount__token">
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
            <div className="withdraw-modal-container__input__control__price">
              ≈ $4,000.00
              <Button
                type="link"
                className="withdraw-modal-container__input__control__price__max">
                {t('WITHDRAW_MODAL_INPUT_MAX')}
              </Button>
            </div>
          </div>
        </div>
        <div className="withdraw-modal-container__overview">
          <div className="withdraw-modal-container__overview__title">
            {t('WITHDRAW_MODAL_OVERVIEW_TITLE')}
          </div>
          <div className="withdraw-modal-container__supply-overview__container__values">
            <div className="withdraw-modal-container__supply-overview__container__values__item">
              <span>{t('WITHDRAW_MODAL_OVERVIEW_REMAINING_SUPPLY')}</span>
              <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                45,000.00
                <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                  USDT
                </span>
              </span>
            </div>
            <div className="withdraw-modal-container__supply-overview__container__values__item">
              <span>{t('WITHDRAW_MODAL_OVERVIEW_REWARD_EARNED')}</span>
              <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                45,000.00
                <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                  USDT
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="withdraw-modal-container__overview">
          <div className="withdraw-modal-container__overview__apy">
            <div className="withdraw-modal-container__overview__apy__title">
              {t('WITHDRAW_MODAL_OVERVIEW_GAS_FEE')}
              <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                <span className="cursor-pointer">
                  <InfoCircleIcon className="" />
                </span>
              </Tooltip>
            </div>
            <span className="withdraw-modal-container__overview__apy__value text-sm">
              $<span className="text-white">0.02</span>
            </span>
          </div>
        </div>
        <div className="withdraw-modal-container__action">
          {_isApproved ? (
            <Button
              type="primary"
              loading={_isPending}
              onClick={_handleOk}
              className={twMerge('btn-primary-custom')}
              block>
              {t('WITHDRAW_MODAL_WITHDRAW_SUPPLY')}
            </Button>
          ) : (
            <div className="withdraw-modal-container__action__approve">
              <div className="withdraw-modal-container__action__approve__helper">
                <QuestionCircleIcon />
                <Link
                  className="withdraw-modal-container__action__approve__helper__link"
                  href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                  target="_blank">
                  {t('WITHDRAW_MODAL_APPROVE_EXPLAIN')}
                </Link>
              </div>

              <Button
                loading={_isPending}
                onClick={handleApprove}
                type="primary"
                className={twMerge('btn-primary-custom', 'mt-4')}
                block>
                {t('WITHDRAW_MODAL_APPROVE', {
                  token: 'USDT',
                })}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
