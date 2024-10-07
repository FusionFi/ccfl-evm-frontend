import { useAuth } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import validator from 'validator';
import * as yup from 'yup';
import cssClass from './modal-signin.component.module.scss';
import service from '@/utils/backend/auth';

interface ModalCollateralProps {}

interface IFormInput {
  email: string;
  password: string;
}

export default function ModalSigninComponent({}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup
          .string()
          .required()
          .test({
            test: value => validator.isEmail(value),
          }),
        password: yup.string().required(),
      }),
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);

      const res = (await service.signIn(data)) as any;
      if (res && res.access_token) {
        updateAuth({
          // userName: data.email.split('@')[0],
          // email: data.email,
          access_token: res.access_token,
        });
      }

      reset();
      setIsVisiblePassword(false);
      setIsModalOpen(false);
      // openSignupCompleteModal(data.email);
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
  const _handleForgotPaswrod = useCallback(() => {
    setIsModalOpen(false);
    eventBus.emit('openForgotModal');
  }, []);

  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openSignInModal = () => {
      setIsModalOpen(true);
    };

    eventBus.on('openSignInModal', openSignInModal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('openSignInModal', openSignInModal);
    };
  }, []);

  return (
    <Modal
      wrapClassName={cssClass['signin-wrapper']}
      title={t('SIGNUP_SUCCESS_MODAL_BTN_SIGNIN')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signup-inner">
          <div className="signup-body">
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
            <div
              className="flex justify-end items-center forgot-password"
              onClick={_handleForgotPaswrod}>
              {t('SIGNIN_FORGOT_PASSWORD')}
            </div>
          </div>
          <div className="signup-footer">
            <Button htmlType="submit" disabled={!isValid} className="w-full" loading={loading}>
              {t('SIGNUP_SUCCESS_MODAL_BTN_SIGNIN')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
