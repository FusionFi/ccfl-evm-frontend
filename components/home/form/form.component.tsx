import cssClass from '@/components/home/form/form.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import { Button, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
export default function FormComponent({ className }: { className?: string }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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
  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Received values of form: ', email);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.formComponent)}>
      <div className={`form-container ${className}`}>
        <Form
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
