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

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
type LabelRender = SelectProps['labelRender'];

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { chain, chains } = useNetwork()

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
      <Table className='content' bordered={false} rowHoverable={false} pagination={false} columns={columns} dataSource={data} />
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
