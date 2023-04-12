
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from "react";
import buildCosmicWorld from '../utils/worldBuilder.js';
import { mintCosmicWorld } from '../utils/BlockchainAPI.js';
import { handleError } from 'utils/ErrorHandler.js';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { ArrowRepeat } from 'react-bootstrap-icons';
import ethereum from '../images/ethereum-white.png';
import styles from '@styles/CosmicArtboard.module.css';
import Loading from './Loading.js';

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
            console.log("An error occurred minting: " + error);
            console.log("Error  code: " + error.code);
            console.log("Error message: " + error.message);
            console.log("ERROR: " + JSON.stringify(error));
                        
            if (error.code === "UNSUPPORTED_OPERATION" && err.message.startsWith("unknown account")) {
                showErrorMessage("You need to connect an Ethereum wallet like MetaMask.");
            } else {
                handleError(error);
            }            
        }       
    };

    return(
        <div>
        { !randomSeed || !svg ? (
            <Loading/>
        ) : (
            <div>
            <div id='artboard'>
                <img id="artboardImage" src={svg}></img>	
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
                (only pay gas)
            </div>
        </div> 
        )}
    </div>
   );
}