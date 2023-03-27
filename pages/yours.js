import { useEffect, useState } from "react"
import { fetchAccount, getReadOnlyContract } from '../utils/BlockchainAPI'
import TokenList from "@components/TokenList";

export default function Yours() {

    const [address, setAddress] = useState(null);
    const [tokenCount, setTokenCount] = useState(null);
    const [tokenIds, setTokenIds] = useState([]);

    var tokens = [];

    useEffect(() => {
        console.log("USE EFFECT.");
        async function fetchData() {

            const account = await fetchAccount();
            const contract = await getReadOnlyContract();
            const tokenCount = await contract.balanceOf(account);
        
            console.log("ACCOUNT: " + account);
            console.log("TOKEN COUNT: " + tokenCount);

            setAddress(account);
            setTokenCount(tokenCount.toString());

            const fetchedTokenIds = await contract.tokensOfOwnerIn(account, 0, 512);
            console.log("fetched token IDs: " + fetchedTokenIds);
            setTokenIds(fetchedTokenIds);
        }   

        fetchData();
    }, []);



    return (
        <div>
            <h1>Your Worldz</h1>
            Your wallet address: { address == null ? "Loading.." : address } <br/>      
            Your cosmic world count: { tokenCount == null ? "Loading.." : tokenCount }
            <TokenList tokens = { tokenIds } />
        </div>
    )


}