import { toHex, toUnit, UTxO, Data } from "lucid-cardano";
import { lucid } from "../blockfrost"
import { oracleDatum1, oracleDatum6, oracleDatum2, oracleDatum3, oracleDatum4, oracleDatum5, interestDatum, interestDatum2 } from "../datums";
import { ownerAddress, ownerPKH } from "../owner";
import { oracleMintAction, oracleUpdateAction, oracleCloseAction, oracleBurnAction, interestUpdateAction } from "../redeemers";
import { configAddr, oracleCS, oracleMint, oracleAddr, oracleVal, interestAddr, interestVal } from "../validators";
import { configUnit, oracleUnit } from "../variables";

lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./owner.sk"));

export async function mintOracle() {
  console.log(`ORACLE TRANSACTION - MINT
`)
  const oracleDatum = oracleDatum1
  const utxos: [UTxO] = await lucid.utxosAt(ownerAddress)
  const utxo: UTxO = utxos[0]
  const configUtxos: [UTxO] = await lucid.utxosAtWithUnit(configAddr, configUnit)
  const configIn: UTxO = configUtxos[0]
  const oracleTN = utxo.txHash.slice(0, 30).concat(toHex(utxo.outputIndex))
  const oracleUnit = toUnit(oracleCS, oracleTN)
  console.log(`Oracle Unit: 
    `, oracleUnit, `
  `)
  console.log(`Oracle Price: 
    `, Data.from(oracleDatum).fields[0], `
  `)

  const tx = await lucid
    .newTx()
    .collectFrom([utxo])
    .readFrom([configIn])
    .mintAssets({
      [oracleUnit]: 2,
    }, oracleMintAction)
    .attachMintingPolicy(oracleMint)
    .payToContract(
      oracleAddr,
      { inline: oracleDatum },
      { [oracleUnit]: 1 }
    )
    .payToContract(
      interestAddr,
      { inline: interestDatum },
      { [oracleUnit]: 1 }
    )
    .addSignerKey(ownerPKH)
    .complete()

  const txSigned = await tx.sign().complete()

  return txSigned.submit()
}

// Oracle Update Functions //

export async function oAutoUpdate() {
  console.log(`ORACLE TRANSACTION - UPDATE
    `)
  const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
  const utxo: UTxO = utxos[0]

  console.log(utxo)

  const oracleDatum = oracleDatum6

  const tx = await lucid
    .newTx()
    .collectFrom([utxo], oracleUpdateAction)
    .payToContract(
      oracleAddr,
      { inline: oracleDatum },
      { [oracleUnit]: 1 }
    )
    .attachSpendingValidator(oracleVal)
    .addSignerKey(ownerPKH)
    .complete()

  const txSigned = await tx.sign().complete()

  console.log(`Oracle Price: `, Data.from(oracleDatum).fields[0])

  return txSigned.submit()

}

export async function oManualUpdate() {
  console.log(`ORACLE TRANSACTION - UPDATE
    `)
  const utxos: [UTxO] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
  const utxo: UTxO = utxos[0]
  const oracleDatum = oracleDatum1

  const tx = await lucid
    .newTx()
    .collectFrom([utxo], oracleUpdateAction)
    .payToContract(
      oracleAddr,
      { inline: oracleDatum },
      { [oracleUnit]: 1 }
    )
    .attachSpendingValidator(oracleVal)
    .addSignerKey(ownerPKH)
    .complete()

  const txSigned = await tx.sign().complete()

  console.log(`Oracle Price: `, Data.from(oracleDatum).fields[0])
  return txSigned.submit()
}

export async function oracleClose() {
  console.log(`ORACLE TRANSACTION - CLOSE
    `)

  const utxos: UTxO[] = await lucid.utxosAtWithUnit(oracleAddr, oracleUnit)
  const utxo: UTxO = utxos[0]
  const iUtxos: UTxO[] = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
  const interestUtxo: UTxO = iUtxos[0]
  console.log(utxo)
  console.log(interestUtxo)

  const tx = await lucid
    .newTx()
    .collectFrom([utxo], oracleCloseAction)
    .collectFrom([interestUtxo], oracleCloseAction)
    .attachSpendingValidator(oracleVal)
    .attachSpendingValidator(interestVal)
    .mintAssets({
      [oracleUnit]: -2n,
    }, oracleBurnAction)
    .attachMintingPolicy(oracleMint)
    .addSignerKey(ownerPKH)
    .complete()

  const txSigned = await tx.sign().complete()

  return txSigned.submit()
}

export async function updateInterest() {
  console.log(`INTEREST TRANSACTION - UPDATE
    `)

  const utxos: UTxO[] = await lucid.utxosAtWithUnit(interestAddr, oracleUnit)
  const utxo: UTxO = utxos[0]

  // const interestDatum = interestDatum2

  const tx = await lucid
    .newTx()
    .collectFrom([utxo], interestUpdateAction)
    .attachSpendingValidator(interestVal)
    .payToContract(
      interestAddr,
      { inline: interestDatum },
      { [oracleUnit]: 1n },
    )
    .addSignerKey(ownerPKH)
    .complete()

  const txSigned = await tx.sign().complete()

  return txSigned.submit()
}