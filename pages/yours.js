import { useEffect, useState } from "react"
import { fetchAccount, getReadOnlyContract } from '../utils/BlockchainAPI'

export default function Yours() {

    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        console.log("USE EFFECT.");
        async function fetchWalletAddress() {

            const account = await fetchAccount();
            const contract = await getReadOnlyContract();
            const tokenCount = await contract.balanceOf(account);
        
            console.log("ACCOUNT: " + account);
            console.log("BALANCE: " + balance);

            setAddress(account);
            setBalance(tokenCount);
        }

        fetchWalletAddress();
    })



    return (
        <div>
        <h1>Your Worldz</h1>
        Your wallet address: { address == null ? "Loading.." : address } <br/>      
        Your tokens: { balance == null ? "Loading.." : balance }
        </div>
    )


}