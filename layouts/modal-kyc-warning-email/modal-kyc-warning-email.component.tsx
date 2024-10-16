import SafeHtmlComponent from '@/components/common/safe-html.component';
import eventBus from '@/hooks/eventBus.hook';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import cssClass from './modal-kyc-warning-email.component.module.scss';
import { useAuth } from '@/hooks/auth.hook';
import service from '@/utils/backend';
export default function ModalKycWarningEmailComponent({}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycLink, setKycLink] = useState<string>('');

  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  const [auth, updateAuth] = useAuth();
  console.log('🚀 ~ ModalKycWarningEmailComponent ~ auth:', auth);
  /**
   * FUNCTIONS
   */
  const _handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const _handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const onContinue = () => {
    if (kycLink) {
      window.open(kycLink, '_blank');
    }
  };
  const openSignUpModal = () => {
    setIsModalOpen(false);
  };
  const getKycLink = async () => {
    try {
      // TODO get KYC link here
      let rs: any = await service.enctyptus.getKycLink(auth?.access_token);
      console.log('🚀 ~ getKycLink ~ rs:', rs);
      setKycLink(rs?.kycUrl || '');
    } catch (error) {
      console.log('🚀 ~ getKycLink ~ error:', error);
    }
  };
  /**
   * EFFECTS
   */
  useEffect(() => {
    const toggleKycWarningEmailModal = (payload: boolean) => {
      setIsModalOpen(payload);
    };
    eventBus.on('toggleKycWarningEmailModal', toggleKycWarningEmailModal);
    // Cleanup listener on component unmount
    return () => {
      eventBus.off('toggleKycWarningEmailModal', toggleKycWarningEmailModal);
    };
  }, []);
  useEffect(() => {
    getKycLink();
  }, []);
  return (
    <Modal
      wrapClassName={cssClass['kyc-warning-email-modal-wrapper']}
      title={t('KYC_WARNING_EMAIL_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <div className="modal-warning-email-container">
        <div className="modal-warning-email-container__status">
          <Image src="/images/status/email.png" alt="KYC warning email" width={80} height={80} />
          <div className="modal-warning-email__status__msg">
            {t('KYC_WARNING_EMAIL_MODAL_DESCRIPTION_1')}
          </div>
          <div className="user-email">{auth?.email}</div>
          <div className="modal-warning-email__status__msg">
            {t('KYC_WARNING_EMAIL_MODAL_DESCRIPTION_2')}
          </div>
        </div>
        <div className="modal-warning-email-container__action">
          <Button
            onClick={onContinue}
            disabled={!kycLink}
            type="primary"
            className={twMerge('btn-primary-custom')}>
            {t('KYC_WARNING_EMAIL_MODAL_BTN_CONTINUE')}
          </Button>
          <Button
            onClick={_handleCancel}
            type="primary"
            className={twMerge('btn-outline-custom border-none')}>
            {t('KYC_WARNING_EMAIL_MODAL_BTN_GO_BACK')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
