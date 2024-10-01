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
import supplyBE from '@/utils/backend/supply';
import { formatUnits, parseUnits } from 'ethers';
import { useNetworkManager } from '@/hooks/supply.hook';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';

import { useAllowance, useApproval, useSupply, useTxFee } from '@/hooks/provider.hook';

type FieldType = {
  amount?: any;
};

export default function ModalSupplyComponent({ isModalOpen, handleCancel, handleOk, asset }: any) {
  const { t } = useTranslation('common');

  const [form] = Form.useForm();
  const [_isPending, _setIsPending] = useState(false);
  // TODO: need to store using redux
  const [networkPrice, setNetworkPrice] = useState<any>(0);
  const [networks] = useNetworkManager();
  const { selectedChain } = useConnectedNetworkManager();
  const [provider] = useProviderManager();

  const selectedNetwork = useMemo(() => {
    return networks?.get(selectedChain?.id) || {};
  }, [networks, selectedChain]);

  const [fee, estimateNormalTxFee] = useTxFee(provider);

  const [allowance, refetchAllowance] = useAllowance(provider);
  const [approve] = useApproval(provider);

  const [supply] = useSupply(provider);

  const handleApprove = useCallback(
    async (value: any) => {
      await approve({
        contractAddress: asset?.address,
        spender: asset?.pool_address,
        value: value,
        // TODO: update cardano params
      });
      refetchAllowance({
        network: selectedNetwork,
        chain: selectedChain,
        contractAddress: asset?.address,
        owner: provider?.account,
        spender: asset?.pool_address,
        // TODO: update cardano params
      });
    },
    [approve, asset, refetchAllowance, selectedNetwork, selectedChain, provider],
  );

  const _handleOk = useCallback(
    async (amount: any) => {
      const result = await supply({ amount, contractAddress: asset?.pool_address });
      handleOk({
        amount: formatUnits(amount, asset?.decimals),
        txUrl: `${selectedNetwork?.txUrl}tx/${result}`,
        token: asset?.symbol,
      });
    },
    [asset, selectedNetwork, supply],
  );

  const _handleCancel = useCallback(() => {
    _setIsPending(false);
    form.resetFields();
    handleCancel();
  }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = data => {
    _setIsPending(true);
    setTimeout(async () => {
      try {
        const _amount = parseUnits(data.amount.toString(), asset.decimals);
        const isNotNeedToApprove = new BigNumber(allowance).isGreaterThanOrEqualTo(
          _amount.toString(),
        );

        if (isNotNeedToApprove) {
          await _handleOk(_amount);
        } else {
          await handleApprove(_amount.toString());
        }
      } catch (error) {
        console.error('submit form failed: ', error);
      } finally {
        _setIsPending(false);
      }
    }, 1000);
  };

  const fetchNetworkPrice = async () => {
    try {
      const result: any = await supplyBE.fetchPrice({
        chainId: selectedChain?.id,
      });
      setNetworkPrice(result?.price || 0);
    } catch (error) {
      console.error('fetch gas to estimate failed: ', error);
    }
  };

  console.log('allowance: ', allowance);

  useEffect(() => {
    estimateNormalTxFee({
      network: selectedNetwork,
      chain: selectedChain,
      // TODO: update cardano params
    });
    fetchNetworkPrice();
    refetchAllowance({
      network: selectedNetwork,
      chain: selectedChain,
      contractAddress: asset?.address,
      owner: provider?.account,
      spender: asset?.pool_address,
      // TODO: update cardano params
    });

    const interval_ = setInterval(() => {
      estimateNormalTxFee({
        network: selectedNetwork,
        chain: selectedChain,
        // TODO: update cardano params
      });
    }, 15000);

    return () => {
      clearInterval(interval_);
    };
  }, [asset?.address, selectedNetwork, selectedChain, provider]);

  const feeWithPrice = useMemo(() => {
    const decimals = selectedChain?.nativeCurrency?.decimals || 18;
    return new BigNumber(fee)
      .multipliedBy(networkPrice)
      .dividedBy(10 ** decimals)
      .toFormat(2);
  }, [fee, networkPrice, selectedChain]);

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
      <Form onFinish={onFinish} form={form}>
        {(_, formInstance) => {
          const isNotValidForm = formInstance.getFieldsError().some(item => item.errors.length > 0);
          const amount = formInstance.getFieldValue('amount');
          const max = new BigNumber(asset?.wallet_balance_in_wei)
            .dividedBy(10 ** asset?.decimals)
            .toNumber();
          const isNotNeedToApprove = amount
            ? new BigNumber(allowance).isGreaterThanOrEqualTo(
                parseUnits(String(amount), asset?.decimals).toString(),
              )
            : false;
          const handleMaxInput = () => {
            formInstance.setFields([
              {
                name: 'amount',
                value: max,
                errors: [],
              },
            ]);

            formInstance
              .validateFields()
              .then(e => {})
              .catch(e => {});
          };

          return (
            <div className="supply-modal-container">
              <div className="supply-modal-container__input">
                <div className="supply-modal-container__input__title">
                  {t('SUPPLY_MODAL_INPUT_AMOUNT')}
                </div>
                <div className="supply-modal-container__input__control">
                  <Form.Item
                    name="amount"
                    help=""
                    style={{
                      width: '100%',
                    }}
                    validateFirst
                    rules={[
                      {
                        max: max,
                        type: 'number',
                        message: t('SUPPLY_MODAL_VALIDATE_INSUFFICIENT_BALANCE'),
                      },
                      {
                        required: true,
                        message: t('SUPPLY_MODAL_VALIDATE_REQUIRE_AMOUNT'),
                      },
                    ]}>
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
                    <Button
                      type="link"
                      className="supply-modal-container__input__control__price__max"
                      onClick={handleMaxInput}>
                      {t('SUPPLY_MODAL_MAX')}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="supply-modal-container__input__balance">
                    {t('SUPPLY_MODAL_WALLET_BALANCE')}: {asset?.wallet_balance} {asset?.symbol}
                  </div>
                  <span className="supply-modal-container__input__error">
                    {formInstance.getFieldError('amount')[0]}
                  </span>
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
                    <span className="text-white font-bold">
                      {computeWithMinThreashold(asset?.apy, '')}
                    </span>
                    %
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
                  {fee != 0 && amount > 0 ? (
                    <span className="supply-modal-container__overview__apy__value text-sm">
                      $<span className="text-white">{feeWithPrice}</span>
                    </span>
                  ) : (
                    <span className="supply-modal-container__overview__apy__value text-sm">--</span>
                  )}
                </div>
              </div>
              <div className="supply-modal-container__action">
                {isNotNeedToApprove ? (
                  <Button
                    type="primary"
                    loading={_isPending}
                    disabled={isNotValidForm}
                    htmlType="submit"
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
                      htmlType="submit"
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
