
import { useEffect, useState } from "react";
import { getReadOnlyContract } from "utils/BlockchainAPI";
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

          const contract = await getReadOnlyContract();

          // const ownerAddress = (await contract.owner()).toString().toLowerCase();
          // console.log("Contract owner: " + ownerAddress);
   
          const contractAddress = await contract.getAddress();
          console.log("fetchRecentTokens: Contract address: " + contractAddress);
  
          const tokenCount = await contract.totalSupply();
          console.log("Token count: " + tokenCount);
  
          const maxToDisplay = 12;
          
          // because tokenCount is a BigInt
          const tokenCountInt = Number(tokenCount);
          for (var i = tokenCountInt - 1; i >= 0 && i >= tokenCountInt - maxToDisplay; i--) {
            console.log(i);
            // const tokenId = await contract.tokenByIndex(i);
            tokens.push(i);
  
            const metadataDataUri = await contract.tokenURI(i);
            console.log("TOKEN URI: " + metadataDataUri);
  
            if (metadataDataUri.startsWith("data:application/json;base64,")) {
              const metadataJsonBase64Encoded = metadataDataUri.replace("data:application/json;base64,", "");          
              let buffer = new Buffer(metadataJsonBase64Encoded, 'base64');
  
              const metadataJson = buffer.toString('utf-8');
  
              console.log("JSON: " + JSON.stringify(metadataJson));
  
              const metadataObject = JSON.parse(metadataJson);
  
              const svg = metadataObject.image.replace("data:image/svg+xml,", "");
              const encodedSvg = encodeURIComponent(svg);
              const svgDataUri = `data:image/svg+xml,${encodedSvg}`;  
  
              console.log("SVG: " + svg);
            }
  
          }

          console.log("TOKEN IDS: " + tokens);
          setMintCount(tokenCount);
          setTokenIds(tokens);
          setLoading(false)
    
        } catch (error) {
          const errorMessage = "An error occurred fetching recent NFT data. " + error;
          console.log(errorMessage);
          handleError(error);
          // showErrorMessage(errorMessage);
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