import React, { Fragment, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { fetchTokenDetails, getReadOnlyContract } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from "@styles/TokenCard.module.css";

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

      try {

        const { svg, svgDataUri, traitsText } = await fetchTokenDetails(tokenId)
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
      <Card key={tokenId} className={styles.tokenCard}>
        <Card.Header>
          <a href= { link }>
          Token ID: {tokenId}
          </a>
        </Card.Header>
        { loading ? (

            <Card.Body>
              <div className={styles.cardArtwork}> 
                <Spinner animation="grow" />
              </div>   
            </Card.Body>
          ) : (
            <Card.Body>
              <div className="cardArtwork" tokenId={tokenId}>
                <Link href= { link }>
                  <img className="tokenListImage" alt={ "Cosmic Worlds token " + tokenId } src={ tokenSvgDataUri } />
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
