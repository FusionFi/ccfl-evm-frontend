import React, { useCallback, useState } from 'react';
import Link from 'next/link'
import cssClass from '@/pages/supply/index.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { useNetwork } from 'wagmi'
import { SUPPORTED_CHAINS, CHAIN_INFO } from '@/constants/chains.constant'
import type { SelectProps } from 'antd';
import Image from 'next/image';
import { Table, Modal } from 'antd';
import type { TableProps } from 'antd';
import { toCurrency } from '@/utils/common'
import { computeWithMinThreashold } from '@/utils/percent.util'
import { WalletSolidIcon } from '@/components/icons/wallet-solid.icon';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import { LinkIcon } from '@/components/icons/link.icon';

interface DataType {
  key: string;
  asset: Array<any>;
  supply_balance: string;
  earned_reward: string;
  apy: string;
  wallet_balance: string
}
type LabelRender = SelectProps['labelRender'];

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { chain, chains } = useNetwork()


  const columns: TableProps<DataType>['columns'] = [
    {
      title: t('SUPPLY_TABLE_HEADER_ASSET'),
      dataIndex: 'asset',
      key: 'asset',
      render: (values) => {
        const [symbol, name] = values;
        return <div className='flex items-center table-wrapper__asset'>
          <Image src={`/images/tokens/${symbol}.png`} style={{
            marginRight: 8
          }} alt={name} width={40} height={40} />
          {name}
        </div>
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_SUPPLY_BALANCE'),
      dataIndex: 'supply_balance',
      key: 'supply_balance',
      render: (value) => {
        return <div className='table-wrapper__supply-balance'>
          {toCurrency(value)}
          <span className='table-wrapper__supply-balance__price'>$ {toCurrency(value, 2)}</span>
        </div>
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_EARNED_REWARD'),
      dataIndex: 'earned_reward',
      key: 'earned_reward',
      render: (value) => {
        return <div className='table-wrapper__earned-reward'>
          {toCurrency(value)}
          <span className='table-wrapper__supply-balance__price'>$ {toCurrency(value, 2)}</span>
        </div>
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_APY'),
      key: 'apy',
      dataIndex: 'apy',
      render: (value) => (
        <span className='table-wrapper__apy'>
          {computeWithMinThreashold(value)}
        </span>
      ),
    },
    {
      title: () => {
        return <div className='flex items-center'>
          <WalletSolidIcon className="mr-2" />
          {t('SUPPLY_TABLE_HEADER_WALLET_BALANCE')}</div>
      },

      key: 'wallet_balance',
      dataIndex: 'wallet_balance',
      render: (value) => {
        return <div className='table-wrapper__supply-balance'>
          {toCurrency(value)}
          <span className='table-wrapper__supply-balance__price'>$ {toCurrency(value, 2)}</span>
        </div>
      },
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      asset: ['USDC', 'USDC'],
      supply_balance: '3500',
      earned_reward: '350',
      apy: '0.009',
      wallet_balance: '1000'
    },
    {
      key: '2',
      asset: ['USDT', 'USDT'],
      supply_balance: '3500',
      earned_reward: '350',
      apy: '0.009',
      wallet_balance: '1000'
    },
  ];

  const showModalToSupplyMore = useCallback((asset: any) => {
    showModal()
  }, [])
  const expandedRowRender = (record: any) => {
    return <div className='table-wrapper__action'>
      <Button className={twMerge('btn-primary-custom')} style={{
        width: 200,
        marginRight: 8
      }} onClick={() => showModalToSupplyMore(record)}>
        {t('SUPPLY_TABLE_ACTION_SUPPLY_MORE')}
      </Button>
      <Button className={twMerge('btn-default-custom')} style={{
        width: 200,
      }} onClick={() => setIsModalWithdrawOpen(true)}>
        {t('SUPPLY_TABLE_ACTION_WITHDRAW')}
      </Button>
    </div>
  }

  const labelRender: LabelRender = (props: any) => {
    let { name, logo } = props;

    // TODO: please remove before release it to PRD
    if (!name) {
      name = 'Avalanche';
      logo = '/images/tokens/avax.png'
    }

    return <div className='flex items-center'>
      <Image src={logo} alt={name} width={24} height={24} style={{
        height: 24,
        width: 24
      }} className='mr-2' />
      {name}
    </div>;
  };


  const selectedChain = CHAIN_INFO.get(chain?.id) || {};

  const [isModalSupplyOpen, setIsModalSupplyOpen] = useState(false);
  const [isModalWithdrawOpen, setIsModalWithdrawOpen] = useState(false);
  const [isModalTxSuccessOpen, setIsModalTxSuccessOpen] = useState(false);

  const showModal = () => {
    setIsModalSupplyOpen(true);
  };

  const handleOk = () => {
    setIsModalSupplyOpen(false);
  };

  const handleCancel = () => {
    setIsModalSupplyOpen(false);
    setIsModalWithdrawOpen(false)
    setIsApproved(false)
  };

  const [isApproved, setIsApproved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleApprove = useCallback(() => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setIsApproved(true)
    }, 1000);

  }, [])

  const handleSupply = useCallback(() => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSuccessMsg(t('SUPPLY_SUCCESS_MODAL_MESSAGE', {
        token: 'USDT',
        amount: 4000
      }))
      setIsModalSupplyOpen(false);
      setIsModalTxSuccessOpen(true)
    }, 1000);
  }, [t])

  const handleWithdraw = useCallback(() => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSuccessMsg(t('WITHDRAW_SUCCESS_MODAL_MESSAGE', {
        token: 'USDT',
        amount: 4000
      }))
      setIsModalWithdrawOpen(false);
      setIsModalTxSuccessOpen(true)
    }, 1000);
  }, [])

  const handleTxStatusModallCancel = useCallback(() => {
    setIsApproved(false)
    setIsModalTxSuccessOpen(false)
  }, [])

  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      <div className='overview'>
        <div className='flex'>
          {t('SUPPLY_OVERVIEW_TITLE')}
          <div className='select-wrapper ml-6'>
            <Select
              labelRender={labelRender}
              defaultValue={{
                value: selectedChain?.id,
                label: selectedChain?.name,
                logo: selectedChain?.logo
              }}
              options={SUPPORTED_CHAINS.map((item: any) => ({
                value: item.id,
                name: item.name,
                label:
                  <div className='chain-dropdown-item-wrapper'>
                    <Image src={item.logo} alt={item.name} width={12} height={12} style={{
                      height: 12,
                      width: 12
                    }} className='mr-2' />
                    {item.name}
                  </div>,
                logo: item?.logo
              }))}
              suffixIcon={<CaretDownOutlined />}
            />
          </div>
        </div>
        <div className='overview__body'>
          <div className='overview__body__wrapper'>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>{t('SUPPLY_OVERVIEW_TOTAL_SUPPLY')}</span>
              <div className='overview__body__wrapper__item__value'>$ <span className='font-bold' style={{
                color: '#F0F0F0'
              }}>4,567.87</span></div>
            </div>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>{t('SUPPLY_OVERVIEW_NET_APY')}</span>
              <div className='overview__body__wrapper__item__value'><span className='font-bold' style={{
                color: '#F0F0F0'
              }}>0.07</span> %</div>
            </div>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>{t('SUPPLY_OVERVIEW_TOTAL_EARNED')}</span>
              <div className='overview__body__wrapper__item__value'><span className='font-bold' style={{
                color: '#52C41A'
              }}>+$65.87</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className='content'>
        <Table
          title={() => t('SUPPLY_TABLE_TITLE')}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender,
            rowExpandable: (record) => true,
            showExpandColumn: false
          }}
          virtual
          className='table-wrapper' bordered={false} rowHoverable={false} pagination={false} columns={columns} dataSource={data} />
      </div>

      <Modal wrapClassName={cssClass['supply-modal-wrapper']} classNames={{
        mask: cssClass['modal-mask'],
      }} title={t('SUPPLY_MODAL_TITLE', {
        token: 'USDT'
      })} open={isModalSupplyOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div className='supply-modal-container'>
          <div className='supply-modal-container__input'>
            <div className='supply-modal-container__input__title'>{t('SUPPLY_MODAL_INPUT_AMOUNT')}</div>
            <div className='supply-modal-container__input__control'>
              <InputNumber placeholder={t('SUPPLY_MODAL_INPUT_PLACEHOLDER')} className='supply-modal-container__input__control__amount' controls={false} addonAfter={<div className='supply-modal-container__input__control__amount__token'>
                <Image src={`/images/tokens/usdt.png`} alt='USDT' width={24} height={24} style={{
                  height: 24
                }} />
                USDT
              </div>} />
              <div className='supply-modal-container__input__control__price'>
                ≈ $4,000.00
                <Button type="link" className='supply-modal-container__input__control__price__max'>
                  {t('SUPPLY_MODAL_MAX')}
                </Button>
              </div>
            </div>
            <div className='supply-modal-container__input__balance'>
              {t('SUPPLY_MODAL_WALLET_BALANCE')}: 50,000.00 USDT
            </div>
          </div>
          <div className='supply-modal-container__overview'>
            <div className='supply-modal-container__overview__title'>{t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_TITLE')}</div>
            <div className='supply-modal-container__overview__apy'>
              <div className='supply-modal-container__overview__apy__title'>
                {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_APY')}
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span className='cursor-pointer'>
                    <InfoCircleIcon className='' />
                  </span>
                </Tooltip>
              </div>
              <span className='supply-modal-container__overview__apy__value'>
                &#60;
                <span className='text-white font-bold'>0.01</span>
                %
              </span>
            </div>
          </div>
          <div className='supply-modal-container__overview'>
            <div className='supply-modal-container__overview__apy'>
              <div className='supply-modal-container__overview__apy__title'>
                {t('SUPPLY_MODAL_TRANSACTION_OVERVIEW_GAS_FEE')}
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span className='cursor-pointer'>
                    <InfoCircleIcon className='' />
                  </span>
                </Tooltip>
              </div>
              <span className='supply-modal-container__overview__apy__value text-sm'>
                $
                <span className='text-white'>0.02</span>
              </span>
            </div>
          </div>
          <div className='supply-modal-container__action'>
            {isApproved ? <Button type="primary" loading={isPending} onClick={handleSupply} className={twMerge('btn-primary-custom')} block>
              {t('SUPPLY_MODAL_SUPPLY_BUTTON', {
                token: 'USDT'
              })}
            </Button> : <div className='supply-modal-container__action__approve'>
              <div className='supply-modal-container__action__approve__helper'>
                <QuestionCircleIcon />
                <Link className='supply-modal-container__action__approve__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                  {t('SUPPLY_MODAL_APPROVE_EXPLAIN')}
                </Link>
              </div>

              <Button loading={isPending} onClick={handleApprove} type="primary" className={twMerge('btn-primary-custom', 'mt-4')} block>
                {t('SUPPLY_MODAL_APPROVE', {
                  token: 'USDT'
                })}
              </Button>
            </div>}
          </div>
        </div>
      </Modal>



      <Modal closeIcon={false} wrapClassName={cssClass['supply-modal-tx-success-tx-success-wrapper']} classNames={{
        mask: cssClass['supply-modal-tx-success-mask'],
      }} title={t('SUCCESS_MODAL_TITLE')} open={isModalTxSuccessOpen} onOk={handleTxStatusModallCancel} onCancel={handleTxStatusModallCancel} footer={null}>
        <div className='supply-modal-tx-success-container'>
          <div className='supply-modal-tx-success-container__status'>
            <Image src='/images/status/success.png' alt='Transaction Success' width={80} height={80} />
            <div className='supply-modal-tx-success-container__status__msg'>{successMsg}</div>
          </div>
          <div className='supply-modal-tx-success-container__action'>
            <div className='supply-modal-tx-success-container__action__helper'>
              <LinkIcon />
              <Link className='supply-modal-tx-success-container__action__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                {t('SUCCESS_MODAL_REVIEW')}
              </Link>
            </div>

            <Button loading={isPending} onClick={handleTxStatusModallCancel} type="primary" className={twMerge('btn-default-custom')} block>
              {t('SUCCESS_MODAL_OK')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal wrapClassName={cssClass['withdraw-modal-wrapper']} classNames={{
        mask: cssClass['modal-mask'],
      }} title={t('WITHDRAW_MODAL_TITLE')} open={isModalWithdrawOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div className='withdraw-modal-container'>
          <div className='withdraw-modal-container__supply-overview'>
            <div className='withdraw-modal-container__supply-overview__container'>
              <div className='withdraw-modal-container__supply-overview__container__title'>{t('WITHDRAW_MODAL_OVERVIEW_TITLE')}</div>
              <div className='withdraw-modal-container__supply-overview__container__alert'>
                {t('WITHDRAW_MODAL_OVERVIEW_NOTE')}
              </div>
              <div className='withdraw-modal-container__supply-overview__container__values'>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>{t('WITHDRAW_MODAL_OVERVIEW_MY_SUPPLY')}</span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    45,000.00
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                  </span>
                </div>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>{t('WITHDRAW_MODAL_OVERVIEW_POOL_UTILIZATION')}</span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    90
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>%</span>
                  </span>
                </div>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>{t('WITHDRAW_MODAL_OVERVIEW_AVAILABLE_TO_WITHDRAW')}</span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    4,500.00
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
          <div className='withdraw-modal-container__input'>
            <div className='withdraw-modal-container__input__title'>{t('WITHDRAW_MODAL_OVERVIEW_AMOUNT')}</div>
            <div className='withdraw-modal-container__input__control'>
              <InputNumber placeholder={t('WITHDRAW_MODAL_INPUT_AMOUNT')} className='withdraw-modal-container__input__control__amount' controls={false} addonAfter={<div className='withdraw-modal-container__input__control__amount__token'>
                <Image src={`/images/tokens/usdt.png`} alt='USDT' width={24} height={24} style={{
                  height: 24
                }} />
                USDT
              </div>} />
              <div className='withdraw-modal-container__input__control__price'>
                ≈ $4,000.00
                <Button type="link" className='withdraw-modal-container__input__control__price__max'>
                  {t('WITHDRAW_MODAL_INPUT_MAX')}
                </Button>
              </div>
            </div>
          </div>
          <div className='withdraw-modal-container__overview'>
            <div className='withdraw-modal-container__overview__title'>{t('WITHDRAW_MODAL_OVERVIEW_TITLE')}</div>
            <div className='withdraw-modal-container__supply-overview__container__values'>
              <div className='withdraw-modal-container__supply-overview__container__values__item'>
                <span>{t('WITHDRAW_MODAL_OVERVIEW_REMAINING_SUPPLY')}</span>
                <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                  45,000.00
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                </span>
              </div>
              <div className='withdraw-modal-container__supply-overview__container__values__item'>
                <span>{t('WITHDRAW_MODAL_OVERVIEW_REWARD_EARNED')}</span>
                <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                  45,000.00
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                </span>
              </div>
            </div>
          </div>
          <div className='withdraw-modal-container__overview'>
            <div className='withdraw-modal-container__overview__apy'>
              <div className='withdraw-modal-container__overview__apy__title'>
                {t('WITHDRAW_MODAL_OVERVIEW_GAS_FEE')}
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span className='cursor-pointer'>
                    <InfoCircleIcon className='' />
                  </span>
                </Tooltip>
              </div>
              <span className='withdraw-modal-container__overview__apy__value text-sm'>
                $
                <span className='text-white'>0.02</span>
              </span>
            </div>
          </div>
          <div className='withdraw-modal-container__action'>
            {isApproved ? <Button type="primary" loading={isPending} onClick={handleWithdraw} className={twMerge('btn-primary-custom')} block>
              {t('WITHDRAW_MODAL_WITHDRAW_SUPPLY')}
            </Button> : <div className='withdraw-modal-container__action__approve'>
              <div className='withdraw-modal-container__action__approve__helper'>
                <QuestionCircleIcon />
                <Link className='withdraw-modal-container__action__approve__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                  {t('WITHDRAW_MODAL_APPROVE_EXPLAIN')}
                </Link>
              </div>

              <Button loading={isPending} onClick={handleApprove} type="primary" className={twMerge('btn-primary-custom', 'mt-4')} block>
                {t('WITHDRAW_MODAL_APPROVE', {
                  token: 'USDT'
                })}
              </Button>
            </div>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
