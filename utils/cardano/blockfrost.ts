'use client';

import { Lucid, Blockfrost, Assets } from "@lucid-evolution/lucid";
import { Wallets } from "@/wallets/index.wallet";
import { useSelector } from "react-redux";
import { AppState } from "@/store/index.store";
import { getLucid } from "@/libs/lucid.lib";

export async function initLucid(wallet: any) {

	console.log("Lets go");
	const newlucid = await Lucid(
		new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewiKYeItqp0rybitGGcRp3csHYRk01p3fd"),
		"Preview",
	)
	// const lucid = await getLucid()
	const _wallet = new Wallets[wallet.metadata.id]();
	const api = await _wallet.getApi();
	newlucid.selectWallet.fromAPI(api);

	console.log("We are here");
	return newlucid;
};

function sumAssets(...assets: Assets[]) {
	return assets.reduce((a, b) => {
		for (const k in b) {
			if (b.hasOwnProperty(k)) {
				a[k] = (a[k] || 0n) + b[k];
			}
		}
		return a;
	}, {});
}

export async function getBalance(lucid: Lucid, addr: string) {
	if (lucid) {
		const utxo_lovelace = await lucid.utxosAt(addr);
		const summedassets = utxo_lovelace
			.map((utxo) => utxo.assets)
			.reduce((acc, assets) => sumAssets(acc, assets), {});
		return summedassets.lovelace;
	}
}

export function getPkh(lucid: Lucid, addr: string) {
	if (lucid) {
		const pkh = lucid.utils.getAddressDetails(addr).paymentCredential!.hash;
		return pkh
	}
}