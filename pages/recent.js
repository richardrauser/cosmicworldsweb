
import { useEffect, useState } from "react";
import { fetchRecentNfts, fetchTotalSupply } from "utils/BlockchainAPI";
import TokenList from "@components/TokenList";
import Loading from "@components/Loading";
import { handleError } from "utils/ErrorHandler";

export default function Recent() {  
    const [loading, setLoading] = useState(true);
    const [mintCount, setMintCount] = useState(null);
    const [tokenIds, setTokenIds] = useState([]);

    var tokens = [];

    useEffect(() => {
      console.log("USE EFFECT.");

      async function fetchRecentTokens() {

        try {

          const tokens = await fetchRecentNfts();
          const totalSupply = await fetchTotalSupply();

          console.log("TOKEN IDS: " + tokens);
          // TO
          setMintCount(totalSupply);
          setTokenIds(tokens);
          setLoading(false)
    
        } catch (error) {
          const errorMessage = "An error occurred fetching recent NFT data. " + error;
          console.log(errorMessage);
          handleError(error);
          setMintCount("?");
          setLoading(false)
        }

      }

      fetchRecentTokens();
    }, []);

    return (
      <div>

        { loading ? (

          <div className="contentPanel">
          <h1>Recent Worldz</h1>
          <Loading/>
          </div>


        ) : (
          <div>
            <div className="contentPanel">
              <h1>Recent Worlds</h1>
              Total minted worlds: { mintCount == null ? "Loading.." : String(mintCount) + " / 512. These are the most recent 12!" } 
            </div>

            <TokenList tokens = { tokenIds } />
          </div>
        )}
      </div>
    )
}