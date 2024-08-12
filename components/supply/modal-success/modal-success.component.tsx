import React, { useCallback } from 'react';
import Link from 'next/link';
import cssClass from './modal-success.component.module.scss';
import { Button } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal } from 'antd';
import { LinkIcon } from '@/components/icons/link.icon';

export default function ModalSuccessComponent({
  isModalOpen,
  handleCancel,
  message
}: any) {
  const { t } = useTranslation('common');

  const _handleCancel = useCallback(() => {
    handleCancel();
  }, [])

  return (
    <Modal
      closeIcon={false}
      wrapClassName={cssClass['modal-success-wrapper']}
      title={t('SUCCESS_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleCancel}
      onCancel={_handleCancel}
      footer={null}>
      <div className="modal-success-container">
        <div className="modal-success-container__status">
          <Image
            src="/images/status/success.png"
            alt="Transaction Success"
            width={80}
            height={80}
          />
          <div className="modal-success-container__status__msg">{message}</div>
        </div>
        <div className="modal-success-container__action">
          <div className="modal-success-container__action__helper">
            <LinkIcon />
            <Link
              className="modal-success-container__action__helper__link"
              href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
              target="_blank">
              {t('SUCCESS_MODAL_REVIEW')}
            </Link>
          </div>

          <Button
            onClick={_handleCancel}
            type="primary"
            className={twMerge('btn-default-custom')}
            block>
            {t('SUCCESS_MODAL_OK')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
