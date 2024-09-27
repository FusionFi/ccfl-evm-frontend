import { lucid } from "../blockfrost"
import { balanceAddr, closeAddr, depositAddr, liquidateAddr, repayAddr, withdrawAddr } from "../validators"
import { ownerAddress } from "../owner"

lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./owner.sk"));

export async function registerStake() {
  const tx = await lucid
    .newTx()
    // balanceAddr | liquidateAddr | closeAddr | repayAddr | depositAddr | withdrawAddr
    .registerStake(repayAddr)
    .complete()

  const txSigned = await tx.sign().complete()

  return txSigned.submit()
}

export async function splitUtxos() {
  const tx = await lucid
    .newTx()
    .payToAddress(ownerAddress, { lovelace: 100000000n })
    .payToAddress(ownerAddress, { lovelace: 100000000n })
    .payToAddress(ownerAddress, { lovelace: 100000000n })
    .payToAddress(ownerAddress, { lovelace: 100000000n })
    .payToAddress(ownerAddress, { lovelace: 100000000n })
    .complete()

  const signedTx = await tx.sign().complete()

  return signedTx.submit()
}