import { useEffect, useState } from "react"
import { fetchAccount } from '../utils/BlockchainAPI'

export default function Yours() {

    const [address, setAddress] = useState(null);

    useEffect(() => {
        console.log("USE EFFECT.");
        async function fetchWalletAddress() {

            const account = await fetchAccount();

            console.log("ACCOUNT: " + account);

            setAddress(account);
        }

        fetchWalletAddress();
    })



    return (
        <div>
        <h1>Your Worldz</h1>
        Your wallet address: { address == null ? "Loading.." : address }            
        </div>
    )


}