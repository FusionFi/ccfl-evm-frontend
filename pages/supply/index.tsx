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

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Asset',
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
    title: 'Supply Balance',
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
    title: 'Earned reward',
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
    title: 'APY (variable)',
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
        Wallet Balance</div>
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

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { chain, chains } = useNetwork()


  const showModalToSupplyMore = useCallback((asset: any) => {
    showModal()
  }, [])
  const expandedRowRender = (record: any) => {
    return <div className='table-wrapper__action'>
      <Button className={twMerge('btn-primary-custom')} style={{
        width: 200,
        marginRight: 8
      }} onClick={() => showModalToSupplyMore(record)}>
        Supply more
      </Button>
      <Button className={twMerge('btn-default-custom')} style={{
        width: 200,
      }} onClick={() => setIsModalWithdrawOpen(true)}>
        Withdraw
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
      setSuccessMsg('You Supplied 4,000 USDT')
      setIsModalSupplyOpen(false);
      setIsModalTxSuccessOpen(true)
    }, 1000);
  }, [])

  const handleWithdraw = useCallback(() => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSuccessMsg('You withdrew 500 USDT')
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
              <span className='overview__body__wrapper__item__label'>Total supply</span>
              <div className='overview__body__wrapper__item__value'>$ <span className='font-bold' style={{
                color: '#F0F0F0'
              }}>4,567.87</span></div>
            </div>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>Net APY (variable)</span>
              <div className='overview__body__wrapper__item__value'><span className='font-bold' style={{
                color: '#F0F0F0'
              }}>0.07</span> %</div>
            </div>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>Total earned</span>
              <div className='overview__body__wrapper__item__value'><span className='font-bold' style={{
                color: '#52C41A'
              }}>+$65.87</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className='content'>
        <Table
          title={() => 'My Supplies'}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender,
            rowExpandable: (record) => true,
            showExpandColumn: false
          }}
          virtual
          className='table-wrapper' bordered={false} rowHoverable={false} pagination={false} columns={columns} dataSource={data} />
      </div>

      <Modal width={456} wrapClassName={cssClass['supply-modal-wrapper']} classNames={{
        mask: cssClass['modal-mask'],
      }} title="Supply USDT" open={isModalSupplyOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div className='supply-modal-container'>
          <div className='supply-modal-container__input'>
            <div className='supply-modal-container__input__title'>Amount</div>
            <div className='supply-modal-container__input__control'>
              <InputNumber defaultValue={4000} className='supply-modal-container__input__control__amount' controls={false} addonAfter={<div className='supply-modal-container__input__control__amount__token'>
                <Image src={`/images/tokens/usdt.png`} alt='USDT' width={24} height={24} style={{
                  height: 24
                }} />
                USDT
              </div>} />
              <div className='supply-modal-container__input__control__price'>
                ≈ $4,000.00
                <Button type="link" className='supply-modal-container__input__control__price__max'>
                  Max
                </Button>
              </div>
            </div>
            <div className='supply-modal-container__input__balance'>
              Wallet balance: 50,000.00 USDT
            </div>
          </div>
          <div className='supply-modal-container__overview'>
            <div className='supply-modal-container__overview__title'>Transaction overview</div>
            <div className='supply-modal-container__overview__apy'>
              <div className='supply-modal-container__overview__apy__title'>
                Supply APY (variable)
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span>
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
                Gas fee
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span>
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
              Supply USDT
            </Button> : <div className='supply-modal-container__action__approve'>
              <div className='supply-modal-container__action__approve__helper'>
                <QuestionCircleIcon />
                <Link className='supply-modal-container__action__approve__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                  Why do I need to approve?
                </Link>
              </div>

              <Button loading={isPending} onClick={handleApprove} type="primary" className={twMerge('btn-primary-custom', 'mt-4')} block>
                Approve USDT to continue
              </Button>
            </div>}
          </div>
        </div>
      </Modal>



      <Modal closeIcon={false} width={456} wrapClassName={cssClass['supply-modal-tx-success-tx-success-wrapper']} classNames={{
        mask: cssClass['supply-modal-tx-success-mask'],
      }} title="All done!" open={isModalTxSuccessOpen} onOk={handleTxStatusModallCancel} onCancel={handleTxStatusModallCancel} footer={null}>
        <div className='supply-modal-tx-success-container'>
          <div className='supply-modal-tx-success-container__status'>
            <Image src='/images/status/success.png' alt='Transaction Success' width={80} height={80} />
            <div className='supply-modal-tx-success-container__status__msg'>{successMsg}</div>
          </div>
          <div className='supply-modal-tx-success-container__action'>
            <div className='supply-modal-tx-success-container__action__helper'>
              <LinkIcon />
              <Link className='supply-modal-tx-success-container__action__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                Review TX detail
              </Link>
            </div>

            <Button loading={isPending} onClick={handleTxStatusModallCancel} type="primary" className={twMerge('btn-default-custom')} block>
              Ok, got it!
            </Button>
          </div>
        </div>
      </Modal>

      <Modal width={456} wrapClassName={cssClass['withdraw-modal-wrapper']} classNames={{
        mask: cssClass['modal-mask'],
      }} title="Withdraw supply" open={isModalWithdrawOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div className='withdraw-modal-container'>
          <div className='withdraw-modal-container__supply-overview'>
            <div className='withdraw-modal-container__supply-overview__container'>
              <div className='withdraw-modal-container__supply-overview__container__title'>Withdraw overview</div>
              <div className='withdraw-modal-container__supply-overview__container__alert'>
                Withdrawals are dependent on pool's utilization
              </div>
              <div className='withdraw-modal-container__supply-overview__container__values'>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>My supply </span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    45,000.00
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                  </span>
                </div>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>Pool utilization </span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    90
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>%</span>
                  </span>
                </div>
                <div className='withdraw-modal-container__supply-overview__container__values__item'>
                  <span>Available to withdraw </span>
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                    4,500.00
                    <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
          <div className='withdraw-modal-container__input'>
            <div className='withdraw-modal-container__input__title'>Withdraw Amount</div>
            <div className='withdraw-modal-container__input__control'>
              <InputNumber defaultValue={4000} className='withdraw-modal-container__input__control__amount' controls={false} addonAfter={<div className='withdraw-modal-container__input__control__amount__token'>
                <Image src={`/images/tokens/usdt.png`} alt='USDT' width={24} height={24} style={{
                  height: 24
                }} />
                USDT
              </div>} />
              <div className='withdraw-modal-container__input__control__price'>
                ≈ $4,000.00
                <Button type="link" className='withdraw-modal-container__input__control__price__max'>
                  Max
                </Button>
              </div>
            </div>
          </div>
          <div className='withdraw-modal-container__overview'>
            <div className='withdraw-modal-container__overview__title'>Withdraw overview</div>
            <div className='withdraw-modal-container__supply-overview__container__values'>
              <div className='withdraw-modal-container__supply-overview__container__values__item'>
                <span>Remaining supply </span>
                <span className='withdraw-modal-container__supply-overview__container__values__item__value'>
                  45,000.00
                  <span className='withdraw-modal-container__supply-overview__container__values__item__value__unit'>USDT</span>
                </span>
              </div>
              <div className='withdraw-modal-container__supply-overview__container__values__item'>
                <span>Reward earned </span>
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
                Gas fee
                <Tooltip color="rgba(0, 0, 0, 0.75)" title="prompt text">
                  <span>
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
              Withdraw supply
            </Button> : <div className='withdraw-modal-container__action__approve'>
              <div className='withdraw-modal-container__action__approve__helper'>
                <QuestionCircleIcon />
                <Link className='withdraw-modal-container__action__approve__helper__link' href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'} target='_blank' >
                  Why do I need to approve?
                </Link>
              </div>

              <Button loading={isPending} onClick={handleApprove} type="primary" className={twMerge('btn-primary-custom', 'mt-4')} block>
                Approve USDT to continue
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
