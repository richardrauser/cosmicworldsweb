
import { useEffect, useState } from "react";
import { fetchRecentTokenIds, fetchTotalSupply } from "utils/BlockchainAPI";
import TokenList from "@components/TokenList";
import Loading from "@components/Loading";
import { handleError } from "utils/ErrorHandler";
import { showErrorMessage } from "utils/UIUtils";

export default function Recent() {  
    const [loading, setLoading] = useState(true);
    const [mintCount, setMintCount] = useState(null);
    const [tokenIds, setTokenIds] = useState([]);

    var tokens = [];

    useEffect(() => {

      async function fetchRecentTokens() {
        try {

          const response = await fetch("/api/recent");
          let body = await response.json();

          if (response.status != 200) {
            console.log("RESPONSE STATUS CODE: " + response.status)    
            console.log("Fetch recent error: " + JSON.stringify(body))
            handleError(body.error)    
            setMintCount("?");
            setLoading(false);
            return;
          }

          const totalSupply = await body.totalSupply;
          const tokens = await body.recent;

          setMintCount(totalSupply);
          setTokenIds(tokens);
          setLoading(false);
    
        } catch (error) {
          const errorMessage = "An error occurred fetching recent NFT data. " + error;
          console.log(errorMessage);
          handleError(error);
          setMintCount("?");
          setLoading(false);
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