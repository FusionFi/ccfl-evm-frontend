import cssClass from '@/components/borrow/loans.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
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
        <div className="flex px-4 py-2 gap-6 loans-header">
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
        <div className="px-4 py-1 loans-inner">
          <div className="flex gap-6">
            <div className="flex items-center basis-1/4">
              <Image
                className="mr-2"
                src="/images/borrow/tokens/usdc.png"
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
              Status: <span className="ml-1">Active</span>
            </div>
            <div></div>
            <div className="flex justify-end loans-remain">
              <div className="">Debt remain:</div>
              <div className="flex flex-wrap flex-1">
                <div className="highlight ml-1">2,780.0 USDC</div>
                <div className="ml-1">$ 2,780.0</div>
              </div>
            </div>
          </div>
          <div className="flex loans-collateral justify-between">
            <div className="flex">
              <span className="mr-1">Collateral:</span>
              2.5 WETH
              <span className="ml-1">$6,540.00</span>
            </div>
            <Button>Adjust collateral</Button>
          </div>
          <div className="flex justify-between items-end">
            <div className="loans-yield">
              <div>
                Yield-generating: <CheckOutlined className="ml-1" />
              </div>
              <div>
                Yield earned: <span className="ml-1">0.281 WETH</span>
              </div>
            </div>
            <div className="loans-button ">
              <Button type="primary" className="mr-2">
                Borrow More
              </Button>
              <Button>Repay</Button>
            </div>
          </div>
        </div>
        {/* <div className="loans-empty">There is no loan yet.</div> */}
      </div>
    </div>
  );
}
