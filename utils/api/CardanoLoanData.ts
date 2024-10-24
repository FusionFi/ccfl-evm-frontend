export interface CardanoLoan {
  loanTokenName: string; // onchain loan/collateral Identifier
  oracleTokenName: string; // onchain oracle Identifier
  loanValue: number; // in native assets e.g. USDA
  userPkh: string; // PubKeyCredential public wallet Identifier
}

export interface OracleData {
  oracleTokenName: string; // onchain oracle Identifier
  currency: string; // currency of the oracle price feed
}
