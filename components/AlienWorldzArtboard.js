
import Button from 'react-bootstrap/Button';
import React, {useState} from "react";
import buildAlienWorld from '../utils/worldBuilder.js';
import { mintAlienWorld } from '../utils/BlockchainAPI.js';

// function update() {
//     console.log("Updating art board..");
//     const svg = buildAlienWorld();
//     // updateArtBoard();
// }

async function mint(randomSeed) {
    console.log("Minting..");
    randomSeed = 999;
    console.log("Random seed: " + randomSeed);
    await mintAlienWorld(randomSeed);
}

export default function AlienWorldzArtboard() {
    // const svgDataUri = buildAlienWorld();
    
    const randomSeed = 600;
    //const randomSeed = Math.trunc(Math.random() * 5_000_000);

    const [value, setValue] = useState(buildAlienWorld(randomSeed));

    return(
        <div id='artboard'>
            <img id="artboardImage" src={value}></img>	
            <Button variant="primary" onClick={() => setValue(buildAlienWorld(randomSeed))}>Generate</Button>
            <Button variant="primary" onClick={mint} randomseed={randomSeed}>Mint</Button>

        </div>	        
    );
}