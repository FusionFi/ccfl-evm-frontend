import React, { useState } from 'react';
import ModalComponent from '@/components/common/modal.component';
import { InputNumber, Form } from 'antd';
import Image from 'next/image';
import { Button, Tooltip, Select, Checkbox } from 'antd';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { COLLATERAL_TOKEN } from '@/constants/common.constant';
import TransactionSuccessComponent from '@/components/borrow/transaction-success.component';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
  currentToken: string;
}

export default function ModalBorrowComponent({
  isModalOpen,
  handleCancel,
  currentToken,
}: ModalBorrowProps) {
  const [form] = Form.useForm();

  const [token, setToken] = useState(COLLATERAL_TOKEN[0].name);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState();
  const [isYield, setYield] = useState(false);
  const [step, setStep] = useState(0);

  const handleChange = (value: any) => {
    setToken(value);
  };
  const handleValue = (value: any) => {
    setValue(value);
  };

  const handleSubmit = () => {
    console.log('value', value);
  };

  const handleYield = (e: any) => {
    setYield(e.target.checked);
  };

  const renderTitle = () => {
    if (step === 1) {
      return 'All done!';
    }
    return `Borrow ${currentToken?.toUpperCase()}`;
  };

  return (
    <Form form={form} name="borrow" autoComplete="off">
      <div>
        <ModalComponent
          title={renderTitle()}
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          closeIcon={step !== 0 ? false : <CloseOutlined />}>
          {step === 0 && (
            <div className="modal-borrow-content">
              <div className="px-6 py-4 ">
                <div className="modal-borrow-title mb-2 ">Borrow Amount</div>
                <div className={`modal-borrow-amount ${loading ? 'loading' : ''}`}>
                  <div className="flex items-center">
                    {/* <Form.Item
                    name="input"
                    rules={[
                      {
                        required: true,
                        // type: 'regexp',
                        // pattern: new RegExp('^[0-9]*$'),
                        message: 'Wrong format!',
                      },
                    ]}>
                    <InputNumber
                      placeholder="Enter amount"
                      className="flex-1"
                      controls={false}
                      onChange={handleValue}
                    />
                  </Form.Item> */}
                    <InputNumber
                      placeholder="Enter amount"
                      className="flex-1"
                      controls={false}
                      onChange={handleValue}
                    />
                    <div className="flex">
                      <Image
                        src={`/images/common/${currentToken}.png`}
                        alt={currentToken}
                        width={24}
                        height={24}
                      />
                      <span className="modal-borrow-token ml-2">{currentToken?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="modal-borrow-usd">≈ $0.00</span>
                    <span className="modal-borrow-max ">Max</span>
                  </div>
                </div>
              </div>
              <div className="modal-borrow-overview">
                <div className="modal-borrow-sub-title">Loan overview</div>
                <div className="flex justify-between items-center">
                  <span className="modal-borrow-sub-content">
                    Variable APR
                    <sup>
                      <Tooltip placement="top" title={'a'} className="ml-1">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </sup>
                  </span>
                  <div className="modal-borrow-percent">
                    <span>2.5</span>
                    <span>%</span>
                  </div>
                </div>
              </div>
              <div className="modal-borrow-collateral">
                <div className="modal-borrow-sub-title">Collateral Setup</div>
                <div className="flex justify-between items-center  mb-2">
                  <span className="modal-borrow-sub-content">
                    Collateral token
                    <sup>
                      <Tooltip placement="top" title={'a'} className="ml-1">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </sup>
                  </span>
                  <Select
                    defaultValue={{
                      value: token,
                      label: token,
                    }}
                    options={COLLATERAL_TOKEN.map((item: any) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                    onChange={handleChange}
                    suffixIcon={<DownOutlined />}
                    popupClassName="modal-borrow-select"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="modal-borrow-sub-content">Collateral amount </div>
                  <div className="modal-borrow-value">
                    <span>0.00</span>
                    <span className="ml-1">{token}</span>
                  </div>
                </div>
                <div className="modal-borrow-value-usd">$0.00</div>
              </div>
              <div className="modal-borrow-gas">
                <div className="modal-borrow-sub-content">
                  Gas fee
                  <sup>
                    <Tooltip placement="top" title={'a'} className="ml-1">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </sup>
                </div>
                <div className="modal-borrow-gas-value">
                  <span>$</span>
                  <span className="ml-1">0.00</span>
                </div>
              </div>
              <div className="modal-borrow-footer">
                {/* <div className='approve-inner'>
                <div className="modal-borrow-question">
                  <Tooltip placement="top" title={'a'}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                  Why do I need to approve?
                </div>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={false}
                    className="w-full"
                    loading={loading}
                    onClick={handleSubmit}>
                    Approve {token} to continue
                  </Button>
                </Form.Item>
              </div>
               */}
                <div>
                  <div className="modal-borrow-yield">
                    <Checkbox onChange={handleYield}>Use my deposit for yield earning </Checkbox>
                  </div>
                  <div className="px-6 py-4">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={false}
                        className="w-full"
                        loading={loading}
                        onClick={handleSubmit}>
                        Deposit {token} to borrow
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <TransactionSuccessComponent
                handleCancel={handleCancel}
                currentToken={currentToken}
              />
            </div>
          )}
        </ModalComponent>
      </div>
    </Form>
  );
}
