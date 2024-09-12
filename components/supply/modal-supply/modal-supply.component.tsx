import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import cssClass from './modal-supply.component.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal, Form } from 'antd';
import type { FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import { computeWithMinThreashold } from '@/utils/percent.util';
import BigNumber from 'bignumber.js';
import { getGasPrice } from '@wagmi/core'
import { createPublicClient, http } from 'viem'
import { estimateGas } from '@wagmi/core'
import { parseEther } from 'viem'
import { config as ConfigWagmi } from '@/libs/wagmi.lib';

type FieldType = {
  amount?: any;
};

export default function ModalSupplyComponent({
  isModalOpen,
  handleCancel,
  handleOk,
  asset
}: any) {
  const { t } = useTranslation('common');

  const [_isApproved, _setIsApproved] = useState(false);
  const [_isPending, _setIsPending] = useState(false);
  const [gas, setGas] = useState(0);

  const handleApprove = useCallback(() => {
    _setIsApproved(true);
  }, []);

  const _handleOk = useCallback(() => {
    _setIsApproved(false)
    handleOk();
  }, [])

  const _handleCancel = useCallback(() => {
    _setIsApproved(false)
    _setIsPending(false)
    handleCancel();
  }, [])

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(() => {
      if (_isApproved) {
        _handleOk();
      } else {
        handleApprove();
      }
      _setIsPending(false)
    }, 1000);
  };

  const fetchGasToEstimate = async () => {
    try {
      const gasLimit = await estimateGas(ConfigWagmi, {
        to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
        value: parseEther('0.01'),
      })
      console.log(gasLimit, 'gasLimit')

      const gasPrice = await getGasPrice(ConfigWagmi)
      console.log('gasPrice: ', gasPrice)

      const result = new BigNumber(gasPrice.toString()).times(gasLimit.toString()).dividedBy(10 ** 18).toString();
      console.log('gas: ', result)

    } catch (error) {
      console.error('fetch gas to estimate failed: ', error)
    }
  }

  useEffect(() => {
    fetchGasToEstimate();
    const interval_ = setInterval(() => {
      fetchGasToEstimate();
    }, 30000);

    return (() => {
      clearInterval(interval_)
    })
  }, [])

  return (
    <Modal
      wrapClassName={cssClass['supply-modal-wrapper']}
      title={t('SUPPLY_MODAL_TITLE', {
        token: asset?.name,
      })}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <Form onFinish={onFinish}>
        {(_, formInstance) => {
          const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
          const amount = formInstance.getFieldValue('amount')
          const max = new BigNumber(asset?.wallet_balance_in_wei).dividedBy(10 ** asset?.decimals).toNumber()
          const handleMaxInput = () => {
            formInstance.setFields([
              {
                name: "amount",
                value: max,
                errors: []
              },
            ]);

            formInstance
              .validateFields()
              .then((e) => { })
              .catch((e) => { })
          }

          return (
            <div className="supply-modal-container">
              <div className="supply-modal-container__input">
                <div className="supply-modal-container__input__title">
                  {t('SUPPLY_MODAL_INPUT_AMOUNT')}
                </div>
                <div className="supply-modal-container__input__control">
                  <Form.Item name="amount" help="" style={{
                    width: '100%'
                  }}
                    validateFirst
                    rules={[{ max: max, type: 'number', message: t('SUPPLY_MODAL_VALIDATE_INSUFFICIENT_BALANCE') }, {
                      required: true,
                      message: t('SUPPLY_MODAL_VALIDATE_REQUIRE_AMOUNT')
                    }]}
                  >
                    <InputNumber
                      placeholder={t('SUPPLY_MODAL_INPUT_PLACEHOLDER')}
                      className="supply-modal-container__input__control__amount"
                      controls={false}
                      addonAfter={
                        <div className="supply-modal-container__input__control__amount__token">
                          <Image
                            src={`/images/common/${asset?.symbol}.png`}
                            alt="USDT"
                            width={24}
                            height={24}
                            style={{
                              height: 24,
                            }}
                          />
                          {asset?.symbol}
                        </div>
                      }
                    />
                  </Form.Item>

                  <div className="supply-modal-container__input__control__price">
                    ≈ ${new BigNumber(asset?.price || 0).times(amount || 0).toFormat(2)}
                    <Button type="link" className="supply-modal-container__input__control__price__max" onClick={handleMaxInput}>
                      {t('SUPPLY_MODAL_MAX')}
                    </Button>
                  </div>
                </div>
                <div className='flex justify-between w-full'>
                  <div className="supply-modal-container__input__balance">
                    {t('SUPPLY_MODAL_WALLET_BALANCE')}: {asset?.wallet_balance} {asset?.symbol}
                  </div>
                  <span className="supply-modal-container__input__error">{formInstance.getFieldError('amount')[0]}</span>
                </div>

              </div>
              <div className="supply-modal-container__overview">
                <div className="supply-modal-container__overview__title">
                  {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_TITLE')}
                </div>
                <div className="supply-modal-container__overview__apy">
                  <div className="supply-modal-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_APY')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="supply-modal-container__overview__apy__value">
                    <span className="text-white font-bold">{computeWithMinThreashold(asset?.apy, '')}</span>%
                  </span>
                </div>
              </div>
              <div className="supply-modal-container__overview">
                <div className="supply-modal-container__overview__apy">
                  <div className="supply-modal-container__overview__apy__title">
                    {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_GAS_FEE')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  <span className="supply-modal-container__overview__apy__value text-sm">
                    $<span className="text-white">0.02</span>
                  </span>
                </div>
              </div>
              <div className="supply-modal-container__action">
                {_isApproved ? (
                  <Button
                    type="primary"
                    loading={_isPending}
                    disabled={isNotValidForm}
                    htmlType='submit'
                    className={twMerge('btn-primary-custom')}
                    block>
                    {t('SUPPLY_MODAL_SUPPLY_BUTTON', {
                      token: 'USDT',
                    })}
                  </Button>
                ) : (
                  <div className="supply-modal-container__action__approve">
                    <div className="supply-modal-container__action__approve__helper">
                      <QuestionCircleIcon />
                      <Link
                        className="supply-modal-container__action__approve__helper__link"
                        href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                        target="_blank">
                        {t('SUPPLY_MODAL_APPROVE_EXPLAIN')}
                      </Link>
                    </div>

                    <Button
                      loading={_isPending}
                      type="primary"
                      htmlType='submit'
                      disabled={isNotValidForm || !amount}
                      className={twMerge('btn-primary-custom', 'mt-4')}
                      block>
                      {t('SUPPLY_MODAL_APPROVE', {
                        token: 'USDT',
                      })}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Form>
    </Modal>
  );
}
