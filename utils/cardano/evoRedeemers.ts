import { Constr, Data, } from "@lucid-evolution/lucid";
import { loanHashz, collateralHashz, loanHash, collateralHash, rewardsCS, rewardsMint, oracleHash, balanceHash, liquidateHash, closeHash, interestHash, yieldHash } from "./evoValidators"
import { loanAmt, rewards, term, timestamp, price1, price2, price3, price4, price5, price6, price7, interest, fee, loanCurrency, oracleTn, collateralAmt, base, borrowed, optimal, slope1, slope2, supply } from "./variables"

export function makeLoanMintAction(loanAmt: number, rewards: number, term: number, timestamp: number) {
  return Data.to(
    new Constr(0, [
      BigInt(loanAmt), 
      BigInt(rewards), 
      BigInt(term), 
      BigInt(timestamp)
    ])
)
}

export const burnLoanAction = Data.to(new Constr(1, []))

export function makeConfigUpdateAction(loanHash: string, collateralHash: string, rewardsCS: string, oracleHash: string, interestHash: string, collateralHashz: string[]) {
  return Data.to(
    new Constr(0, [
      loanHash,
      collateralHash,
      rewardsCS,
      oracleHash,
      interestHash,
      collateralHashz,
    ])
  )
}

export const configCloseAction = Data.to(new Constr(1, []))

export function makeOracleUpdateAction(price1: number, timestamp: number, supply: number, borrowed: number) {
  return Data.to(
    new Constr(0, [
      BigInt(price1), // change this to match oracleDatum Output or it will fail
      BigInt(timestamp),
      BigInt(supply),
      BigInt(borrowed),
    ])
  )
}

export function makeInterestUpdateAction(base: number, optimal: number, slope1: number, slope2: number, term: number) {
  return Data.to(
    new Constr(0, [
      BigInt(base),
      BigInt(optimal),
      BigInt(slope1),
      BigInt(slope2),
      BigInt(term),
    ])
  )
}

export const oracleCloseAction = Data.to(new Constr(1, []))

export function makeOracleMintAction(price1: number, timestamp: number, loanCurrency: string, supply: number, borrowed: number, base: number, optimal: number, slope1: number, slope2: number, term: number) {
  return Data.to(
    new Constr(0, [
      BigInt(price1),
      BigInt(timestamp),
      BigInt(loanCurrency),
      BigInt(supply),
      BigInt(borrowed),
      BigInt(base),
      BigInt(optimal),
      BigInt(slope1),
      BigInt(slope2),
      BigInt(term),
    ])
  )
}

export const oracleBurnAction = Data.to(new Constr(1, []))
export const loanBalanceAction = Data.to(new Constr(0, [0n]))
export const loanLiquidateAction = Data.to(new Constr(0, [1n]))
export const loanCloseAction = Data.to(new Constr(0, [2n]))
export const loanRepayAction = Data.to(new Constr(0, [3n]))
export const depositYieldAction = Data.to(new Constr(0, [4n]))
export const withdrawYieldAction = Data.to(new Constr(0, [5n]))
export const rewardsMintAction = Data.to(new Constr(0, []))
export const rewardsBurnAction = Data.to(new Constr(1, []))