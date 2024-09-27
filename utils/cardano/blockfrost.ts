import { Blockfrost, Lucid, } from "lucid-cardano";

const BLOCKFROST = process.env.BLOCKFROST

export const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFROST,
  ),
  "Preview",
);