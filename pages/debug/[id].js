import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import buildCosmicWorld from '../../utils/worldBuilder.js';
import Loading from "@components/Loading.js";
import { handleError } from '../../utils/ErrorHandler';
import { fetchTokenDetails } from '../../utils/BlockchainAPI';
import styles from '@styles/Debug.module.css'

export default function Token() {
    const router = useRouter();
    const id = router.query.id;
    console.log("TOKEN ID : " + id);

    const [loading, setLoading] = useState(true);
    const [soliditySvg, setSoliditySvg] = useState(null);
    const [seed, setSeed] = useState(null);
    const [jsSvg, setJsSvg] = useState(null);
  
    useEffect(() => {
        const fetchMetadata = async () =>  { 
          if (!id) { 
            return; 
          }
          try {
    
            const { svg, svgDataUri, seed, planetCount, starDensity, mountainRoughness, waterChoppiness } = await fetchTokenDetails(id);
            setLoading(false);
            setSoliditySvg(svgDataUri);
            setSeed(seed);
            setJsSvg(buildCosmicWorld(seed));
    
            } catch (error) {
              console.log("Error occurred fetching token metadata: ", error);
              setLoading(false);
              setSoliditySvg(null);
              handleError(error);
            }
          }
    
        fetchMetadata();
    
      });

    return (
        <div>
            <div className="contentPanel">
                <h1>Debug</h1>
                Token ID: { id } <br/>
                Random seed: { seed }
            </div>
            { loading ? ( 
                <Loading/>
            ) : (
                <div className={styles.debugPanel}>
                    <div className={styles.debug}> 
                        Solidity
                        <img src={soliditySvg}></img>	
                    </div>
                    <div className={styles.debug}> 
                        JavaScript                
                        <img src={jsSvg}></img>	
                    </div>
                </div>
             )}
        </div>
    )
}