import React, { Fragment, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { getReadOnlyContract } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link';
import { useEffect } from 'react';

export default function TokenCard(props) {

  const [loading, setLoading] = useState(false);
  const [svg, setSvg] = useState(null);
  const [tokenSvgDataUri, setTokenSvgDataUri] = useState(null);
  const [traitsText, setTraitsText] = useState(null);
  
  const tokenId = props.tokenid;
  console.log("rendering token card for token ID: " + tokenId);
  const link = "/token/" + tokenId;

  useEffect(() => {


    const fetchMetadata = async () =>  { 
      console.log("Getting metadata for token ID: " + tokenId);
  
        try {
          const contract = await getReadOnlyContract();
          const metadataDataUri = await contract.tokenURI(tokenId);
          var metadataJson = "";

          if (metadataDataUri.startsWith("data:text/plain,")) {
            metadataJson = metadataDataUri.replace("data:text/plain,", "");          
          } else if (metadataDataUri.startsWith("data:application/json,")) {
            metadataJson = metadataDataUri.replace("data:application/json,", "");          
          } else if (metadataDataUri.startsWith("data:application/json;base64,")) {
            const metadataJsonBase64Encoded = metadataDataUri.replace("data:application/json;base64,", "");          
            let buffer = new Buffer(metadataJsonBase64Encoded, 'base64');

            metadataJson = buffer.toString('utf-8');
          }

          console.log("METADATA: " + metadataJson);

          const metadataObject = JSON.parse(metadataJson);

          const svg = metadataObject.image.replace("data:image/svg+xml,", "");
          const encodedSvg = encodeURIComponent(svg);
          const svgDataUri = `data:image/svg+xml,${encodedSvg}`;

          console.log("SVG: " + svg);

          let planetCount = metadataObject.attributes.filter(attribute => attribute.trait_type == "planets")[0].value;
          const traitsText = "Planet count: " + planetCount;

          setLoading(false);
          setSvg(svg);
          setTokenSvgDataUri(svgDataUri);
          setTraitsText(traitsText);

        } catch (err) {
          handleError(err);
        }
      }

    fetchMetadata();

  }, []);
  
  return (
      <Card key={tokenId} className="tokenCard">
        <Card.Header>
        {/* <Link href={link}> */}
          Token ID: {tokenId}
        {/* </Link> */}
        </Card.Header>
        { loading ? (

            <Card.Body>
              <div className="cardArtwork"> 
                <Spinner animation="grow" />
              </div>   
            </Card.Body>
          ) : (
            <Card.Body>
              <div className="cardArtwork" tokenId={tokenId}>
                <Link href= { link }>
                  <img className="galleryImage" alt={ "Cosmic Worlds token " + tokenId } src={ tokenSvgDataUri } />
                </Link>
              </div>  
              <div className="cardTraits">
                { traitsText }
              </div>
            </Card.Body>
          )}
      </Card>        
  );
}
