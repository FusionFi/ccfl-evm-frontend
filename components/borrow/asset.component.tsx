import cssClass from '@/components/borrow/asset.component.module.scss';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Button } from 'antd';

interface AssetProps {
  showModal: any;
}

export default function assetComponent(props: AssetProps) {
  const tokenList = [
    {
      name: 'usdc',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      name: 'usdt',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
  ];

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
          {tokenList.map((item: any) => (
            <div className="gap-6 asset-body" key={item.name}>
              <div className="basis-1/4">
                <Image
                  className="mr-2"
                  src={`/images/common/${item.name}.png`}
                  alt={item.name}
                  width={40}
                  height={40}
                />
                {item.name.toUpperCase()}
              </div>
              <div className="basis-1/4 flex-col items-start justify-center	">
                <div>{item.value}</div>
                <div className="usd">$ {item.usd}</div>
              </div>
              <div className="basis-1/4">{item.percent}%</div>
              <div className="basis-1/4  justify-end">
                <Button onClick={() => props.showModal(item.name)}>Borrow</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
