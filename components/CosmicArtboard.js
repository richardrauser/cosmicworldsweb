
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from "react";
import buildCosmicWorld from '../utils/worldBuilder.js';
import { mintCosmicWorld, mintTenCosmicWorlds } from '../utils/BlockchainAPI.js';
import { handleError } from 'utils/ErrorHandler.js';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ArrowRepeat } from 'react-bootstrap-icons';
import ethereum from '../images/ethereum-white.png';
import styles from '@styles/CosmicArtboard.module.css';
import Loading from './Loading.js';
import { Hearts } from 'react-bootstrap-icons';

export default function CosmicArtboard() {
    
    const randomCeiling = 5_000_000;
    const [randomSeed, setRandomSeed] = useState(null);
    const [svg, setSvg] = useState(null);

    const updateSeed = () => {
        const seed = Math.trunc(Math.random() * randomCeiling);
        console.log("Regerating with seed: " + seed);
        const svg = buildCosmicWorld(seed);
        setRandomSeed(seed);
        setSvg(svg);
    };


    useEffect(() => {
        updateSeed();
      }, []);

      const mint = async () => {
        
        console.log("Minting..");
        console.log("Random seed: " + randomSeed);
        try {
            await mintCosmicWorld(randomSeed);
            toast.success("Successfully minted your Cosmic Worlds NFT!");
        } catch (error)  {
            console.log("Error Minting: " + JSON.stringify(error));                        
            handleError(error);
        }       
    };

    const mintTen = async () => {
                try {
            await mintTenCosmicWorlds();
            toast.success("Successfully minted 10 Cosmic Worlds NFTs!");
        } catch (error)  {
            console.log("Error Minting: " + JSON.stringify(error));
            handleError(error);
        }       
    };

    return(
        <div>
        { !randomSeed || !svg ? (
            <Loading/>
        ) : (
            <div>
            <div className={styles.artboard}>
                <img className={styles.artboardImage} src={svg}></img>	
            </div>	        
            <div className={styles.detail}>
                Random seed: { randomSeed }<br/>
                <Button variant="primary" className={styles.keyAction} onClick={updateSeed}>    
                    <div className="buttonIcon">
                    <ArrowRepeat />
                    </div>
                    Generate
                </Button>
                <Button variant="primary" className={styles.keyAction} onClick={mint} randomseed={randomSeed}>
                    <div className="buttonIcon">
                        <Image src={ethereum} alt="ethereum logo" />
                    </div>
                    Mint for free
                </Button><br/>
                (only pay gas)<br/>
                <Button variant="primary" className={styles.keyAction} onClick={mintTen} randomseed={randomSeed}>
                    <div className="buttonIcon">
                        <Hearts />
                    </div>
                    Mint 10 randoms
                </Button><br/>
                (huge savings- 10 NFTs for the gas cost of 3 single mints)<br/>
            </div>
        </div> 
        )}
    </div>
   );
}