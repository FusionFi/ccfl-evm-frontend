import { Constr, Data, } from "@lucid-evolution/lucid";
import { loanHashz, collateralHashz, loanHash, collateralHash, rewardsCS, oracleHash, interestHash, yieldHash, } from "./evoValidators"
import { loanAmt, rewards, term, timestamp, price1, price2, price3, price4, price5, price6, interest, fee, loanCurrency, oracleTn, collateralAmt, price7, base, optimal, slope1, slope2, borrowed, supply, yieldDatumText } from "./variables"

export function makeConfigDatum(loanHash: string, collateralHash: string, rewardsCS: string, oracleHash: string, interestHash: string, yieldHash: string, collateralHashz: string[]) {
  return Data.to(
    new Constr(0, [
      loanHash,
      collateralHash,
      rewardsCS,
      oracleHash,
      interestHash,
      yieldHash,
      collateralHashz,
    ])
  )
}

export function makeOracleDatum(price: number, timestamp: number, loanCurrency: string, supply: number, borrowed: number) {
  return Data.to(
    new Constr(0, [
      BigInt(price),
      BigInt(timestamp), 
      loanCurrency, 
      BigInt(supply), 
      BigInt(borrowed)
    ])
  )
}

export function makeInterestDatum(base: number, optimal: number, slope1: number, slope2: number, term: number) {
  return Data.to(
    new Constr(0, [
      BigInt(base), 
      BigInt(optimal), 
      BigInt(slope1), 
      BigInt(slope2), 
      BigInt(term)
    ])
  )
}

export function makeLoanDatum(loanAmt: number, rewards: number, term: number, timestamp: number, oracleTn: string) {
  return Data.to(
    new Constr(0, [
      BigInt(loanAmt),
      BigInt(rewards),
      BigInt(term),
      BigInt(timestamp),
      oracleTn,
    ])
  )
}

export function makeCollateralDatum(collateralAmt: number, timestamp: number) {
  return Data.to(
    new Constr(0, [
      BigInt(collateralAmt),
      BigInt(timestamp),
      0n,
    ])
  )
}

export function makeYieldDatum(yieldDatumText: string) {
  return Data.to(
    new Constr(0, [
      yieldDatumText
    ])
  )
}
