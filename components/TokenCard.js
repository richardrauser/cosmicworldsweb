import React, { Fragment, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { fetchTokenDetails } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from "@styles/TokenCard.module.css";

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
                <Spinner animation="grow" />
              </div>   
            </Card.Body>
          ) : (
            <Card.Body>
              <div className={styles.cardArtwork}>
                <a href= { link }>
                  <img className="tokenListImage" alt={ "Cosmic Worlds token " + tokenId } src={ tokenSvgDataUri } />
                </a>
              </div>  
              <div className="cardTraits">
                Seed: { seed } <br />
                Planets: { planetCount } <br /> 
                Stars: { starDensity } <br />
                Mountains: { mountainRoughness } <br />
                Water: { waterChoppiness } <br />
                Clouds: { cloudType } <br />
              </div>
            </Card.Body>
          )}
      </Card>        
  );
}
