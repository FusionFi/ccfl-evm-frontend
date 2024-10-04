import cssClass from '@/components/home/form/form.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import { Button, Form, Input, InputNumber, notification } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios';

export default function FormComponent({ className }: { className?: string }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    value: '',
    message: '',
  });
  const [api, contextHolder] = notification.useNotification();
  /***
   * FUNCTIONS
   */
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Kiểm tra nếu input không phải là email hợp lệ hoặc không có giá trị thì disable button
    if (!validateEmail(value) || value === '') {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    console.log('Received values of form: ', email);
    try {
      let rs = await axios.post('https://dev-api-ccfl-evm.chainservices.info/user/subscribe', {
        email,
      });
      console.log('🚀 ~ onFinish ~ rs:', rs);
      // api.success({
      //   message: 'Successfully subscribed',
      //   description: 'Your email has been subscribed. Thank you!',
      // });
      setStatus({
        value: 'success',
        message: 'Successfully subscribed!',
      });

      setLoading(false);
    } catch (error: any) {
      console.log('🚀 ~ onFinish ~ error:', error);
      // api.error({
      //   message: 'Error',
      //   description: error?.response?.data?.message || error?.message || error,
      //   duration: 1000,
      // });
      setStatus({
        value: 'error',
        message: error?.response?.data?.message || error?.message || error,
      });
      setLoading(false);
    } finally {
      setTimeout(() => {
        setStatus({
          value: '',
          message: '',
        });
      }, 3000);
    }
  };
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.formComponent)}>
      {contextHolder}
      <div className={`form-container ${className}`}>
        <Form
          initialValues={{ layout: 'vertical' }}
          className="submit-form"
          name="submit-form"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}>
          <Form.Item name="email" label="">
            <Input
              className="input-custom"
              placeholder={t('LANDING_PAGE_FORM_INPUT_PLACEHOLDER')}
              onChange={handleInputChange}
            />{' '}
            <div className={`message ${status.value} ${status.value ? 'fade-in' : 'fade-out'}`}>
              {status.message}
            </div>
            <Button
              disabled={isButtonDisabled}
              className="btn-primary-custom btn-submit"
              type="primary"
              htmlType="submit">
              {loading && <Spin indicator={<LoadingOutlined spin />} size="small" />}{' '}
              {t('LANDING_PAGE_FORM_BTN_TITLE')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
