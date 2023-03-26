
import Button from 'react-bootstrap/Button';
import React, {useState} from "react";
import buildAlienWorld from '../utils/worldBuilder.js';
import { mintAlienWorld } from '../utils/BlockchainAPI.js';
import { handleError } from 'utils/ErrorHandler.js';
import { toast } from 'react-toastify';

export default function AlienWorldzArtboard() {
    // const svgDataUri = buildAlienWorld();
    
    const randomCeiling = 5_000_000;
    const initialSeed = Math.trunc(Math.random() * randomCeiling);
    const initialArt = buildAlienWorld(initialSeed);
    const [randomSeed, setRandomSeed] = useState(initialSeed);
    const [svg, setSvg] = useState(initialArt);

    const updateSeed = () => {
        const seed = Math.trunc(Math.random() * randomCeiling);
        const svg = buildAlienWorld(seed);
        setRandomSeed(seed);
        setSvg(svg);
    };

    // updateSeed();

    const mint = async () => {
        console.log("Minting..");
        console.log("Random seed: " + randomSeed);
        try {
            await mintAlienWorld(randomSeed);
            toast.success("Successfully minted your AlienWorldz NFT!");
        } catch (error)  {
            console.log("An error occurred minting: " + error);
            console.log("Error  code: " + error.code);
            console.log("Error message: " + error.message);
                        
            if (error.code === "UNSUPPORTED_OPERATION" && err.message.startsWith("unknown account")) {
                showErrorMessage("You need to connect an Ethereum wallet like MetaMask.");
            } else {
                handleError(error);
            }            
        }       
    };

    return(
        <div id='artboard'>
            <img id="artboardImage" src={svg}></img>	
            <Button variant="primary" onClick={updateSeed}>Generate</Button>
            <Button variant="primary" onClick={mint} randomseed={randomSeed}>Mint</Button>

        </div>	        
    );
}