import React, { useCallback, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import cssClass from './modal-withdraw.component.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Modal, Form } from 'antd';
import type { FormProps } from 'antd';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import BigNumber from 'bignumber.js';

import { formatUnits, parseUnits } from 'ethers';
import { useNetworkManager, useUserManager } from '@/hooks/supply.hook';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook'
import supplyBE from '@/utils/backend/supply';
import { useWithdrawFee } from '@/hooks/provider.hook'
import { computeWithMinThreashold } from '@/utils/percent.util';
import { toCurrency } from '@/utils/bignumber.util'

type FieldType = {
  amount?: any;
};

export default function ModalWithdrawComponent({
  isModalOpen,
  handleCancel,
  handleOk,
  handleError,
  asset
}: any) {
  const { t } = useTranslation('common');

  console.log('withdraw asset: ', asset)
  const [_isApproved, _setIsApproved] = useState(false);

  const [form] = Form.useForm();
  const [_isPending, _setIsPending] = useState(false);
  // TODO: need to store using redux
  const [networkPrice, setNetworkPrice] = useState<any>(0)
  const [networks] = useNetworkManager()
  const { selectedChain } = useConnectedNetworkManager();
  const [provider] = useProviderManager();
  const [user] = useUserManager();

  const poolUserData = useMemo(() => {
    if (user?.supplyMap && asset?.symbol) {
      return user.supplyMap.get(asset.symbol);
    }
    return {}
  }, [asset, user])

  console.log('poolUserData: ', poolUserData)

  const withdrawAvailable = useMemo(() => {
    return new BigNumber(poolUserData?.withdraw_available || 0).dividedBy(10 ** asset?.decimals)
  }, [poolUserData?.withdraw_available, asset?.decimals])

  const poolUtilization = useMemo(() => {
    return Number(poolUserData?.pool_utilization) * 100;
  }, [poolUserData?.pool_utilization])

  const selectedNetwork = useMemo(() => {
    return networks?.get(selectedChain?.id) || {}
  }, [networks, selectedChain])

  const [fee, estimateGasForWithdraw] = useWithdrawFee(provider);

  const feeWithPrice = useMemo(() => {
    const decimals = selectedChain?.nativeCurrency?.decimals || 18
    return new BigNumber(fee).multipliedBy(networkPrice).dividedBy(10 ** decimals).toFormat(2)
  }, [fee, networkPrice, selectedChain])

  const _handleOk = useCallback(async (amount: any) => {
    const result = await provider.withdraw({ amount, contractAddress: asset?.pool_address, })

    handleOk({
      txUrl: `${selectedNetwork?.txUrl}tx/${result}`,
      message: t('WITHDRAW_SUCCESS_MODAL_MESSAGE', {
        token: asset?.symbol,
        amount: toCurrency(formatUnits(amount, asset?.decimals), '')
      })
    });
  }, [provider, asset, selectedNetwork])

  const _handleCancel = useCallback(() => {
    _setIsPending(false)
    form.resetFields();
    form
      .validateFields()
      .then(e => { })
      .catch(e => { });
    handleCancel();
  }, [])

  const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
    _setIsPending(true);
    setTimeout(async () => {
      try {
        const _amount = parseUnits(data.amount.toString(), asset.decimals)
        await _handleOk(_amount);
      } catch (error: any) {
        console.error('submit form failed: ', error)
        handleError({
          code: error?.code,
          message: error?.message
        })
      } finally {
        form.resetFields();
        _setIsPending(false)
      }
    }, 1000);
  };

  const fetchNetworkPrice = async () => {
    try {
      const result: any = await supplyBE.fetchPrice({
        chainId: selectedChain?.id
      });
      setNetworkPrice(result?.price || 0)
    } catch (error) {
      console.error('fetch network price failed: ', error)
    }
  }

  useEffect(() => {
    estimateGasForWithdraw({
      network: selectedNetwork,
      chain: selectedChain,
      contractAddress: asset?.pool_address,
      // TODO: update cardano params
    });
    fetchNetworkPrice();

    const interval_ = setInterval(() => {
      estimateGasForWithdraw({
        network: selectedNetwork,
        chain: selectedChain,
        contractAddress: asset?.pool_address,
        // TODO: update cardano params
      });
    }, 15000);

    return (() => {
      clearInterval(interval_)
    })
  }, [asset?.address, selectedNetwork, selectedChain, provider])

  return (
    <Modal
      wrapClassName={cssClass['withdraw-modal-wrapper']}
      title={t('WITHDRAW_MODAL_TITLE')}
      open={isModalOpen}
      onOk={_handleOk}
      onCancel={_handleCancel}
      footer={null}>
      <Form onFinish={onFinish} form={form}>
        {(_, formInstance) => {
          const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0)
          const amount = formInstance.getFieldValue('amount')

          const max = withdrawAvailable.toNumber()
          const remainingSupply = useMemo(() => {
            const result = new BigNumber(asset?.supply_balance_in_wei || 0).dividedBy(10 ** asset?.decimals).minus(new BigNumber(amount || 0));
            return toCurrency(result.toString(), '')
          }, [amount, asset?.supply_balance])

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
            <div className="withdraw-modal-container">
              <div className="withdraw-modal-container__supply-overview">
                <div className="withdraw-modal-container__supply-overview__container">
                  <div className="withdraw-modal-container__supply-overview__container__title">
                    {t('WITHDRAW_MODAL_OVERVIEW_TITLE')}
                  </div>
                  <div className="withdraw-modal-container__supply-overview__container__alert">
                    {t('WITHDRAW_MODAL_OVERVIEW_NOTE')}
                  </div>
                  <div className="withdraw-modal-container__supply-overview__container__values">
                    <div className="withdraw-modal-container__supply-overview__container__values__item">
                      <span>{t('WITHDRAW_MODAL_OVERVIEW_MY_SUPPLY')}</span>
                      <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                        {asset?.supply_balance}
                        <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                          {asset?.symbol}
                        </span>
                      </span>
                    </div>
                    <div className="withdraw-modal-container__supply-overview__container__values__item">
                      <span>{t('WITHDRAW_MODAL_OVERVIEW_POOL_UTILIZATION')}</span>
                      <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                        {computeWithMinThreashold(poolUtilization, '')}
                        <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                          %
                        </span>
                      </span>
                    </div>
                    <div className="withdraw-modal-container__supply-overview__container__values__item">
                      <span>{t('WITHDRAW_MODAL_OVERVIEW_AVAILABLE_TO_WITHDRAW')}</span>
                      <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                        {toCurrency(withdrawAvailable.toString(), '')}
                        <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                          {asset?.symbol}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="withdraw-modal-container__input">
                <div className="withdraw-modal-container__input__title">
                  {t('WITHDRAW_MODAL_OVERVIEW_AMOUNT')}
                </div>
                <div className="withdraw-modal-container__input__control">
                  <Form.Item name="amount" help="" rules={[
                    { max: max, type: 'number', message: t('WITHDRAW_MODAL_VALIDATE_EXCEED_WITHDRAW_LIMIT') },
                  ]} className='w-full'>
                    <InputNumber
                      placeholder={t('WITHDRAW_MODAL_INPUT_AMOUNT')}
                      className="withdraw-modal-container__input__control__amount"
                      controls={false}
                      addonAfter={
                        <div className="withdraw-modal-container__input__control__amount__token">
                          <Image
                            src={`/images/common/${asset?.symbol}.png`}
                            alt={asset?.name}
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
                  <div className="withdraw-modal-container__input__control__price">
                    ≈ ${new BigNumber(asset?.price || 0).times(amount || 0).toFormat(2)}
                    <Button
                      type="link"
                      onClick={handleMaxInput}
                      className="withdraw-modal-container__input__control__price__max">
                      {t('WITHDRAW_MODAL_INPUT_MAX')}
                    </Button>
                  </div>
                </div>
                <div className="withdraw-modal-container__input__error">{formInstance.getFieldError('amount')[0]}</div>
              </div>
              <div className="withdraw-modal-container__overview">
                <div className="withdraw-modal-container__overview__title">
                  {t('WITHDRAW_MODAL_OVERVIEW_TITLE')}
                </div>
                <div className="withdraw-modal-container__supply-overview__container__values">
                  <div className="withdraw-modal-container__supply-overview__container__values__item">
                    <span>{t('WITHDRAW_MODAL_OVERVIEW_REMAINING_SUPPLY')}</span>
                    <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                      {remainingSupply}
                      <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                        {asset?.symbol}
                      </span>
                    </span>
                  </div>
                  <div className="withdraw-modal-container__supply-overview__container__values__item">
                    <span>{t('WITHDRAW_MODAL_OVERVIEW_REWARD_EARNED')}</span>
                    <span className="withdraw-modal-container__supply-overview__container__values__item__value">
                      {asset?.earned_reward}
                      <span className="withdraw-modal-container__supply-overview__container__values__item__value__unit">
                        {asset?.symbol}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="withdraw-modal-container__overview">
                <div className="withdraw-modal-container__overview__apy">
                  <div className="withdraw-modal-container__overview__apy__title">
                    {t('WITHDRAW_MODAL_OVERVIEW_GAS_FEE')}
                    <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                      <span className="cursor-pointer">
                        <InfoCircleIcon className="" />
                      </span>
                    </Tooltip>
                  </div>
                  {fee != 0 && amount > 0 ? <span className="withdraw-modal-container__overview__apy__value text-sm">
                    $<span className="text-white">{feeWithPrice}</span>
                  </span> :
                    <span className="withdraw-modal-container__overview__apy__value text-sm">
                      --
                    </span>
                  }
                </div>
              </div>
              <div className="withdraw-modal-container__action">
                <Button
                  type="primary"
                  loading={_isPending}
                  disabled={isNotValidForm || !amount}
                  htmlType='submit'
                  className={twMerge('btn-primary-custom')}
                  block>
                  {t('WITHDRAW_MODAL_WITHDRAW_SUPPLY')}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </Modal>
  );
}
