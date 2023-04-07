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
    const randomSeed = 2781322;

    const [loading, setLoading] = useState(true);
    const [soliditySvg, setSoliditySvg] = useState(null);
    const jsSvg = buildCosmicWorld(randomSeed);
  
    useEffect(() => {
        const fetchMetadata = async () =>  { 
          if (!id) { 
            return; 
          }
          try {
    
            const { svg, svgDataUri, traitsText } = await fetchTokenDetails(id);
            setLoading(false);
            setSoliditySvg(svgDataUri);
    
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
                Random seed: { randomSeed }
            </div>
            { loading ? ( 
                <Loading/>
            ) : (
                <div className={styles.debugPanel}>
                    <img className={styles.debug} src={soliditySvg}></img>	
                    <img className={styles.debug} src={jsSvg}></img>	
                </div>
             )}
        </div>
    )
}