import SafeHtmlComponent from '@/components/common/safe-html.component';
import eventBus from '@/hooks/eventBus.hook';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import cssClass from './modal-signup-success.component.module.scss';
export default function ModalSignUpSuccessComponent({}: any) {
  const { t } = useTranslation('common');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  /**
   * FUNCTIONS
   **/
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
  /**
   * EFFECTS
   */
  useEffect(() => {
    const toggleSignUpSuccessModal = (payload: any) => {
      const { isOpen, email: _email } = payload;
      setIsModalOpen(isOpen);
      setEmail(_email);
    };

    eventBus.on('toggleSignUpSuccessModal', toggleSignUpSuccessModal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('toggleSignUpSuccessModal', toggleSignUpSuccessModal);
    };
  }, []);
  return (
    <Modal
      closeIcon={false}
      wrapClassName={cssClass['modal-signup-success-wrapper']}
      title={t('SIGNUP_SUCCESS_MODAL_TITLE')}
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
            <SafeHtmlComponent
              htmlContent={t('SIGNUP_SUCCESS_MODAL_DESCRIPTION', {
                email: email,
              })}
            />
          </div>
        </div>
        <div className="modal-success-container__action">
          <Button
            onClick={_handleCancel}
            type="primary"
            className={twMerge('btn-default-custom')}
            block>
            {t('SIGNUP_SUCCESS_MODAL_BTN_OK')}
          </Button>
          <Button
            onClick={openSignInModal}
            type="primary"
            className={twMerge('btn-outline-custom border-none')}
            block>
            {t('SIGNUP_SUCCESS_MODAL_BTN_SIGNIN')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
