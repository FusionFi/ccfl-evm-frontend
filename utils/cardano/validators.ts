import {
  SpendingValidator,
  MintingPolicy,
  applyParamsToScript,
  applyDoubleCborEncoding,
  WithdrawalValidator,
} from "lucid-cardano";
import { lucid } from "./blockfrost"
import { interestPKH, ownerPKH } from "./owner"
import plutus from '../../plutusPreview.json'

export const configMint = await readConfigMint()
export const configCS = lucid.utils.mintingPolicyToId(configMint)
export const configVal = await readConfigValidator()
export const oracleMint = await readOracleMint()
export const oracleCS = lucid.utils.mintingPolicyToId(oracleMint)
export const oracleVal = await readOracleValidator()
export const interestVal = await readInterestValidator()
export const loanMint = await readLoanMint()
export const loanCS = lucid.utils.mintingPolicyToId(loanMint)
export const loanVal = await readLoanValidator()
export const collateralVal = await readCollateralValidator()
export const rewardsMint = await readRewardsMint()
export const rewardsCS = lucid.utils.mintingPolicyToId(rewardsMint)
export const balance = await readBalanceValidator()
export const liquidate = await readLiquidateValidator()
export const close = await readCloseValidator()
export const repay = await readRepayValidator()
export const deposit = await readYieldDepositValidator()
export const withdraw = await readYieldWithdrawValidator()
export const yieldVal = await readYieldValidator()

// --- Supporting functions

async function readCollateralValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[0];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [configCS]
    ),
  };
}

async function readConfigMint(): Promise<MintingPolicy> {
  const validator = plutus.validators[1];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [ownerPKH]
    ),
  };
}

async function readInterestValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[2];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [oracleCS, ownerPKH]
    ),
  };
}

async function readLoanMint(): Promise<MintingPolicy> {
  const validator = plutus.validators[3];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [oracleCS, configCS]
    ),
  };
}

async function readLoanValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[4];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [configCS]
    ),
  };
}

async function readBalanceValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[5];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [oracleCS, configCS]
    ),
  }
}

async function readCloseValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[6];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [loanCS, oracleCS]
    ),
  }
}

async function readConfigValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[7];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [ownerPKH, configCS]
    ),
  };
}

async function readLiquidateValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[8];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [oracleCS, configCS]
    ),
  }
}

async function readRepayValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[9];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [interestPKH, oracleCS, configCS]
    ),
  }
}

async function readYieldDepositValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[10];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [configCS]
    ),
  }
}

async function readYieldWithdrawValidator(): Promise<WithdrawalValidator> {
  const validator = plutus.validators[11];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [configCS]
    ),
  }
}

async function readOracleMint(): Promise<MintingPolicy> {
  const validator = plutus.validators[12]
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [ownerPKH, configCS]
    ),
  }
}

async function readOracleValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[13];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [ownerPKH, oracleCS]
    ),
  };
}

async function readRewardsMint(): Promise<MintingPolicy> {
  const validator = plutus.validators[14];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [ownerPKH, configCS, loanCS]
    ),
  };
}

async function readYieldValidator(): Promise<SpendingValidator> {
  const validator = plutus.validators[15];
  return {
    type: "PlutusV2",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validator.compiledCode), [configCS]
    ),
  };
}

// Validator Addresses //

export const oracleAddr = lucid.utils.validatorToAddress(oracleVal)
export const loanAddr = lucid.utils.validatorToAddress(loanVal)
export const collateralAddr = lucid.utils.validatorToAddress(collateralVal)
export const configAddr = lucid.utils.validatorToAddress(configVal)
export const balanceAddr = lucid.utils.validatorToRewardAddress(balance)
export const liquidateAddr = lucid.utils.validatorToRewardAddress(liquidate)
export const closeAddr = lucid.utils.validatorToRewardAddress(close)
export const repayAddr = lucid.utils.validatorToRewardAddress(repay)
export const interestAddr = lucid.utils.validatorToAddress(interestVal)
export const depositAddr = lucid.utils.validatorToRewardAddress(deposit)
export const withdrawAddr = lucid.utils.validatorToRewardAddress(withdraw)
export const yieldAddr = lucid.utils.validatorToAddress(yieldVal)

// Validator Hashes //

export const oracleHash = lucid.utils.validatorToScriptHash(oracleVal)
export const loanHash = lucid.utils.validatorToScriptHash(loanVal)
export const configHash = lucid.utils.validatorToScriptHash(configVal)
export const collateralHash = lucid.utils.validatorToScriptHash(collateralVal)
export const balanceHash = lucid.utils.validatorToScriptHash(balance)
export const liquidateHash = lucid.utils.validatorToScriptHash(liquidate)
export const closeHash = lucid.utils.validatorToScriptHash(close)
export const repayHash = lucid.utils.validatorToScriptHash(repay)
export const interestHash = lucid.utils.validatorToScriptHash(interestVal)
export const depositHash = lucid.utils.validatorToScriptHash(deposit)
export const withdrawHash = lucid.utils.validatorToScriptHash(withdraw)
export const yieldHash = lucid.utils.validatorToScriptHash(yieldVal)

export const loanHashz = [balanceHash]
export const collateralHashz = [balanceHash, liquidateHash, closeHash, repayHash, depositHash, withdrawHash]