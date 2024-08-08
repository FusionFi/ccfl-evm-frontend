import Image from 'next/image';
import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface TransactionSuccessProps {
  handleCancel: any;
  currentToken?: string;
  isRepay?: any;
  token?: string;
  setStep: any;
}

export default function TransactionSuccessComponent({
  handleCancel,
  currentToken,
  isRepay,
  token,
  setStep,
}: TransactionSuccessProps) {
  const { t } = useTranslation('common');

  const handleFinish = () => {
    setStep(0);
    handleCancel();
  };

  return (
    <div>
      <div className="modal-borrow-success">
        <div className="img-wrapper">
          <Image src="/images/common/success.png" alt="success" width={80} height={80} />
        </div>
        <div className={`content px-4 py-4 ${isRepay ? 'repay' : ''}`}>
          {isRepay ? (
            <span>
              {t('BORROW_MODAL_SUCCESS_REPAY_TOKEN')} 575 {currentToken?.toUpperCase()}
            </span>
          ) : (
            <span>
              {t('BORROW_MODAL_SUCCESS_BORROW_TOKEN')} 4,000 {currentToken?.toUpperCase()}
            </span>
          )}
        </div>
        {!isRepay && (
          <div className="coin">
            <Image
              className="mr-2"
              src="/images/common/eth.png"
              alt="USDC"
              width={24}
              height={24}
            />
            <span className="content">
              {t('BORROW_MODAL_SUCCESS_BORROW_DEPOSIT')} 0.22 {token?.toUpperCase()}
            </span>
          </div>
        )}
        {!isRepay && (
          <div className="tokens">
            <div className="mb-2">{t('BORROW_MODAL_SUCCESS_BORROW_RECEIVED')}</div>
            <div className="flex justify-between">
              <span className="lp">4,000 LP-{currentToken?.toUpperCase()}</span>
              <span className="metamask">{t('BORROW_MODAL_SUCCESS_BORROW_METAMASK')}</span>
            </div>
          </div>
        )}
        <Link href="/" className="tx" target="_blank">
          <ExportOutlined />
          {t('BORROW_MODAL_SUCCESS_BORROW_REVIEW')}
        </Link>
        <div className="px-6 py-4">
          <Button className="w-full" onClick={handleFinish}>
            {t('BORROW_MODAL_SUCCESS_BORROW_OK')}
          </Button>
        </div>
      </div>
    </div>
  );
}
