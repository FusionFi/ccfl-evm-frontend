import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, Modal } from 'antd';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import cssClass from './modal-signup.component.module.scss';
import eventBus from '@/hooks/eventBus.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import validator from 'validator';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/auth.hook';
import service from '@/utils/backend/auth';

interface ModalCollateralProps {}

interface IFormInput {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ModalSignupComponent({}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleRePassword, setIsVisibleRePassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        userName: yup.string().required(),
        email: yup
          .string()
          .required()
          .test({
            test: value => validator.isEmail(value),
          }),
        password: yup.string().required(),
        confirmPassword: yup
          .string()
          .required()
          .oneOf([yup.ref('password')], ''),
      }),
    ),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    setTimeout(async () => {
      setLoading(true);

      let res = (await service.signUp(data)) as any;

      if (res && res.username) {
        updateAuth({
          userName: data.userName,
          email: data.email,
        });
      }
      openSignupCompleteModal(data.email);
      setLoading(false);
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
    setIsModalOpen(false);
  }, []);
  const _handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const openSignupCompleteModal = (email: string) => {
    reset();
    setIsVisiblePassword(false);
    setIsVisibleRePassword(false);
    setIsModalOpen(false);
    eventBus.emit('toggleSignUpSuccessModal', { isOpen: true, email: email });
  };

  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openSignUpModal = () => {
      setIsModalOpen(true);
    };

    eventBus.on('openSignUpModal', openSignUpModal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('openSignUpModal', openSignUpModal);
    };
  }, []);

  return (
    <Modal
      wrapClassName={cssClass['signup-wrapper']}
      title={t('SIGNUP_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signup-inner">
          <div className="signup-body">
            <div className="flex justify-between items-center">
              <span>{t('SIGNUP_USERNAME')}:</span>
              <div className="input-warpper">
                <input
                  {...register('userName')}
                  placeholder={t('SIGNUP_USERNAME_PLACEHOLDER')}
                  type="text"
                  name="userName"
                />
              </div>
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
            <div className="flex justify-between items-center">
              <span>{t('SIGNUP_PASSWORD')}:</span>
              <div className="input-warpper">
                <input
                  {...register('password')}
                  placeholder={t('SIGNUP_PASSWORD_PLACEHOLDER')}
                  type={isVisiblePassword ? 'text' : 'password'}
                  name="password"
                />
                <div onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
                  {isVisiblePassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('SIGNUP_CONFIRM_PASSWORD')}:</span>
              <div className="input-warpper">
                <input
                  {...register('confirmPassword')}
                  placeholder={t('SIGNUP_PASSWORD_PLACEHOLDER')}
                  type={isVisibleRePassword ? 'text' : 'password'}
                  name="confirmPassword"
                />
                <div onClick={() => setIsVisibleRePassword(!isVisibleRePassword)}>
                  {isVisibleRePassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
            </div>
          </div>
          <div className="signup-footer">
            <Button htmlType="submit" disabled={!isValid} className="w-full" loading={loading}>
              {t('SIGNUP_BUTTON')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
