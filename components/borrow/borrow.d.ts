export interface DataType {
  address: string;
  loans: loanType[];
  total_loan: string;
  total_collateral: string;
  net_apr: string;
  finance_health: string;
}

export interface loanType {
  asset: string;
  loan_size: string;
  apr: string;
  health: string;
  status: string;
  debt_remain: string;
  collateral_amount: string;
  collateral_asset: string;
  yield_generating: boolean;
  yield_earned: string;
  repayment_currency?: string;
}
