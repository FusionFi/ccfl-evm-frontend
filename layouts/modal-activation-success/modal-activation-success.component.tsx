import eventBus from '@/hooks/eventBus.hook';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import cssClass from './modal-activation-success.component.module.scss';
export default function ModalActivationSuccessComponent({}: any) {
  const { t } = useTranslation('common');

  const [isModalOpen, setIsModalOpen] = useState(false);
  /**
   * FUNCTIONS
   **/
  const _handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const _handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  /**
   * EFFECTS
   */
  useEffect(() => {
    const toggleActivationSuccessModal = (payload: boolean) => {
      setIsModalOpen(payload);
    };

    eventBus.on('toggleActivationSuccessModal', toggleActivationSuccessModal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('toggleActivationSuccessModal', toggleActivationSuccessModal);
    };
  }, []);
  return (
    <Modal
      closeIcon={false}
      wrapClassName={cssClass['modal-activation-success-wrapper']}
      title={t('ACTIVATION_SUCCESS_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
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
          <div className="modal-success-container__status__msg">
            {t('ACTIVATION_SUCCESS_MODAL_DESCRIPTION')}
          </div>
        </div>
        <div className="modal-success-container__action">
          <Button
            onClick={_handleCancel}
            type="primary"
            className={twMerge('btn-primary-custom')}
            block>
            {t('ACTIVATION_SUCCESS_MODAL_BTN_SIGNIN')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
