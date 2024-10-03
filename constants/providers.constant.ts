const providers = {
  blockfrost: {
    0: {
      url: process.env.NEXT_PUBLIC_TESTNET_BLOCKFROST_PROVIDER_URL,
      id: process.env.NEXT_PUBLIC_TESTNET_BLOCKFROST_PROVIDER_ID,
    },
    1: {
      url: "", // TODO: config provider for mainnet
      id: "",
    },
  },
};

export default providers;