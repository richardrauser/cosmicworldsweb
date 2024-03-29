import { useEffect, useState } from "react"
import { fetchAccount, getReadOnlyContract, getReadWriteContract } from '../utils/BlockchainAPI';
import TokenList from "@components/TokenList";
import Loading from "@components/Loading";
import { handleError } from "utils/ErrorHandler";

export default function Yours() {

    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(null);
    const [tokenCount, setTokenCount] = useState(null);
    const [tokenIds, setTokenIds] = useState([]);

    var tokens = [];

    useEffect(() => {
        console.log("USE EFFECT.");
        async function fetchData() {

            try {
                if (!window.ethereum) {
                    setAddress("not connected");
                    setTokenCount("0");
                    setLoading(false);
                    return;
                }
    
                const account = await fetchAccount();
                const contract = await getReadWriteContract();
                const tokenCount = await contract.balanceOf(account);
            
                console.log("ACCOUNT: " + account);
                console.log("TOKEN COUNT: " + tokenCount);
    
                setAddress(account);
                setTokenCount(tokenCount.toString());
    
                const fetchedTokenIds = await contract.tokensOfOwnerIn(account, 0, 512);
                console.log("fetched token IDs: " + fetchedTokenIds);
                setTokenIds(fetchedTokenIds);
                setLoading(false);
    
            } catch (error) {
                const errorMessage = "An error occurred fetching your NFTs. " + error;
                console.log(errorMessage);
                handleError(error);
                setTokenIds([]);
                setTokenCount("?");
                setLoading(false)
            }
        }   

        fetchData();
    }, []);



    return (
        <div>

        { loading ? (

            <div className="contentPanel">
            <h1>Your Worlds</h1>
                <Loading/>
            </div>
         ) : (
            <div>

                    <div className="contentPanel">
                        <h1>Your Worldz</h1>
                        Your wallet address: { address == null ? "Loading.." : address } <br/>      
                        Your cosmic world count: { tokenCount == null ? "Loading.." : tokenCount }
                    </div>
                    <TokenList tokens = { tokenIds } />
            </div>

        )}
    
        </div>
    )  
    
}
    


