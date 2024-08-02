import cssClass from '@/components/borrow/asset.component.module.scss';
import { twMerge } from 'tailwind-merge';

interface AssetProps {}

export default function assetComponent(props: AssetProps) {
  return (
    <div className={twMerge(cssClass.assetComponent)}>
      <div className="asset-container">a</div>
    </div>
  );
}
