export interface CardanoLoan {
  loanTokenName: string;
  oracleTokenName: string;
  loanValue: number;
  userPkh: string;
}

export interface OracleData {
  oracleTokenName: string;
  currency: string;
}
