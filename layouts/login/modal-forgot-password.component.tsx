import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Modal } from 'antd';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import cssClass from './modal-forgot-password.component.module.scss';
import eventBus from '@/hooks/eventBus.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import validator from 'validator';
import { useAuth } from '@/hooks/auth.hook';
import SafeHtmlComponent from '@/components/common/safe-html.component';
import { twMerge } from 'tailwind-merge';
import { CloseOutlined } from '@ant-design/icons';

interface ModalCollateralProps {}

interface IFormInput {
  email: string;
}

export default function ModalForgotPasswordComponent({}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecover, setIsRecover] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    register,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup
          .string()
          .required()
          .test({
            test: value => validator.isEmail(value),
          }),
      }),
    ),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsRecover(true);
      // setIsModalOpen(false);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * HOOKS
   */
  const [auth, updateAuth] = useAuth();

  /**
   * FUNCTIONS
   */
  const _handleCancel = useCallback(() => {
    reset();
    setIsRecover(false);
    setIsModalOpen(false);
  }, []);
  const _handleOk = useCallback(() => {
    reset();
    setIsRecover(false);

    setIsModalOpen(false);
  }, []);
  const openSignInModal = () => {
    reset();
    setIsRecover(false);

    setIsModalOpen(false);
    eventBus.emit('openSignInModal');
  };
  const resetState = () => {
    reset();
    setLoading(false);
  };

  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openForgotModal = () => {
      setIsModalOpen(true);
    };

    eventBus.on('openForgotModal', openForgotModal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('openForgotModal', openForgotModal);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      resetState();
    }
  }, [isModalOpen]);

  return (
    <Modal
      wrapClassName={cssClass[`forgot-password-wrapper`]}
      title={isRecover ? t('FORGOT_PASSWORD_TITLE') : t('SIGNIN_FORGOT_PASSWORD')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      closeIcon={isRecover ? false : <CloseOutlined />}
      className="non-close"
      footer={null}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isRecover ? (
          <div className="signup-inner">
            <div className="signup-body">
              <div className="flex justify-between items-center forgot-password">
                {t('FORGOT_PASSWORD_CONTENT')}
              </div>
              <div className="flex justify-between items-center">
                <span>{t('SIGNUP_EMAIL')}:</span>
                <div className="input-warpper">
                  <input
                    {...register('email')}
                    placeholder={t('SIGNUP_EMAIL_PLACEHOLDER')}
                    type="text"
                    name="email"
                  />
                </div>
              </div>
            </div>
            <div className="signup-footer">
              <Button htmlType="submit" disabled={!isValid} className="w-full" loading={loading}>
                {t('SIGNUP_SUCCESS_MODAL_BTN_SIGNIN')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="modal-success-container">
            <div className="modal-success-container__status">
              <div className="modal-success-container__status__msg">
                <SafeHtmlComponent
                  htmlContent={t('FORGOT_PASSWORD_RECOVER', {
                    email: getValues('email'),
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
        )}
      </form>
    </Modal>
  );
}
