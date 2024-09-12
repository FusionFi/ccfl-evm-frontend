import SafeHtmlComponent from '@/components/common/safe-html.component';
import { ArrowRightIcon } from '@/components/wagmi/icons/arrow-right';
import { CARDANO_WALLETS, EVM_WALLETS } from '@/constants/common.constant';
import eventBus from '@/hooks/eventBus.hook';
import type { TabsProps } from 'antd';
import { Modal, Tabs } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';
import cssClass from './modal-web3.component.module.scss';
interface ModalCollateralProps {}

export default function ModalWeb3Component({}: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items: TabsProps['items'] = [
    {
      key: 'evm',
      label: `${t('WEB3_MODAL_COMPONENT_TAB_EVM_WALLET')}`,
    },
    {
      key: 'cardano',
      label: `${t('WEB3_MODAL_COMPONENT_TAB_CARDANO_WALLET')}`,
    },
  ];
  const [activeTab, setActiveTab] = useState('evm');
  const [wallets, setWallets] = useState<any[]>([]);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  /**
   * HOOKS
   */

  const { connect } = useConnect();
  /**
   * FUNCTIONS
   */
  const detectMetaMask = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);

    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      if (isMobile) {
        console.log('MetaMask mobile app is detected.');
      } else {
        console.log('MetaMask is installed in the browser.');
      }
      setIsMetaMaskInstalled(true);
    } else {
      console.log('MetaMask is not detected.');
      setIsMetaMaskInstalled(false);
    }
  };
  const onChangeTab = (key: string) => {
    console.log('🚀 ~ onChangeTab ~ key:', key);
    setActiveTab(key);
  };

  const connectMetamask = () => {
    connect({ connector: metaMask() });
  };
  const connectWalletConnect = () => {
    connect({
      connector: walletConnect({
        projectId: 'e44a1758d79ad2f0154ca0b27b46b9f0',
      }),
    });
  };
  const connectCoinbase = () => {
    connect({
      connector: coinbaseWallet(),
    });
  };
  const connectYoroi = () => {
    alert('Coming soon...');
  };
  const connectNami = () => {
    alert('Coming soon...');
  };
  const connectEternl = () => {
    alert('Coming soon...');
  };
  const onConnect = (wallet: any) => {
    console.log('🚀 ~ onConnect ~ wallet:', wallet);
    setIsModalOpen(false);
    switch (wallet.id) {
      case 'metamask':
        connectMetamask();
        break;
      case 'walletConnect':
        connectWalletConnect();
        break;
      case 'coinbase':
        connectCoinbase();
        break;
      case 'yoroi':
        connectYoroi();
        break;
      case 'nami':
        connectNami();
        break;
      case 'eternl':
        connectEternl();
        break;
      default:
        connectMetamask();
        break;
    }
  };
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openWeb3Modal = () => {
      setIsModalOpen(true);
    };

    eventBus.on('openWeb3Modal', openWeb3Modal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('openWeb3Modal', openWeb3Modal);
    };
  }, []);
  useEffect(() => {
    if (activeTab === 'evm') {
      setWallets(EVM_WALLETS);
    } else {
      setWallets(CARDANO_WALLETS);
    }
  }, [activeTab]);
  useEffect(() => {
    detectMetaMask();
  }, []);
  /**
   * RENDERS
   */
  return (
    <Modal
      wrapClassName={cssClass['web3-modal-wrapper']}
      title={t('WEB3_MODAL_COMPONENT_TITLE')}
      open={isModalOpen}
      footer={null}>
      <div className="web3-modal-container">
        <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
        <div className="tab-content-container">
          {wallets.map(wallet => (
            <div className="wallet-item" key={wallet.name} onClick={() => onConnect(wallet)}>
              <div className="content-left">
                <div className="wallet-icon">
                  <Image src={wallet.iconUrl} alt={wallet.name} width={80} height={80} />
                </div>
                <div className="wallet-name">
                  {t(wallet.name)}
                  {wallet.id === 'metamask' && isMetaMaskInstalled && (
                    <span className="detected-badge">
                      {t('WEB3_MODAL_COMPONENT_WALLET_STATUS_DETECTED')}
                    </span>
                  )}
                  {wallet.id === 'yoroi' && (
                    <span className="detected-badge">
                      {t('WEB3_MODAL_COMPONENT_WALLET_STATUS_DETECTED')}
                    </span>
                  )}
                </div>
              </div>
              <div className="content-right">
                <ArrowRightIcon className="arrow-right" />
              </div>
            </div>
          ))}
          <div className="term">
            <SafeHtmlComponent htmlContent={t('WEB3_MODAL_COMPONENT_TERM_CONDITION')} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
