import SafeHtmlComponent from '@/components/common/safe-html.component';
import eventBus from '@/hooks/eventBus.hook';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import cssClass from './modal-kyc-warning.component.module.scss';
export default function ModalKycWarningComponent({}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * HOOKS
   */
  const { t } = useTranslation('common');

  /**
   * FUNCTIONS
   */
  const _handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const _handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const openSignInModal = () => {
    setIsModalOpen(false);
    eventBus.emit('openSignInModal');
  };
  const openSignUpModal = () => {
    setIsModalOpen(false);
    eventBus.emit('openSignUpModal');
  };
  /**
   * EFFECTS
   */
  useEffect(() => {
    const toggleKycWarningModal = (payload: boolean) => {
      setIsModalOpen(payload);
    };
    eventBus.on('toggleKycWarningModal', toggleKycWarningModal);
    // Cleanup listener on component unmount
    return () => {
      eventBus.off('toggleKycWarningModal', toggleKycWarningModal);
    };
  }, []);
  return (
    <Modal
      wrapClassName={cssClass['kyc-warning-modal-wrapper']}
      title={t('KYC_WARNING_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <div className="modal-success-container">
        <div className="modal-success-container__status">
          <Image src="/images/status/user-tag.png" alt="KYC warning" width={80} height={80} />
          <div className="modal-success-container__status__msg">
            {t('KYC_WARNING_MODAL_DESCRIPTION')}
          </div>
        </div>
        <div className="modal-success-container__action">
          <Button
            onClick={openSignUpModal}
            type="primary"
            className={twMerge('btn-primary-custom')}
            block>
            {t('KYC_WARNING_MODAL_BTN_SIGNUP')}
          </Button>
          <Button
            onClick={openSignInModal}
            type="primary"
            className={twMerge('btn-outline-custom border-none')}
            block>
            <SafeHtmlComponent htmlContent={t('KYC_WARNING_MODAL_BTN_SIGNIN')} />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
