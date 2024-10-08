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
  const [error, setError] = useState() as any;

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
      try {
        const res = (await service.signIn(data)) as any;
        if (res && res.access_token) {
          updateAuth({
            access_token: res.access_token,
            refresh_token: res.refresh_token,
          });
          let res_profile = (await service.getProfile(res.access_token)) as any;
          if (res_profile) {
            updateAuth({
              userName: res_profile.username,
              email: res_profile.email,
              role: res_profile.role,
              encryptus_id: res_profile.encryptus_id,
              kyc_info: res_profile.kyc_info,
            });
          }
          reset();
          setIsVisiblePassword(false);
          setIsModalOpen(false);
          setLoading(false);
        }
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
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
            {error?.message && <div className="error">{error?.message}</div>}
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
