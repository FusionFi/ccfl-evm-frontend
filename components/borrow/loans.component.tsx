import { loanType } from '@/components/borrow/borrow';
import cssClass from '@/components/borrow/loans.component.module.scss';
import { LOAN_STATUS } from '@/constants/common.constant';
import { toCurrency, toAmountShow } from '@/utils/common';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Skeleton, Table, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface LoansProps {
  showModal: any;
  showRepayModal: any;
  showCollateralModal: any;
  dataLoan?: loanType[];
  showWithdrawCollateralModal: any;
  loading?: any;
}

export default function LoansComponent(props: LoansProps) {
  const { t } = useTranslation('common');

  const renderStatusClass = (status: string) => {
    switch (status) {
      case LOAN_STATUS.LIQUIDATED:
      case LOAN_STATUS.DISBURSEMENT:
        return 'liquidated';
      case LOAN_STATUS.LIQUIDATION_APPROACHING:
      case LOAN_STATUS.UNPROCESSED:
        return 'warning';
      case LOAN_STATUS.REPAID_FULL:
        return 'repaid';
      default:
        return '';
    }
  };

  const handleDeleteLoan = () => {};

  const columns: TableProps<any>['columns'] = [
    {
      title: <h4>{t('BORROW_MODAL_BORROW_ADJUST_ASSET')}</h4>,
      dataIndex: 'asset',
      key: 'asset',
      render: asset => {
        return (
          <div className="flex items-center basis-1/4 loans-token">
            <Image
              className="mr-2"
              src={`/images/common/${asset}.png`}
              alt="USDC"
              width={40}
              height={40}
            />
            {asset}
          </div>
        );
      },
    },
    {
      title: <h4>{t('BORROW_MODAL_BORROW_BORROW_LOAN_SIZE')}</h4>,
      dataIndex: 'loan_size',
      key: 'loan_size',
      render: (value, record) => {
        return (
          <div className="loans-size basis-1/4">
            <h5>{toCurrency(toAmountShow(value, record.decimals), 2)}</h5>
            <div className="usd">
              $ {toCurrency(toAmountShow(value * record.asset_price, record.decimals), 2)}
            </div>
          </div>
        );
      },
    },
    {
      title: <h4 className="text-center">{t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}</h4>,
      dataIndex: 'apr',
      key: 'apr',
      render: value => {
        return (
          <div className="loans-apr basis-1/4 justify-center flex items-center">
            {toCurrency(value, 2)}%
          </div>
        );
      },
    },
    {
      title: (
        <h4>
          {t('BORROW_MODAL_BORROW_BORROW_DEBT_HEALTH')}
          <Tooltip placement="top" title={'a'} className="ml-1">
            <InfoCircleOutlined />
          </Tooltip>
        </h4>
      ),
      dataIndex: 'health',
      key: 'health',
      render: (value, record) => {
        return (
          <div
            className={`loans-health basis-1/4 flex items-center justify-end ${
              record.status === LOAN_STATUS.LIQUIDATION_APPROACHING ? 'warning' : ''
            }`}>
            {value}
          </div>
        );
      },
    },
  ];

  const expandedRowRender = (record: any) => {
    let final_status = LOAN_STATUS.ACTIVE;
    if (record.is_closed) {
      final_status = LOAN_STATUS.REPAID_FULL;
    } else if (record.is_liquidated) {
      final_status = LOAN_STATUS.LIQUIDATED;
    } else if (!record.is_closed && record.health && record.health >= 1 && 2 >= record.health) {
      final_status = LOAN_STATUS.LIQUIDATION_APPROACHING;
    }
    // let status: keyof typeof LOAN_STATUS = record.status;
    // let final_status = LOAN_STATUS[status] ? LOAN_STATUS[status] : LOAN_STATUS.ACTIVE;
    return (
      <>
        <div className="flex justify-between loans-status gap-4">
          <div className="">
            {t('BORROW_MODAL_BORROW_ADJUST_STATUS')}:
            <span className={`ml-1 ${renderStatusClass(final_status)}`}>
              {t(`BORROW_LOANS_${final_status}`)}
            </span>
          </div>
          <div></div>
          <div className="flex justify-end loans-remain">
            <div className="">{t('BORROW_MODAL_BORROW_BORROW_DEBT_REMAIN')}:</div>
            <div className="flex flex-wrap flex-1">
              <div className="highlight ml-1">
                {toCurrency(toAmountShow(record.debt_remain, record.decimals), 2)} {record.asset}
              </div>
              <div className="ml-1">
                ${' '}
                {toCurrency(
                  toAmountShow(record.debt_remain * record.asset_price, record.decimals),
                  2,
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex loans-collateral justify-between gap-1">
          <div className="flex">
            <span className="mr-1">{t('BORROW_OVERVIEW_COLLATERAL')}:</span>
            {toCurrency(toAmountShow(record.collateral_amount, record.collateral_decimals), 4)}{' '}
            {record.collateral_asset}
            <span className="ml-1">
              $
              {toCurrency(
                toAmountShow(
                  record.collateral_amount * record.collateral_price,
                  record.collateral_decimals,
                ),
                2,
              )}
            </span>
          </div>
          {final_status !== LOAN_STATUS.REPAID_FULL ? (
            <Button
              disabled={final_status === LOAN_STATUS.LIQUIDATED}
              onClick={() => props.showCollateralModal('weth')}>
              {t('BORROW_MODAL_BORROW_ADJUST_COLLATERAL')}
            </Button>
          ) : (
            <Button
              disabled={record.collateral_amount == 0}
              onClick={() => props.showWithdrawCollateralModal('weth')}>
              {t('BORROW_MODAL_WITHDRAW_COLLATERAL')}
            </Button>
          )}
        </div>
        <div className="flex justify-between items-end gap-1 loans-yield-wrapper">
          {record.yield_generating ? (
            <div className="loans-yield">
              <div className="mb-2">
                {t('BORROW_MODAL_BORROW_YIELD_GENERATING')}: <CheckOutlined className="ml-1" />
              </div>
              <div>
                {t('BORROW_MODAL_BORROW_YIELD_EARNED')}:{' '}
                <span className="ml-1">
                  {record.yield_earned} {record.collateral_asset}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="loans-button ">
            {final_status === LOAN_STATUS.REPAID_FULL && (
              <Button
                disabled={record.collateral_amount > 0}
                type="primary"
                className=""
                onClick={() => props.showModal(record.asset)}>
                {t('BORROW_MODAL_BORROW_BORROW_AGAIN')}
              </Button>
            )}
            {![LOAN_STATUS.REPAID_FULL, LOAN_STATUS.UNPROCESSED].find(
              status => status === final_status,
            ) && (
              <Button
                disabled={final_status === LOAN_STATUS.LIQUIDATED}
                className=""
                onClick={() => props.showRepayModal(record.asset, record.repayment_currency)}>
                {t('BORROW_MODAL_BORROW_REPAY')}
              </Button>
            )}
            {final_status === LOAN_STATUS.UNPROCESSED && (
              <Button type="primary" className="delete" onClick={handleDeleteLoan}>
                {t('BORROW_MODAL_DELETE')}
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  const dataLoan: loanType[] = [
    {
      asset: 'USD',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'ACTIVE',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WETH',
      yield_generating: true,
      yield_earned: '0.281',
      repayment_currency: 'USDT',
    },
    {
      asset: 'USD',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'DISBURSEMENT',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WETH',
      yield_generating: true,
      yield_earned: '0.281',
      repayment_currency: 'USDT',
    },
    {
      asset: 'USD',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'UNPROCESSED',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WETH',
      yield_generating: true,
      yield_earned: '0.281',
      repayment_currency: 'USDT',
    },
    {
      asset: 'USDC',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'ACTIVE',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WETH',
      yield_generating: true,
      yield_earned: '0.281',
    },
    {
      asset: 'USDC',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'REPAID_FULL',
      debt_remain: '2780',
      collateral_amount: '1',
      collateral_asset: 'WETH',
      yield_generating: true,
      yield_earned: '0.281',
    },
    {
      asset: 'USDT',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'LIQUIDATION_APPROACHING',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WBTC',
      yield_generating: true,
      yield_earned: '0.281',
    },
    {
      asset: 'USDT',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'LIQUIDATED',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'WBTC',
      yield_generating: true,
      yield_earned: '0.281',
    },
  ];

  let locale = {
    emptyText: <div className="loans-empty">{t('BORROW_MODAL_NO_DATA')}</div>,
  };

  return (
    <div className={twMerge(cssClass.loansComponent)}>
      {props.loading ? (
        <div className="loans-container skeleton">
          <Skeleton active />
        </div>
      ) : (
        <Table
          title={() => t('BORROW_MODAL_BORROW_BORROW_MY_LOANS')}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender,
            rowExpandable: record => true,
            showExpandColumn: false,
          }}
          virtual
          className="loans-container"
          bordered={false}
          rowHoverable={false}
          pagination={false}
          columns={columns}
          dataSource={props.dataLoan}
          locale={locale}
          rowKey={(record, index) => `${index}-${record.asset}`}
        />
      )}
    </div>
  );
}
