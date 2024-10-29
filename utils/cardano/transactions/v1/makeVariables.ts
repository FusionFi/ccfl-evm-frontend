import { applyDoubleCborEncoding, applyParamsToScript, Lucid, MintingPolicy, Script, SpendingValidator, UTxO, WithdrawalValidator } from 'lucid-cardano';
import { initLucid } from '../blockfrost';
import { useEffect, useState, useCallback } from 'react';
// import { configDatum } from '../datums';
// import { ownerAddress, ownerPKH } from '../owner';
// import { configUpdateAction } from '../redeemers';
// import { configMint, configAddr } from '../validators';
// import { configUnit, rewards } from '../variables';
import plutus from '../../../plutusPreview.json';

export function makeVariables(wallet: any) {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [txHash, setTxHash] = useState<string[]>([]);

  useEffect(() => {
    if (!lucid && wallet) {
      initLucid(wallet).then((Lucid: Lucid) => {
        setLucid(Lucid);
      });
    }
  }, [lucid, wallet]);

  const createTx = useCallback(async () => {
    try {
      if (!lucid) {
        throw Error("Lucid not instantiated");
      }
      console.log(wallet);

      const ownerPKH = lucid.utils.getAddressDetails("addr_test1vqlhvhcwaddssxnkfugwlvmk69925xjdx7nc20j2nzuc0gq43pzgq")
        .paymentCredential!.hash;

      const ownerAddress = process.env.OWNER_ADDR;

      const interestPayAddr = "addr_test1vr4m7cd94yhymrwcmgs2k6zs00jql9d075ms0dgxjv2tuxqjy82wz"

      const interestPKH = lucid.utils.getAddressDetails(interestPayAddr)
        .paymentCredential!.hash;

      // const collateralComp = plutus.validators[0].compiledCode
      // const configMintComp = plutus.validators[1].compiledCode
      // const interestComp = plutus.validators[2].compiledCode
      // const loanMintComp = plutus.validators[3].compiledCode
      // const loanVaultComp = plutus.validators[4].compiledCode
      // const balanceComp = plutus.validators[5].compiledCode
      // const closeComp = plutus.validators[6].compiledCode
      // const configValComp = plutus.validators[7].compiledCode
      // const liquidateComp = plutus.validators[8].compiledCode
      // const repayComp = plutus.validators[9].compiledCode
      // const yieldDepositComp = plutus.validators[10].compiledCode
      // const yieldWithdrawComp = plutus.validators[11].compiledCode
      // const oracleMintComp = plutus.validators[12].compiledCode
      // const oracleVaultComp = plutus.validators[13].compiledCode
      // const rewardsMintComp = plutus.validators[14].compiledCode
      // const yieldVaultComp = plutus.validators[15].compiledCode

      const configMint = await readConfigMint()
      console.log(configMint);
      const configCS = lucid.utils.mintingPolicyToId(configMint)
      const configVal = await readConfigValidator()
      console.log(configVal);
      const oracleMint = await readOracleMint()
      console.log(oracleMint);
      const oracleCS = lucid.utils.mintingPolicyToId(oracleMint)
      const oracleVal = await readOracleValidator()
      console.log(oracleVal);
      const interestVal = await readInterestValidator()
      console.log(interestVal);
      const loanMint = await readLoanMint()
      console.log(loanMint);
      const loanCS = lucid.utils.mintingPolicyToId(loanMint)
      const loanVal = await readLoanValidator()
      console.log(loanVal);
      const collateralVal = await readCollateralValidator()
      console.log(collateralVal);
      const rewardsMint = await readRewardsMint()
      console.log(rewardsMint);
      const rewardsCS = lucid.utils.mintingPolicyToId(rewardsMint)
      const balance = await readBalanceValidator()
      console.log(balance)
      const liquidate = await readLiquidateValidator()
      console.log(liquidate)
      const close = await readCloseValidator()
      console.log(close)
      const repay = await readRepayValidator()
      console.log(repay)
      const deposit = await readYieldDepositValidator()
      console.log(deposit)
      const withdraw = await readYieldWithdrawValidator()
      console.log(withdraw)
      const yieldVal = await readYieldValidator()
      console.log(yieldVal)

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

      const oracleAddr = lucid.utils.validatorToAddress(oracleVal)
      const loanAddr = lucid.utils.validatorToAddress(loanVal)
      const collateralAddr = lucid.utils.validatorToAddress(collateralVal)
      const configAddr = lucid.utils.validatorToAddress(configVal)
      const balanceAddr = lucid.utils.validatorToRewardAddress(balance)
      const liquidateAddr = lucid.utils.validatorToRewardAddress(liquidate)
      const closeAddr = lucid.utils.validatorToRewardAddress(close)
      const repayAddr = lucid.utils.validatorToRewardAddress(repay)
      const interestAddr = lucid.utils.validatorToAddress(interestVal)
      const depositAddr = lucid.utils.validatorToRewardAddress(deposit)
      const withdrawAddr = lucid.utils.validatorToRewardAddress(withdraw)
      const yieldAddr = lucid.utils.validatorToAddress(yieldVal)

      // Validator Hashes //

      const oracleHash = lucid.utils.validatorToScriptHash(oracleVal)
      const loanHash = lucid.utils.validatorToScriptHash(loanVal)
      const configHash = lucid.utils.validatorToScriptHash(configVal)
      const collateralHash = lucid.utils.validatorToScriptHash(collateralVal)
      const balanceHash = lucid.utils.validatorToScriptHash(balance)
      const liquidateHash = lucid.utils.validatorToScriptHash(liquidate)
      const closeHash = lucid.utils.validatorToScriptHash(close)
      const repayHash = lucid.utils.validatorToScriptHash(repay)
      const interestHash = lucid.utils.validatorToScriptHash(interestVal)
      const depositHash = lucid.utils.validatorToScriptHash(deposit)
      const withdrawHash = lucid.utils.validatorToScriptHash(withdraw)
      const yieldHash = lucid.utils.validatorToScriptHash(yieldVal)

      const txHash = [
        ownerPKH,
        interestPKH,
        // configMint,
        configCS,
        // configVal,
        oracleCS,
        // oracleVal,
        // interestVal,
        // loanMint,
        // loanVal,
        // collateralVal,
        // rewardsMint,
        // balance,
        // liquidate,
        // close,
        // repay,
        // deposit,
        // withdraw,
        // yieldVal,
        loanCS,
        rewardsCS,
        oracleAddr,
        loanAddr,
        collateralAddr,
        configAddr,
        balanceAddr,
        liquidateAddr,
        closeAddr,
        repayAddr,
        interestAddr,
        depositAddr,
        withdrawAddr,
        yieldAddr,
        oracleHash,
        loanHash,
        configHash,
        collateralHash,
        balanceHash,
        liquidateHash,
        closeHash,
        repayHash,
        interestHash,
        depositHash,
        withdrawHash,
        yieldHash,
      ]
      
      console.log(txHash);
      setTxHash(txHash);
      return txHash;
    } catch (e: any) {
      console.log(e);
    }
  }, [lucid, wallet]);

  return { createTx, txHash };
}