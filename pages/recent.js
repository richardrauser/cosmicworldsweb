
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getContract } from "utils/BlockchainAPI"
import AlienNavBar from "components/AlienNavBar";
import TokenList from "@components/TokenList";

export default function Recent() {  
    const [mintCount, setMintCount] = useState(null);
    const [tokenIds, setTokenIds] = useState(null);

    useEffect(() => {
      console.log("USE EFFECT.");

      async function fetchTokenCount() {
        const contract = await getContract();

        // const ownerAddress = (await contract.owner()).toString().toLowerCase();
        // console.log("Contract owner: " + ownerAddress);
 
        const contractAddress = await contract.getAddress();
        console.log("Contract address: " + contractAddress);

        const tokenCount = await contract.totalSupply();
        console.log("Token count: " + tokenCount);

        var tokens = [];
        const maxToDisplay = 12;

        // because tokenCount is a BigInt
        const tokenCountInt = Number(tokenCount);
        for (var i = tokenCountInt - 1; i >= 0 && i >= tokenCountInt - maxToDisplay; i--) {
          console.log(i);
          // const tokenId = await contract.tokenByIndex(i);
          tokens.push(i);

          // const metadataDataUri = await contract.tokenURI(i);
          // console.log("TOKEN URI: " + metadataDataUri);

          // if (metadataDataUri.startsWith("data:application/json;base64,")) {
          //   const metadataJsonBase64Encoded = metadataDataUri.replace("data:application/json;base64,", "");          
          //   let buffer = new Buffer(metadataJsonBase64Encoded, 'base64');

          //   const metadataJson = buffer.toString('utf-8');

          //   console.log("JSON: " + JSON.stringify(metadataJson));

          //   const metadataObject = JSON.parse(metadataJson);

          //   const svg = metadataObject.image.replace("data:image/svg+xml,", "");
          //   const encodedSvg = encodeURIComponent(svg);
          //   const svgDataUri = `data:image/svg+xml,${encodedSvg}`;  


          //   console.log("SVG: " + svg);
          // }

        }

        console.log("TOKEN IDS: " + tokens);
        // setMintCount(tokenCount);
        // setTokenIds(tokens);
      }

      fetchTokenCount();
    });




    return (
      <div>
        {/* <AlienNavBar/> */}

        <h1>Recent Worldz</h1>

        {/* Total minted worlds: { mintCount == null ? "Loading.." : String(mintCount) } */}

        {/* { tokenIds } */}

        {/* <TokenList tokens = { tokenIds } /> */}
        {/* <Button onClick={() => setMintCount(mintCount + 1)}>Set Count</Button> */}

      </div>
    )
}