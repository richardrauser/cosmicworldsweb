import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { fetchTokenDetails } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import styles from '@styles/TokenCardBig.module.css'
import { ImageAlt } from 'react-bootstrap-icons';
import Loading from './Loading';
import OpenSeaButton from './OpenSeaButton';
import WorldTraits from './WorldTraits';

export default function TokenCardBig(props) {

  const [loading, setLoading] = useState(true);
  const [svg, setSvg] = useState(null);
  const [tokenSvgDataUri, setTokenSvgDataUri] = useState(null);
  const [traits, setTraits] = useState(null);
  const [traitsError, setTraitsError] = useState(null);
  
  const tokenId = props.id;
  console.log("rendering TokenCardBig for token ID: " + tokenId);
  const link = "/token/" + tokenId;

  useEffect(() => {
    const fetchMetadata = async () =>  { 
      if (!tokenId) { 
        return; 
      }
      try {

        const response = await fetch("/api/metadata/" + tokenId);
        let body = await response.json();
        const { svg, svgDataUri, seed, planetCount, starDensity, mountainRoughness, waterChoppiness, cloudType } = body.tokenDetails;

        setLoading(false);
        setSvg(svg);
        setTokenSvgDataUri(svgDataUri);
        setTraits({ seed, planetCount, starDensity, mountainRoughness, waterChoppiness, cloudType });
        setTraitsError(null);

        } catch (error) {
          console.log("Error occurred fetching token metadata: ", error);
          setLoading(false);
          setSvg(null);
          setTokenSvgDataUri(null);
          setTraits(null);
          setTraitsError("Could not load NFT.");
          handleError(error);
        }
      }

    fetchMetadata();
  }, [tokenId]);
  
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
              <div className={styles.cardDetail}>
                { traits ? (
                  <WorldTraits
                    seed={ traits.seed }
                    planetCount={ traits.planetCount }
                    starDensity={ traits.starDensity }
                    mountainRoughness={ traits.mountainRoughness }
                    waterChoppiness={ traits.waterChoppiness }
                    cloudType={ traits.cloudType }
                  />
                ) : (
                  <div className="cardTraits">
                    { traitsError }
                  </div>
                )}
                <div className={styles.cardActions}>
                  <OpenSeaButton tokenid={tokenId}/>
                </div>
              </div>
            </Card.Body>
          )}
      </Card>        
  );
}
