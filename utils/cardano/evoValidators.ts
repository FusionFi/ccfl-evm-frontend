import { SpendingValidator, MintingPolicy, WithdrawalValidator, applyParamsToScript }  from "@lucid-evolution/lucid";
import { ownerPKH, ownerAddress, interestPayAddr, interestPKH } from "./owner";
import { plutus } from "./plutus3.json";

export const configMint = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.configMint.compiledCode,
    [ownerPKH]
  )
}

export const configCS = lucid.utils.validatorToScriptHash(configMint)

export const collateralSpend = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.collateralSpend.compiledCode,
    [configCS]
  )
}

export const collateralAddr = lucid.utils.validatorToAddress(collateralSpend)
export const collateralHash = lucid.utils.validatorToScriptHash(collateralSpend)

export const interestSpend = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.interestSpend.compiledCode,
    [oracleCS, ownerPKH]
  )
}

export const interestAddr = lucid.utils.validatorToAddress(interestSpend)
export const interestHash = lucid.utils.validatorToScriptHash(interestSpend)

export const loanMint = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.loanMint.compiledCode,
    [oracleCS, configCS]
  )
}

export const loanCS = lucid.utils.validatorToScriptHash(loanMint)

export const loanSpend = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.loanSpend.compiledCode,
    [configCS]
  )
}

export const loanAddr = lucid.utils.validatorToAddress(loanSpend)
export const loanHash = lucid.utils.validatorToScriptHash(loanSpend)

export const balanceVal = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.balanceVal.compiledCode,
    [oracleCS, configCS]
  )
}

export const balanceAddr = lucid.utils.validatorToAddress(balanceVal)
export const balanceHash = lucid.utils.validatorToScriptHash(balanceVal)

export const closeVal = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.closeVal.compiledCode,
    [loanCS, oracleCS]
  )
}

export const closeAddr = lucid.utils.validatorToAddress(closeVal)
export const closeHash = lucid.utils.validatorToScriptHash(closeVal)

export const liquidateVal = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.liquidateVal.compiledCode,
    [oracleCS, configCS]
  )
}

export const liquidateAddr = lucid.utils.validatorToAddress(liquidateVal)
export const liquidateHash = lucid.utils.validatorToScriptHash(liquidateVal)

export const repayVal = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.repayVal.compiledCode,
    [ownerCS, loanCS, configCS]
  )
}

export const repayAddr = lucid.utils.validatorToAddress(repayVal)
export const repayHash = lucid.utils.validatorToScriptHash(repayVal)

export const yieldDeposit = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.yieldDeposit.compiledCode,
    [configCS]
  )
}

export const depositAddr = lucid.utils.validatorToAddress(yieldDeposit)
export const depositHash = lucid.utils.validatorToScriptHash(yieldDeposit)

export const yieldWithdraw = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.yieldWithdraw.compiledCode,
    [configCS]
  )
}

export const withdrawAddr = lucid.utils.validatorToAddress(yieldWithdraw)
export const withdrawHash = lucid.utils.validatorToScriptHash(yieldWithdraw)

export const oracleMint = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.oracleMint.compiledCode,
    [ownerPKH, configCS]
  )
}

export const oracleCS = lucid.utils.validatorToScriptHash(oracleMint)

export const oracleSpend = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.oracleSpend.compiledCode,
    [ownerPKH, oracleCS]
  )
}

export const oracleAddr = lucid.utils.validatorToAddress(oracleSpend)
export const oracleHash = lucid.utils.validatorToScriptHash(oracleSpend)

export const rewardsMint = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.rewardsMint.compiledCode,
    [ownerPKH, configCS, loanCS]
  )
}

export const rewardsCS = lucid.utils.validatorToScriptHash(rewardsMint)

export const yieldSpend = {
  type: "PlutusV3",
  script: applyParamsToScript(
    plutus.yieldSpend.compiledCode,
    [configCS]
  )
}

export const yieldAddr = lucid.utils.validatorToAddress(yieldSpend)
export const yieldHash = lucid.utils.validatorToScriptHash(yieldSpend)

export const loanHashz = [balanceHash]
export const collateralHashz = [balanceHash, liquidateHash, closeHash, repayHash, depositHash, withdrawHash]