import React, { useCallback } from 'react';
import Link from 'next/link';
import cssClass from './modal-error.component.module.scss';
import { Button } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal } from 'antd';
import { LinkIcon } from '@/components/icons/link.icon';

export default function ModalErrorComponent({
  isModalOpen,
  handleCancel,
  message,
  code,
  txhash
}: any) {
  const { t } = useTranslation('common');

  console.log('message: ', message)
  const _handleCancel = useCallback(() => {
    handleCancel();
  }, [])

  return (
    <Modal
      closeIcon={false}
      wrapClassName={cssClass['modal-error-wrapper']}
      title={t('ERROR_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleCancel}
      onCancel={_handleCancel}
      footer={null}>
      <div className="modal-error-container">
        <div className="modal-error-container__status">
          <Image
            src="/images/status/error.png"
            alt="Transaction Error"
            width={80}
            height={80}
          />
          <div className="modal-error-container__status__msg">
            {code && <span>Error code: {code}</span>}
            <span>{message}</span>
          </div>
        </div>
        <div className="modal-error-container__action">
          {txhash && <div className="modal-error-container__action__helper">
            <LinkIcon />
            <Link
              className="modal-error-container__action__helper__link"
              href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
              target="_blank">
              {t('ERROR_MODAL_REVIEW')}
            </Link>
          </div>}

          <Button
            onClick={_handleCancel}
            type="primary"
            className={twMerge('btn-default-custom')}
            block>
            {t('ERROR_MODAL_OK')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
