import Image from 'next/image';
import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

interface TransactionSuccessProps {
  handleCancel: any;
  currentToken: string;
}

export default function TransactionSuccessComponent({
  handleCancel,
  currentToken,
}: TransactionSuccessProps) {
  return (
    <div>
      <div className="modal-borrow-success">
        <div className="img-wrapper">
          <Image src="/images/common/success.png" alt="success" width={80} height={80} />
        </div>
        <div className="content px-4 py-4">
          You successfully borrowed 4,000 {currentToken?.toUpperCase()}
        </div>
        <div className="coin">
          <Image className="mr-2" src="/images/common/eth.png" alt="USDC" width={24} height={24} />
          <span className="content">You deposit 0.22 WETH</span>
        </div>
        <div className="tokens">
          <div className="mb-2">You have also received</div>
          <div className="flex justify-between">
            <span className="lp">4,000 LP-{currentToken?.toUpperCase()}</span>
            <span className="metamask">Add to Metamask</span>
          </div>
        </div>
        <Link href="/" className="tx" target="_blank">
          <ExportOutlined />
          Review TX detail
        </Link>
        <div className="px-6 py-4">
          <Button className="w-full" onClick={handleCancel}>
            Ok, got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
