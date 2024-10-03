'use client'

import { useCardanoConnected } from "@/hooks/auth.hook";
import { useCardanoWalletConnected, useCardanoWalletConnect } from "@/hooks/cardano-wallet.hook";
import { useNotification } from "@/hooks/notifications.hook";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import cardanoWalletReducer from "@/reducers/cardano-wallet.reducer";
import { AppState, AppStore } from "@/store/index.store";
import { useState, useMemo, useCallback } from "react";
import TestTx from "@/utils/cardano/testTx";
import * as testie from "@/libs/testtx.lib";
import TestTxComponent from "@/utils/cardano/useTxComponent";
import { useAccount } from "wagmi";


export default function CardanoPage() {
    const { address, isConnected } = useAccount();
    const [cardanoWalletConnected] = useCardanoWalletConnected();
    console.log(cardanoWalletConnected, 'cardanoWalletConnected')
    const [networkInfo, setNetworkInfo] = useState<any | null>(null);
    const [isCardanoConnected] = useCardanoConnected();

    const isConnected_ = useMemo(() => {
        if (!!cardanoWalletConnected?.address) {
            return true;
        }

        if (isConnected && networkInfo) {
            return true;
        }
        return false
    }, [isConnected, cardanoWalletConnected?.address, networkInfo])

    console.log(cardanoWalletConnected, 'cardanoWalletConnected.address')

    //connect wallet
    const [showSuccess, showError, showWarning, contextHolder] = useNotification();

    const testTheTx = useCallback(async () => {
        try {
            const result = await testie.testTx(cardanoWalletConnected);
            console.log("TxId: ", result);
        } catch (e) {
            if (e?.info || e?.message) {
                console.log(e?.info || e?.message)
            } else {
                console.log(e);
                let index = e.indexOf("[AIKEN validator ERROR]");
                if (index >= 0) {
                    console.log('no need.')
                } else {

                }
            }
        } finally {

        }
    }, [cardanoWalletConnected.address])


    return (
        <>
            <main className="flex items-center justify-center">
                <div>
                    <h1>Lucid</h1>
                    <div>
                        <h2>Lucid</h2>
                        <p>Lucid is a Cardano wallet that uses Blockfrost to interact with the Cardano blockchain. It is a simple, easy-to-use wallet that allows you to send and receive ADA, as well as view your transaction history.</p>
                    </div>
                    <div className="flex">

                        <div className="grid grid-cols-2 items-center justify-center w-full gap-4">
                            <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
                                <button onClick={testTheTx} >Connect Wallet</button>
                                {/* <button onClick={() => {
                                    if (!isCardanoConnected) {
                                        showWarning('No wallet connected')
                                        return
                                    }
                                    console.log(cardanoWalletConnected.address)
                                    TestTx(cardanoWalletConnected)
                                }}>Connect Wallet</button> */}
                            </div>
                            {/* <TestTxComponent wallet={cardanoWalletConnected} /> */}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});