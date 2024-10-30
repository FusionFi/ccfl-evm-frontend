import { Constr, Data, } from "@lucid-evolution/lucid";
import { loanHashz, collateralHashz, loanHash, collateralHash, rewardsCS, oracleHash, interestHash, yieldHash, } from "./evoValidators"
import { loanAmt, rewards, term, timestamp, price1, price2, price3, price4, price5, price6, interest, fee, loanCurrency, oracleTn, collateralAmt, price7, base, optimal, slope1, slope2, borrowed, supply, yieldDatumText } from "./variables"

export function makeConfigDatum(loanHash: any, collateralHash: any, rewardsCS: any, oracleHash: any, interestHash: any, yieldHash: any, collateralHashz: any) {
  return Data.to(new Constr(0, [
    loanHash,
    collateralHash,
    rewardsCS,
    oracleHash,
    interestHash,
    yieldHash,
    collateralHashz,
  ]))
}

export const configDatum = Data.to(new Constr(0, [
  loanHash,
  collateralHash,
  rewardsCS,
  oracleHash,
  interestHash,
  yieldHash,
  collateralHashz,
]))

export function makeOracleDatum(price: any, timestamp: any, loanCurrency: any, supply: any, borrowed: any) {
  return Data.to(new Constr(0, [price, timestamp, loanCurrency, supply, borrowed]))
}

export const oracleDatum1 = Data.to(new Constr(0, [price1, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum2 = Data.to(new Constr(0, [price2, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum3 = Data.to(new Constr(0, [price3, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum4 = Data.to(new Constr(0, [price4, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum5 = Data.to(new Constr(0, [price5, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum6 = Data.to(new Constr(0, [price6, timestamp, loanCurrency, supply, borrowed]))
export const oracleDatum7 = Data.to(new Constr(0, [price7, timestamp, loanCurrency, supply, borrowed]))

export function makeinterestDatum(base: any, optimal: any, slope1: any, slope2: any, term: any) {
  return Data.to(new Constr(0, [base, optimal, slope1, slope2, term]))
}

export const interestDatum = Data.to(new Constr(0, [base, optimal, slope1, slope2, term]))
export const interestDatum2 = Data.to(new Constr(0, [slope1, optimal, base, slope2, term]))

export function makeLoanDatum(loanAmt: any, rewards: any, term: any, timestamp: any, oracleTn: any) {
  return Data.to(
    new Constr(0, [
      loanAmt,
      rewards,
      term,
      timestamp,
      oracleTn,
    ]))
}

export const loanDatum = Data.to(
  new Constr(0, [
    loanAmt,
    rewards,
    term,
    timestamp,
    oracleTn,
  ]))

export function makeCollateralDatum(collateralAmt: any, timestamp: any) {
  return Data.to(
    new Constr(0, [
      collateralAmt,
      timestamp,
      0n,
    ])
  )
}

export const collateralDatum = Data.to(
  new Constr(0, [
    collateralAmt,
    timestamp,
    0n,
  ])
)

export function makeYieldDatum(yieldDatumText: any) {
  return Data.to(
    new Constr(0, [
      yieldDatumText
    ])
  )
}

export const yieldDatum = Data.to(
  new Constr(0, [
    yieldDatumText
  ])
)