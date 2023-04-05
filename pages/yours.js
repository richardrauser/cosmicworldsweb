import { useEffect, useState } from "react"
import { fetchAccount, getReadOnlyContract } from '../utils/BlockchainAPI'
import TokenList from "@components/TokenList";
import Loading from "@components/Loading";

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
                    
                    return;
                }
    
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
                setLoading(false);
    
            } catch (error) {
                const errorMessage = "An error occurred fetching your NFT data. " + error;
                console.log(errorMessage);
                showErrorMessage(errorMessage);
                setTokenIds([]);
                setLoading(false)
            }
        }   

        fetchData();
    }, []);



    return (
        <div>

        { loading ? (

            <div className="contentPanel">
            <h1>Your Worldz</h1>
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
    


