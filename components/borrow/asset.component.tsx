import cssClass from '@/components/borrow/asset.component.module.scss';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Button } from 'antd';

interface AssetProps {}

export default function assetComponent(props: AssetProps) {
  const handleAdjust = () => {};

  return (
    <div className={twMerge(cssClass.assetComponent)}>
      <div className="asset-container">
        <div className="asset-header">Asset to borrow</div>
        <div className="">
          <div className="gap-6 asset-nav">
            <div className="basis-1/4">Asset</div>
            <div className="basis-1/4">Loan Available</div>
            <div className="basis-1/4">APR (variable)</div>
            <div className="basis-1/4"></div>
          </div>
          <div className="gap-6 asset-body">
            <div className="basis-1/4">
              <Image
                className="mr-2"
                src="/images/borrow/tokens/usdc.png"
                alt="USDC"
                width={40}
                height={40}
              />
              USDC
            </div>
            <div className="basis-1/4 flex-col items-start justify-center	">
              <div>10,000.00</div>
              <div className="usd">$ 4,000.00</div>
            </div>
            <div className="basis-1/4">0.07%</div>
            <div className="basis-1/4  justify-end">
              <Button onClick={() => handleAdjust}>Borrow</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
