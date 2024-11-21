import { fromText, fromUnit, toUnit, } from '@lucid-evolution/lucid';
import { configCS } from "./evoValidators"

export const oracleTokenName = "828ae0f58d7ffe9cf371f414635d6c01" // "7ffe9771909a9436779f205bfda90501" // for testing purposes
export const loanTokenName = "" // for testing purposes

export const price1 = 500
export const price2 = 550
export const price3 = 600
export const price4 = 450
export const price5 = 400
export const price6 = 265
export const price7 = 50

export const base = 55
export const optimal = 70
export const slope1 = 40
export const slope2 = 300
export const supply = 1000000
export const borrowed = 200000

export const collateral = fromText("ADA")
export const collateralAmt = 400000000
export const loanCurrency = fromText("USDT")
export const loanAmt = 100
export const timestamp = new Date().getTime()
export const interest = 15
export const fee = 2
export const term = 0
export const rewards = 100
export const yieldDatumText = fromText("loan")
export const yieldAmount = 100

export const oracleUnit = "eb794aac8cdc0cc937d712f1cea95713d7244f6d42a95dcb7b9201989cf8f06b8555893a1df9cce9375733"

export const oracleTn = fromUnit(oracleUnit).assetName

export const configTN = fromText("")
export const configUnit = toUnit(configCS, configTN)

// $100 loan test for interest payments
export const loanUnit = "a1872cb404df1918654015c9ec240b0d0866d688091da03114391508d29dda177d877fc3456e5ce6d2dcae"

export function interestCalc(
  base: number,
  optimal: number,
  slope1: number,
  slope2: number,
  supply: number,
  borrowed: number,
) {
  const utilisation = borrowed / supply
  console.log(`utilisation: ${utilisation}`)
  if (utilisation <= optimal) {
    const ratio = utilisation / optimal
    console.log(`ratio: ${ratio}`)
    const variable = ratio * slope1
    console.log(`variable: ${variable}`)
    const combined = base + variable
    console.log(`combined: ${combined}`)
    return combined
  } else {
    const slope = base + slope1
    const nominator = utilisation - optimal
    const denominator = 100 - optimal
    const ratio = nominator / denominator
    const variableFee = ratio * slope2
    const combined = slope + variableFee
    return combined
  }
}