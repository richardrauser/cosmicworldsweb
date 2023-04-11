import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { fetchTokenDetails } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import styles from '@styles/TokenCardBig.module.css'
import { ImageAlt } from 'react-bootstrap-icons';
import Loading from './Loading';
import OpenSeaButton from './OpenSeaButton';

export default function TokenCardBig(props) {

  const [loading, setLoading] = useState(true);
  const [svg, setSvg] = useState(null);
  const [tokenSvgDataUri, setTokenSvgDataUri] = useState(null);
  const [traitsText, setTraitsText] = useState(null);
  
  const tokenId = props.id;
  console.log("rendering TokenCardBig for token ID: " + tokenId);
  const link = "/token/" + tokenId;

  useEffect(() => {
    const fetchMetadata = async () =>  { 
      if (!tokenId) { 
        return; 
      }
      try {

        const { svg, svgDataUri, seed, planetCount, starDensity, mountainRoughness, waterChoppiness } = await fetchTokenDetails(tokenId);
        setLoading(false);
        setSvg(svg);
        setTokenSvgDataUri(svgDataUri);
        setTraitsText(`Seed: ${seed}, planet count: ${planetCount}, stars: ${starDensity}, mountains: ${mountainRoughness}, water: ${waterChoppiness}`);

        } catch (error) {
          console.log("Error occurred fetching token metadata: ", error);
          setLoading(false);
          setSvg(null);
          setTokenSvgDataUri(null);
          setTraitsText("Could not load NFT.");
          handleError(error);
        }
      }

    fetchMetadata();

  });
  
  return (
      <Card key={tokenId} className={styles.tokenCard}>
        <Card.Header>
          Token ID: {tokenId}
        </Card.Header>
        { loading ? (

            <Card.Body>
              <div className={styles.cardArtwork}> 
                <Loading loadingText="Loading NFT.."/>
              </div>   
            </Card.Body>
          ) : (
            <Card.Body>
              <div className={styles.cardArtwork}>
                  { tokenSvgDataUri ? (
                    <img className="tokenListImage" alt={ "Cosmic Worlds token " + tokenId } src={ tokenSvgDataUri } /> 
                  ) : (
                    <ImageAlt className="tokenListImage" />
                  )}
              </div>  
              <div className="cardTraits">
                { traitsText }
              </div>
              <div className="cardButtonArea">
                <OpenSeaButton tokenid={tokenId}/>
              </div>
            </Card.Body>
          )}
      </Card>        
  );
}
