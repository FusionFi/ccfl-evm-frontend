import eventBus from '@/hooks/eventBus.hook';
import cssClass from '@/pages/supply/index.module.scss';
import { Button } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { useNetwork } from 'wagmi'
import { SUPPORTED_CHAINS, CHAIN_INFO } from '@/constants/chains.constant'
import type { SelectProps } from 'antd';
import Image from 'next/image';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { toCurrency } from '@/utils/common'
import { computeWithMinThreashold } from '@/utils/percent.util'

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
    title: 'Wallet Balance',
    key: 'wallet_balance',
    dataIndex: 'wallet_balance',
    render: (value) => {

      console.log('value: ', value)
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

  const expandedRowRender = (record: any) => {
    console.log('record: ', record)
    return <div className='table-wrapper__action'>
      <Button className={twMerge('btn-primary-custom')} style={{
        width: 200,
        marginRight: 8
      }}>
        Supply more
      </Button>
      <Button className={twMerge('btn-default-custom')} style={{
        width: 200,
      }}>
        Withdraw
      </Button>
    </div>
  }

  const labelRender: LabelRender = (props: any) => {
    let { label, logo } = props;

    // TODO: please remove before release it to PRD
    if (!label) {
      label = 'Avalanche';
      logo = '/images/tokens/avax.png'
    }

    return <div className='flex items-center'>
      <Image src={logo} alt={label} width={24} height={24} style={{
        height: 24,
        width: 24
      }} className='mr-2' />
      {label}
    </div>;
  };


  const selectedChain = CHAIN_INFO.get(chain?.id) || {};

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
                label: item.name,
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
              <div className='overview__body__wrapper__item__value'>$ <span className='font-bold text-white'>4,567.87</span></div>
            </div>
            <div className='overview__body__wrapper__item'>
              <span className='overview__body__wrapper__item__label'>Net APY (variable)</span>
              <div className='overview__body__wrapper__item__value'><span className='font-bold text-white'>0.07</span> %</div>
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
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender,
            rowExpandable: (record) => true,
            showExpandColumn: false
          }}
          className='table-wrapper' bordered={false} rowHoverable={false} pagination={false} columns={columns} dataSource={data} />
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
