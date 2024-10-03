import { Blockfrost, Lucid } from "lucid-cardano";
import Networks from '@/constants/cardano-network.constant'
import providers from "@/constants/providers.constant";

const ProviderFactory = {
  blockfrost: (config: any) => {
    return new Blockfrost(config.url, config.id);
  },
};

export const getLucid = async (params) => {
  const provider = params?.provider || process.env.NEXT_PUBLIC_PROVIDER;
  const networkId = params?.networkId || process.env.NEXT_PUBLIC_NETWORK_ID;
  const providerConfig = providers[provider][networkId];
  const _provider = ProviderFactory[provider](providerConfig);
  return await Lucid.new(_provider, Networks[networkId]);
};