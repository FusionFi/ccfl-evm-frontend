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

interface ModalCollateralProps {}

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function ModalCollateralComponent({}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(true);
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
        username: yup.string().required(),
        email: yup
          .string()
          .required()
          .test({
            test: value => validator.isEmail(value),
          }),
        password: yup.string().required(),
        confirm_password: yup.string().required(),
      }),
    ),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      openSignupCompleteModal(data.email);
    }, 1000);
  };

  const [loading, setLoading] = useState<boolean>(false);

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
                {/* <Input
                  {...register('username')}
                  placeholder={t('SIGNUP_USERNAME_PLACEHOLDER')}
                  className=""
                  // onChange={(e: any) => {
                  //   setValue('username', e.target.value);
                  // }}
                /> */}
                <input
                  {...register('username')}
                  placeholder={t('SIGNUP_USERNAME_PLACEHOLDER')}
                  type="text"
                  name="username"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('SIGNUP_EMAIL')}:</span>
              <div className="input-warpper">
                {/* <Input
                  {...register('email')}
                  placeholder={t('SIGNUP_EMAIL_PLACEHOLDER')}
                  className=""
                  onChange={(e: any) => {
                    setValue('email', e.target.value);
                  }}
                /> */}
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
                {/* <Input.Password
                  {...register('password')}
                  placeholder={t('SIGNUP_PASSWORD_PLACEHOLDER')}
                  className=""
                  onChange={(e: any) => {
                    setValue('password', e.target.value);
                  }}
                  visibilityToggle={{
                    visible: isVisiblePassword,
                    onVisibleChange: setIsVisiblePassword,
                  }}
                /> */}
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
                {/* <Input.Password
                  {...register('confirm_password')}
                  placeholder={t('SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER')}
                  className=""
                  onChange={(e: any) => {
                    setValue('confirm_password', e.target.value);
                  }}
                  visibilityToggle={{
                    visible: isVisibleRePassword,
                    onVisibleChange: setIsVisibleRePassword,
                  }}
                /> */}
                <input
                  {...register('confirm_password')}
                  placeholder={t('SIGNUP_PASSWORD_PLACEHOLDER')}
                  type={isVisibleRePassword ? 'text' : 'password'}
                  name="confirm_password"
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
