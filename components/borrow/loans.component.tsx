import { loanType } from '@/components/borrow/borrow';
import cssClass from '@/components/borrow/loans.component.module.scss';
import { ASSET_TYPE, LOAN_STATUS } from '@/constants/common.constant';
import { useAuth } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { toAmountShow, toLessPart } from '@/utils/common';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { PaginationProps, TableProps } from 'antd';
import { Button, Pagination, Skeleton, Table, Tooltip } from 'antd';
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
  totalLoan?: any;
  onChangePagination?: any;
  pagination?: any;
}

export default function LoansComponent(props: LoansProps) {
  const { t } = useTranslation('common');
  const [auth] = useAuth();

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

  const handleDeleteLoan = () => {
    console.log('handleDeleteLoan');
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log('onShowSizeChange', current, pageSize);
  };

  const ACTION_LOAN = {
    COLLATERAL: 'COLLATERAL',
    WITHDRAW_COLLATERAL: 'WITHDRAW_COLLATERAL',
    BORROW: 'BORROW',
    REPAY: 'REPAY',
    DELETE: 'DELETE',
  };

  const handleCheckLogin = (type: string, record: loanType) => {
    if (!auth?.userName && ASSET_TYPE.USD === record?.asset) {
      eventBus.emit('toggleKycWarningModal', true);
    } else {
      switch (type) {
        case ACTION_LOAN.COLLATERAL:
          return props.showCollateralModal(record.collateral_asset);
        case ACTION_LOAN.WITHDRAW_COLLATERAL:
          return props.showWithdrawCollateralModal(record.collateral_asset);
        case ACTION_LOAN.REPAY:
          return props.showRepayModal(record.asset, record.repayment_currency, record);
        case ACTION_LOAN.DELETE:
          return handleDeleteLoan();
        default:
          return props.showModal(record.asset, record.apr);
      }
    }
  };

  const columns: TableProps<any>['columns'] = [
    {
      title: <h4>{t('BORROW_MODAL_BORROW_ADJUST_ASSET')}</h4>,
      dataIndex: 'asset',
      key: 'asset',
      render: (asset, record) => {
        return (
          <div className="flex items-center basis-1/7 loans-token">
            <Image
              className="mr-2"
              src={`/images/common/${asset}.png`}
              alt={asset}
              width={40}
              height={40}
            />
            {asset !== 'USD' ? asset : record.sub_name}
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
          <div className="loans-size basis-1/7">
            <h5>
              {toLessPart(toAmountShow(value, record.decimals), 2)}{' '}
              {record.asset !== 'USD' ? record.asset : record.currency}
            </h5>
            <div className="usd">
              $ {toLessPart(toAmountShow(value * record.asset_price, record.decimals), 2)}
            </div>
          </div>
        );
      },
    },
    {
      title: <h4 className="">{t('BORROW_FIAT_MODAL_TAB_COLLATERAL_APY')}</h4>,
      dataIndex: 'apr',
      key: 'apr',
      render: value => {
        return <div className="loans-apr basis-1/7 flex items-center">{toLessPart(value, 2)}%</div>;
      },
    },
    {
      title: <h4 className="">{t('BORROW_MODAL_BORROW_ADJUST_STATUS')}</h4>,
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        let final_status = LOAN_STATUS.ACTIVE;
        if (record.is_closed) {
          final_status = LOAN_STATUS.REPAID_FULL;
        } else if (record.is_liquidated) {
          final_status = LOAN_STATUS.LIQUIDATED;
        } else if (!record.is_closed && record.health && record.health >= 1 && 2 >= record.health) {
          final_status = LOAN_STATUS.LIQUIDATION_APPROACHING;
        }

        return (
          <div className="loans-status basis-1/7  flex items-center">
            <span className={`${renderStatusClass(final_status)}`}>
              {t(`BORROW_LOANS_${final_status}`)}
            </span>
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
            className={`loans-health basis-1/7 flex items-center ${
              record.status === LOAN_STATUS.LIQUIDATION_APPROACHING ? 'warning' : ''
            }`}>
            {value}
          </div>
        );
      },
    },
    {
      title: <h4 className="">{t('BORROW_OVERVIEW_COLLATERAL')}</h4>,
      dataIndex: 'collateral',
      key: 'collateral',
      render: (value, record) => {
        return (
          <div className="loans-collateral basis-1/7 justify-center items-center">
            {toLessPart(toAmountShow(record.collateral_amount, record.collateral_decimals), 4)}{' '}
            {record.collateral_asset}
            <div>
              <span className="">
                $
                {toLessPart(
                  toAmountShow(
                    record.collateral_amount * record.collateral_price,
                    record.collateral_decimals,
                  ),
                  2,
                )}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: <h4 className="">{t('BORROW_MODAL_BORROW_BORROW_DEBT_REMAIN')}</h4>,
      dataIndex: 'debt_remain',
      key: 'debt_remain',
      render: (value, record) => {
        return (
          <div className="loans-status basis-1/7 ">
            <div className="highlight ml-1">
              {toLessPart(toAmountShow(record.debt_remain, record.decimals), 2)}{' '}
              {record.asset !== 'USD' ? record.asset : record.repayment_currency}
            </div>
            <div className="ml-1">
              ${' '}
              {toLessPart(
                toAmountShow(record.debt_remain * record.asset_price, record.decimals),
                2,
              )}
            </div>
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

    return (
      <>
        <div className="flex justify-between items-end gap-1 loans-yield-wrapper">
          {record.yield_generating ? (
            <div className="loans-yield">
              <div className="mr-2">
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
          <div className="flex items-center">
            <div className="loans-collateral">
              {![LOAN_STATUS.REPAID_FULL, LOAN_STATUS.UNPROCESSED].find(e => e === final_status) ? (
                <Button
                  disabled={
                    !![LOAN_STATUS.LIQUIDATED, LOAN_STATUS.DISBURSEMENT].find(
                      e => e === final_status,
                    )
                  }
                  onClick={() => handleCheckLogin(ACTION_LOAN.COLLATERAL, record)}>
                  {t('BORROW_MODAL_BORROW_ADJUST_COLLATERAL')}
                </Button>
              ) : (
                <Button
                  disabled={record.collateral_amount == 0}
                  onClick={() => handleCheckLogin(ACTION_LOAN.WITHDRAW_COLLATERAL, record)}>
                  {t('BORROW_MODAL_WITHDRAW_COLLATERAL')}
                </Button>
              )}
            </div>
            <div className="loans-button">
              {final_status === LOAN_STATUS.REPAID_FULL && (
                <Button
                  disabled={record.collateral_amount > 0}
                  type="primary"
                  className=""
                  onClick={() => handleCheckLogin(ACTION_LOAN.BORROW, record)}>
                  {t('BORROW_MODAL_BORROW_BORROW_AGAIN')}
                </Button>
              )}
              {![LOAN_STATUS.REPAID_FULL, LOAN_STATUS.UNPROCESSED].find(
                status => status === final_status,
              ) && (
                <Button
                  disabled={
                    !![LOAN_STATUS.LIQUIDATED, LOAN_STATUS.DISBURSEMENT].find(
                      e => e === final_status,
                    )
                  }
                  type="primary"
                  className=""
                  onClick={() => handleCheckLogin(ACTION_LOAN.REPAY, record)}>
                  {t('BORROW_MODAL_BORROW_REPAY')}
                </Button>
              )}
              {final_status === LOAN_STATUS.UNPROCESSED && (
                <Button
                  type="primary"
                  className="delete"
                  onClick={() => handleCheckLogin(ACTION_LOAN.DELETE, record)}>
                  {t('BORROW_MODAL_DELETE')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const dataLoan: loanType[] = [
    {
      asset: 'USDA',
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
      currency: 'EUR',
      sub_name: 'FIAT',
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
      currency: 'EUR',
      sub_name: 'FIAT',
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
        <>
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
            // pagination={
            //   props.totalLoan && props.totalLoan > 10 ? { position: ['bottomRight'] } : false
            // }
            columns={columns}
            dataSource={props.dataLoan}
            locale={locale}
            rowKey={(record, index) => `${index}-${record.asset}`}
          />
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            defaultCurrent={1}
            total={props.totalLoan}
            onChange={props.onChangePagination}
            current={props.pagination.current}
            pageSize={props.pagination.pageSize}
          />
        </>
      )}
    </div>
  );
}
