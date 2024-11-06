import { loanType } from '@/components/borrow/borrow';
import cssClass from '@/components/borrow/loans.component.module.scss';
import { ASSET_TYPE, LOAN_STATUS } from '@/constants/common.constant';
import { useAuth } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { toCurrency } from '@/utils/common';
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
  showWithdrawCollateralModal: any;
  loading?: any;
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
          return props.showCollateralModal(record.collateral_asset, record.loan_token_name, record.oracle_token_name, record.loan_size, record.collateral_amount);
        case ACTION_LOAN.WITHDRAW_COLLATERAL:
          return props.showWithdrawCollateralModal(record.collateral_asset, record.loan_token_name, record.oracle_token_name, record.loan_size, record.collateral_amount);
        case ACTION_LOAN.REPAY:
          return props.showRepayModal(record.asset, record.repayment_currency, record.loan_token_name, record.oracle_token_name, record.loan_size, record.collateral_amount);
        case ACTION_LOAN.DELETE:
          return handleDeleteLoan();
        default:
          return props.showModal(record.asset);
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
              {toCurrency(value, 2)} {record.asset !== 'USD' ? record.asset : record.currency}
            </h5>
            <div className="usd">$ {toCurrency(value, 2)}</div>
          </div>
        );
      },
    },
    {
      title: <h4 className="">{t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}</h4>,
      dataIndex: 'apr',
      key: 'apr',
      render: value => {
        return <div className="loans-apr basis-1/7 flex items-center">{value}%</div>;
      },
    },
    {
      title: <h4 className="">{t('BORROW_MODAL_BORROW_ADJUST_STATUS')}</h4>,
      dataIndex: 'status',
      key: 'status',
      render: value => {
        let status: keyof typeof LOAN_STATUS = value;
        let final_status = LOAN_STATUS[status] ? LOAN_STATUS[status] : LOAN_STATUS.ACTIVE;
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
            {record.collateral_amount} {record.collateral_asset}
            <div className="">
              <span className="">${toCurrency('6540')}</span>
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
              {toCurrency(record.debt_remain, 2)}{' '}
              {record.asset !== 'USD' ? record.asset : record.repayment_currency}
            </div>
            <div className="ml-1">$ {toCurrency(record.debt_remain, 2)}</div>
          </div>
        );
      },
    },
  ];

  const expandedRowRender = (record: any) => {
    let status: keyof typeof LOAN_STATUS = record.status;
    let final_status = LOAN_STATUS[status] ? LOAN_STATUS[status] : LOAN_STATUS.ACTIVE;
    return (
      <>
        {/* <div className="flex justify-between loans-status gap-4">
          <div className="">{t('BORROW_MODAL_BORROW_ADJUST_STATUS')}:</div>
          <div className="flex justify-end loans-remain">
            <div className="">{t('BORROW_MODAL_BORROW_BORROW_DEBT_REMAIN')}:</div>
            <div className="flex flex-wrap flex-1">
              <div className="highlight ml-1">
                {toCurrency(record.debt_remain, 2)} {record.asset}
              </div>
              <div className="ml-1">$ {toCurrency(record.debt_remain, 2)}</div>
            </div>
          </div>
        </div> */}
        {/* <div className="flex loans-collateral justify-between gap-1">
          <div className="flex">
            <span className="mr-1">{t('BORROW_OVERVIEW_COLLATERAL')}:</span>
            {record.collateral_amount} {record.collateral_asset}
            <span className="ml-1">${toCurrency('6540')}</span>
          </div>
          {final_status !== LOAN_STATUS.REPAID_FULL ? (
            <Button
              disabled={final_status === LOAN_STATUS.LIQUIDATED}
              onClick={() => props.showCollateralModal('WETH')}>
              {t('BORROW_MODAL_BORROW_ADJUST_COLLATERAL')}
            </Button>
          ) : (
            <Button
              disabled={record.collateral_amount == 0}
              onClick={() => props.showWithdrawCollateralModal('WETH')}>
              {t('BORROW_MODAL_WITHDRAW_COLLATERAL')}
            </Button>
          )}
        </div> */}
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
      collateral_amount: '6000',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      loan_token_name: 'facecafe',
      oracle_token_name: 'acedfeed',
    },
    {
      asset: 'USD',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'DISBURSEMENT',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      repayment_currency: 'ADA',
      currency: 'EUR',
      sub_name: 'FIAT',
      loan_token_name: 'deadbeef',
      oracle_token_name: 'bacedeed',
    },
    {
      asset: 'USD',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'UNPROCESSED',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      repayment_currency: 'ADA',
      currency: 'EUR',
      sub_name: 'FIAT',
      loan_token_name: 'feedface',
      oracle_token_name: 'bacedeed',
    },
    {
      asset: 'USDC',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'ACTIVE',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      loan_token_name: 'deafbead',
      oracle_token_name: 'cadefeed',
    },
    {
      asset: 'USDC',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'REPAID_FULL',
      debt_remain: '2780',
      collateral_amount: '2',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      loan_token_name: 'cecedeed',
      oracle_token_name: 'cadefeed',
    },
    {
      asset: 'USDT',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'LIQUIDATION_APPROACHING',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      loan_token_name: 'acedcafe', 
      oracle_token_name: 'dadedeed',
    },
    {
      asset: 'USDT',
      loan_size: '3000',
      apr: '1.82',
      health: '12.76',
      status: 'LIQUIDATED',
      debt_remain: '2780',
      collateral_amount: '2.5',
      collateral_asset: 'ADA',
      yield_generating: true,
      yield_earned: '0.281',
      loan_token_name: 'deafbace',
      oracle_token_name: 'dadedeed',
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
          dataSource={dataLoan}
          locale={locale}
          rowKey={(record, index) => `${index}-${record.asset}`}
        />
      )}
    </div>
  );
}
