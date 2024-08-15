import cssClass from '@/components/borrow/loans.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { Button, Table } from 'antd';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { LOAN_STATUS } from '@/constants/common.constant';
import type { TableProps } from 'antd';

interface LoansProps {
  showModal: any;
  showRepayModal: any;
  showCollateralModal: any;
}

interface DataType {
  key: string;
  asset: string;
  balance: string;
  balance_usd: string;
  apr: string;
  health: string;
  status: string;
  debt: string;
  debt_usd: string;
  collateral: string;
  collateral_usd: string;
  isYield: boolean;
  yield_token: string;
  yield_balance: string;
}

export default function LoansComponent(props: LoansProps) {
  const { t } = useTranslation('common');

  const statusLoans = 'ACTIVE';
  const renderStatusClass = () => {
    switch (statusLoans) {
      case LOAN_STATUS.LIQUIDATED:
        return 'liquidated';
      case LOAN_STATUS.LIQUIDATION_APPROACHING:
        return 'warning';
      case LOAN_STATUS.REPAID_FULL:
        return 'repaid';
      default:
        return '';
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: values => {
        return <></>;
      },
    },
  ];

  return (
    <div className={twMerge(cssClass.loansComponent)}>
      <div className="loans-container">
        <h3>{t('BORROW_MODAL_BORROW_BORROW_MY_LOANS')}</h3>
        <div className="flex px-4 py-2 gap-6 loans-header">
          <div className="basis-1/4  ">
            <h4>{t('BORROW_MODAL_BORROW_ADJUST_ASSET')}</h4>
          </div>
          <div className="basis-1/4">
            <h4>{t('BORROW_MODAL_BORROW_BORROW_LOAN_SIZE')}</h4>
          </div>
          <div className="basis-1/4">
            <h4>{t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}</h4>
          </div>
          <div className="basis-1/4 flex justify-end">
            <h4>
              {t('BORROW_MODAL_BORROW_BORROW_DEBT_HEALTH')}
              <Tooltip placement="top" title={'a'} className="ml-1">
                <InfoCircleOutlined />
              </Tooltip>
            </h4>
          </div>
        </div>
        <div className="px-4 py-1 loans-inner">
          <div className="flex gap-6">
            <div className="flex items-center basis-1/4 loans-token">
              <Image
                className="mr-2"
                src="/images/common/usdc.png"
                alt="USDC"
                width={40}
                height={40}
              />
              USDC
            </div>
            <div className="loans-size basis-1/4 ">
              <h5>3,000.00</h5>
              <div className="usd">$ 3,000.00</div>
            </div>
            <div className="loans-apr basis-1/4 justify-center flex items-center">1.82%</div>
            <div className="loans-health basis-1/4 flex items-center justify-end">12.76</div>
          </div>
          <div className="flex justify-between loans-status gap-4">
            <div className="">
              {t('BORROW_MODAL_BORROW_ADJUST_STATUS')}:
              <span className={`ml-1 ${renderStatusClass()}`}>
                {t(`BORROW_LOANS_${LOAN_STATUS[statusLoans]}`)}
              </span>
            </div>
            <div></div>
            <div className="flex justify-end loans-remain">
              <div className="">{t('BORROW_MODAL_BORROW_BORROW_DEBT_REMAIN')}:</div>
              <div className="flex flex-wrap flex-1">
                <div className="highlight ml-1">2,780.0 USDC</div>
                <div className="ml-1">$ 2,780.0</div>
              </div>
            </div>
          </div>
          <div className="flex loans-collateral justify-between gap-1">
            <div className="flex">
              <span className="mr-1">{t('BORROW_OVERVIEW_COLLATERAL')}:</span>
              2.5 WETH
              <span className="ml-1">$6,540.00</span>
            </div>
            {statusLoans !== LOAN_STATUS.REPAID_FULL ? (
              <Button
                disabled={statusLoans === LOAN_STATUS.LIQUIDATED}
                onClick={() => props.showCollateralModal('weth')}>
                {t('BORROW_MODAL_BORROW_ADJUST_COLLATERAL')}
              </Button>
            ) : (
              <Button>{t('BORROW_MODAL_BORROW_CLAIM_COLLATERAL')}</Button>
            )}
          </div>
          <div className="flex justify-between items-end gap-1">
            <div className="loans-yield">
              <div>
                {t('BORROW_MODAL_BORROW_YIELD_GENERATING')}: <CheckOutlined className="ml-1" />
              </div>
              <div>
                {t('BORROW_MODAL_BORROW_YIELD_EARNED')}: <span className="ml-1">0.281 WETH</span>
              </div>
            </div>
            <div className="loans-button ">
              {statusLoans === LOAN_STATUS.REPAID_FULL ? (
                <Button type="primary" className="" onClick={() => props.showModal('usdc')}>
                  {t('BORROW_MODAL_BORROW_BORROW_AGAIN')}
                </Button>
              ) : (
                <Button
                  disabled={statusLoans === LOAN_STATUS.LIQUIDATED}
                  className=""
                  onClick={() => props.showRepayModal('usdc')}>
                  {t('BORROW_MODAL_BORROW_REPAY')}
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* <div className="loans-empty">There is no loan yet.</div> */}
      </div>
    </div>
  );
}
