import React, { Fragment, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { fetchTokenDetails, getReadOnlyContract } from '../utils/BlockchainAPI';
import { handleError } from '../utils/ErrorHandler';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from '@styles/TokenCardBig.module.css'
import { ImageAlt } from 'react-bootstrap-icons';
import Loading from './Loading';

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

        const { svg, svgDataUri, traitsText } = await fetchTokenDetails(tokenId);
        setLoading(false);
        setSvg(svg);
        setTokenSvgDataUri(svgDataUri);
        setTraitsText(traitsText);

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
            </Card.Body>
          )}
      </Card>        
  );
}
