import SafeHtmlComponent from '@/components/common/safe-html.component';
import { ArrowRightIcon } from '@/components/wagmi/icons/arrow-right';
import { CARDANO_WALLETS, EVM_WALLETS } from '@/constants/common.constant';
import { useProviderManager, useConnectedNetworkManager } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import type { TabsProps } from 'antd';
import { Modal, Tabs } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import cssClass from './modal-web3.component.module.scss';
import { makeProvider, ProviderType } from '@/providers/index.provider'
import { CARDANO_NETWORK_ID } from '@/constants/chains.constant';


interface ModalCollateralProps { }

export default function ModalWeb3Component({ }: ModalCollateralProps) {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provider, updateProvider] = useProviderManager();
  const [chainId, setChainId] = useState<any>(null)
  const { updateNetwork } = useConnectedNetworkManager();

  const items: TabsProps['items'] = [
    {
      key: ProviderType.EVM,
      label: `${t('WEB3_MODAL_COMPONENT_TAB_EVM_WALLET')}`,
    },
    {
      key: ProviderType.Cardano,
      label: `${t('WEB3_MODAL_COMPONENT_TAB_CARDANO_WALLET')}`,
    },
  ];
  const [activeTab, setActiveTab] = useState(ProviderType.EVM);
  const [wallets, setWallets] = useState<any[]>([]);
  /**
   * HOOKS
   */

  /**
   * FUNCTIONS
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeTab = (key: string) => {
    console.log('🚀 ~ onChangeTab ~ key:', key);
    setActiveTab(key);
  };

  const onConnect = async (connector: any) => {
    try {
      console.log('🚀 ~ onConnect ~ connector:', connector);

      const _provider: any = makeProvider({
        type: activeTab
      });

      const result: any = await _provider.connect(connector);

      provider.disconnect?.()

      let _chainId = chainId;
      if (!_chainId) {
        if (_provider.type == ProviderType.Cardano) {
          _chainId = CARDANO_NETWORK_ID;
        } else {
          _chainId = result.chainId;
        }
      }
      console.log('_chainId: ', _chainId)
      updateNetwork(_chainId)
      setChainId(null);

      updateProvider({
        account: result.accounts[0],
        chainId: result.chainId,
        type: activeTab
      })
      setIsModalOpen(false);
    } catch (error) {
      console.error('handle cardano wallet connect failed: ', error)
    }
  };
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const openWeb3Modal = (params: any) => {
      const tab = params?.tab || ProviderType.EVM;
      setActiveTab(tab);
      setChainId(params?.chainId)
      setIsModalOpen(true);
    };

    eventBus.on('openWeb3Modal', openWeb3Modal);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('openWeb3Modal', openWeb3Modal);
    };
  }, []);
  useEffect(() => {
    if (activeTab === ProviderType.EVM) {
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
                  {wallet.id === 'metamask' && window?.ethereum?.isMetaMask && (
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
