import React, { Fragment, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { fetchTokenDetails } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from "@styles/TokenCard.module.css";
import WorldTraits from './WorldTraits';

export default function TokenCard(props) {

  const [loading, setLoading] = useState(true);
  const [tokenSvgDataUri, setTokenSvgDataUri] = useState(null);
  const [seed, setSeed] = useState(null);
  const [planetCount, setPlanetCount] = useState(null);
  const [starDensity, setStarDensity] = useState(null);
  const [mountainRoughness, setMountainRoughness] = useState(null);
  const [waterChoppiness, setWaterChoppiness] = useState(null);
  const [cloudType, setCloudType] = useState(null);

  const tokenId = props.tokenid;
  console.log("rendering token card for token ID: " + tokenId);
  const link = "/token/" + tokenId;

  useEffect(() => {
    
    const fetchMetadata = async () =>  { 
      setLoading(true);
      try {
        const response = await fetch("/api/metadata/" + tokenId);
        let body = await response.json();
        const { svg, svgDataUri, seed, planetCount, starDensity, mountainRoughness, waterChoppiness, cloudType } = body.tokenDetails;

        setLoading(false);
        setTokenSvgDataUri(svgDataUri);
        setSeed(seed);
        setPlanetCount(planetCount);
        setStarDensity(starDensity);
        setMountainRoughness(mountainRoughness);
        setWaterChoppiness(waterChoppiness);
        setCloudType(cloudType);
      } catch (err) {
          handleError(err);
      }
    }

    fetchMetadata();

  }, []);
  
  return (
      <Card key={tokenId} className={styles.tokenCard}>
        <Card.Header>
          <a href= { link }>
          Token ID: {tokenId}
          </a>
        </Card.Header>
        { loading ? (
            <Card.Body>
              <div className={styles.cardSpinner}> 
                <Spinner />
              </div>   
            </Card.Body>
          ) : (
            <Card.Body>
              <div className={styles.cardArtwork}>
                <a href= { link }>
                  <img className="tokenListImage" alt={ "Cosmic Worlds token " + tokenId } src={ tokenSvgDataUri } />
                </a>
              </div>  
              <WorldTraits
                seed={ seed }
                planetCount={ planetCount }
                starDensity={ starDensity }
                mountainRoughness={ mountainRoughness }
                waterChoppiness={ waterChoppiness }
                cloudType={ cloudType }
              />
            </Card.Body>
          )}
      </Card>        
  );
}
