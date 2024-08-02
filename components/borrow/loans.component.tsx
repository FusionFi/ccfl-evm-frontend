import cssClass from '@/components/borrow/loans.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';

interface LoansProps {}

export default function LoansComponent(props: LoansProps) {
  return (
    <div className={twMerge(cssClass.loansComponent)}>
      <div className="loans-container">
        <h3>My Loans</h3>
        <div className="flex  px-4 py-2 gap-6">
          <div className="basis-1/4  ">
            <h4>Asset</h4>
          </div>
          <div className="basis-1/4">
            <h4>Loan size</h4>
          </div>
          <div className="basis-1/4">
            <h4>APR (variable)</h4>
          </div>
          <div className="basis-1/4 flex justify-end">
            <h4>
              Health
              <Tooltip placement="top" title={'a'} className="ml-1">
                <InfoCircleOutlined />
              </Tooltip>
            </h4>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex "></div>
        </div>
        <div className="flex ">
          <div className="basis-1/2">Status: Active</div>
          <div className="basis-1/2">Debt remain: 2,780.00 USDC $2,780.00</div>
        </div>
        <div className="flex ">
          <div>Collateral: 2.5 WETH $6,540.00</div>
          <div>Adjust collateral</div>
        </div>
        <div className="flex ">
          <div>Yield-generating: Yield earned: 0.281 WETH</div>
          <div>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
