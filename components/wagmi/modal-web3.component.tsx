import SafeHtmlComponent from '@/components/common/safe-html.component';
import { ArrowRightIcon } from '@/components/wagmi/icons/arrow-right';
import { CARDANO_WALLETS, EVM_WALLETS } from '@/constants/common.constant';
import { useCardanoConnected, useNetworkManager } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import type { TabsProps } from 'antd';
import { Modal, Tabs } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';
import cssClass from './modal-web3.component.module.scss';
import { useCardanoWalletConnect, useCardanoWalletDisconnect } from '@/hooks/cardano-wallet.hook';

interface ModalCollateralProps { }

export default function ModalWeb3Component({ }: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, updateNetwork] = useNetworkManager();

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

  const { connect, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const [isCardanoConnected, updateCardanoConnected] = useCardanoConnected();
  const [connectCardanoWallet] = useCardanoWalletConnect();
  const [disconnectCardanoWallet] = useCardanoWalletDisconnect()
  const [chainId, setChainId] = useState(null)
  /**
   * FUNCTIONS
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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

  const connectMetamask = async () => {
    try {
      connect({ connector: metaMask() });
      updateCardanoConnected(false);
      disconnectCardanoWallet()
      updateNetwork(chainId || 11155111)
      setChainId(null);
    } catch (error) {
      console.error('connect metamask failed: ', error)
    }
  };

  const connectWalletConnect = () => {
    connect({
      connector: walletConnect({
        projectId: 'e44a1758d79ad2f0154ca0b27b46b9f0',
      }),
    });
    updateCardanoConnected(false);
    disconnectCardanoWallet()

  };
  const connectCoinbase = () => {
    updateCardanoConnected(false);
    disconnectCardanoWallet()
    connect({
      connector: coinbaseWallet(),
    });
  };

  const handleCardanoWalletConnect = async (wallet: any) => {
    try {
      await connectCardanoWallet(wallet)
      disconnect()
      updateCardanoConnected(true);
    } catch (error) {
      console.error('handle cardano wallet connect failed: ', error)
    }
  }

  const onConnect = (wallet: any) => {
    console.log('🚀 ~ onConnect ~ wallet:', wallet);
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
        handleCardanoWalletConnect(wallet);
        break;
      case 'nami':
        handleCardanoWalletConnect(wallet);
        break;
      case 'eternl':
        handleCardanoWalletConnect(wallet);
        break;
      default:
        connectMetamask();
        break;
    }
    setIsModalOpen(false);
  };
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openWeb3Modal = (params: any) => {
      const tab = params?.tab || 'evm'
      setActiveTab(tab);
      setIsModalOpen(true);
      setChainId(params?.chainId)
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
      setWallets(CARDANO_WALLETS.map(item => {
        const isDetected = !!window?.cardano?.[item.id];
        return {
          ...item,
          isDetected
        }
      }));
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
      onCancel={handleCancel}
      footer={null}>
      <div className="web3-modal-container">
        <Tabs defaultActiveKey="1" activeKey={activeTab} items={items} onChange={onChangeTab} />
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
                  {wallet.isDetected && (
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
