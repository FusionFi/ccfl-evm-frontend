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
import { debounce } from 'lodash';

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
  const [error, setError] = useState() as any;
  const [nonMatch, setNonMatch] = useState(false) as any;
  const [usernameWrong, setUsernameWrong] = useState(false) as any;
  const [emailWrong, setEmailWrong] = useState(false) as any;

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    register,
    reset,
    getValues,
    watch,
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
        confirmPassword: yup.string().required(),
        // .oneOf([yup.ref('password')], ''),
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
      try {
        setLoading(true);
        const res = (await service.signUp(data)) as any;
        if (res) {
          openSignupCompleteModal(data.email);
          resetState();
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
  const openSignupCompleteModal = (email: string) => {
    reset();
    setIsVisiblePassword(false);
    setIsVisibleRePassword(false);
    setIsModalOpen(false);
    setError();
    eventBus.emit('toggleSignUpSuccessModal', { isOpen: true, email: email });
  };
  const resetState = () => {
    reset();
    setIsVisiblePassword(false);
    setIsVisibleRePassword(false);
    setLoading(false);
    setError();
    setNonMatch(false);
    setEmailWrong(false);
    setUsernameWrong(false);
  };

  const name = watch('userName');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const checkUserName = useCallback(
    debounce(async () => {
      try {
        const res_name = (await service.checkUserName(name)) as any;
        console.log(res_name);
        if (res_name == true) {
          setUsernameWrong(true);
        } else if (res_name.data == false) {
          setUsernameWrong(false);
        }
        setError();
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }, 500),
    [name],
  );

  const checkEmail = useCallback(
    debounce(async () => {
      try {
        const res_email = (await service.checkEmail(email)) as any;
        console.log(res_email);

        if (res_email == true) {
          setEmailWrong(true);
        } else if (res_email.data == false) {
          setEmailWrong(false);
        }
        setError();
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }, 500),
    [email],
  );

  const checkPassword = async () => {
    try {
      if (password !== confirmPassword) {
        setNonMatch(true);
      } else {
        setNonMatch(false);
      }
      setError();
    } catch (error) {
      console.log(error);
      setError(error);
    }
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

  useEffect(() => {
    if (isModalOpen && name !== '') {
      checkUserName();
    }
  }, [name]);

  useEffect(() => {
    if (isModalOpen && email !== '') {
      checkEmail();
    }
  }, [email]);

  useEffect(() => {
    if (isModalOpen && password !== '' && confirmPassword !== '') {
      checkPassword();
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (isModalOpen) {
      resetState();
    }
  }, [isModalOpen]);

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
            {error?.message && <div className="error">{error?.message}</div>}
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
            {usernameWrong && <div className="error-line">{t('SIGNUP_USERNAME_ERROR')}</div>}
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
            {emailWrong && <div className="error-line">{t('SIGNUP_EMAIL_ERROR')}</div>}
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
            {nonMatch && <div className="error-line">{t('SIGNUP_PASSWORD_ERROR')}</div>}
          </div>
          <div className="signup-footer">
            <Button
              htmlType="submit"
              disabled={!isValid || nonMatch || usernameWrong || emailWrong}
              className="w-full"
              loading={loading}>
              {t('SIGNUP_BUTTON')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
